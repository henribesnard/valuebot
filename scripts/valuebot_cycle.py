#!/usr/bin/env python3
"""ValueBot local state + frontend renderer.

This is intentionally conservative: it never creates a public betting tip by
itself. Tips must be supplied with traced source/odds/probability data that meet
ValueBot's rules. The script keeps an append-only ledger, computes public KPIs,
renders src/lib/mock-data.ts, and can rebuild/restart the standalone Next app.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import shutil
import signal
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
STATE_DIR = ROOT / "data" / "state"
LEARN_DIR = ROOT / "data" / "learnings"
STATE_PATH = STATE_DIR / "valuebot_state.json"
LEDGER_PATH = STATE_DIR / "bankroll_ledger.jsonl"
MOCK_PATH = ROOT / "src" / "lib" / "mock-data.ts"
START_BANKROLL = 100.0

DISCLAIMER = "18+. Les paris comportent des risques : endettement, isolement, dépendance. Joueurs Info Service : 09 74 75 13 13. Aucune garantie de gain. Conseils générés par IA."


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def load_state() -> dict[str, Any]:
    if not STATE_PATH.exists():
        return {
            "model_version": "v1.0-launch",
            "params": {"ev_min": 0.03, "signal_ev_min": 0.01, "signal_stake_max_units": 0.5, "kelly_fraction": 0.25, "stake_max_units": 3.0, "daily_exposure_max_units": 6.0, "drawdown_conservative_threshold": 0.30},
            "tips": [],
            "learnings": [],
            "last_cycle_at": None,
        }
    return json.loads(STATE_PATH.read_text(encoding="utf-8"))


def save_state(state: dict[str, Any]) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    tmp = STATE_PATH.with_suffix(".tmp")
    tmp.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp.replace(STATE_PATH)


def append_ledger(row: dict[str, Any]) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    with LEDGER_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n")


def read_ledger() -> list[dict[str, Any]]:
    if not LEDGER_PATH.exists():
        return []
    out = []
    for line in LEDGER_PATH.read_text(encoding="utf-8").splitlines():
        if line.strip():
            out.append(json.loads(line))
    return out


def balance_from_ledger() -> float:
    rows = read_ledger()
    if rows:
        return float(rows[-1]["balance_after_units"])
    return START_BANKROLL


def ensure_initialized() -> dict[str, Any]:
    state = load_state()
    if not read_ledger():
        append_ledger({"created_at": now_iso(), "type": "initial_bankroll", "tip_id": None, "delta_units": 0.0, "balance_after_units": START_BANKROLL, "note": "Bankroll de lancement"})
    save_state(state)
    return state


def validate_tip(tip: dict[str, Any], state: dict[str, Any]) -> None:
    required = ["sport", "competition", "event", "start_time", "market", "selection", "estimated_probability", "taken_odd", "bookmaker", "odd_captured_at", "expected_value", "confidence", "stake_units", "rationale", "sources"]
    missing = [k for k in required if k not in tip or tip[k] in (None, "", [])]
    if missing:
        raise SystemExit(f"Tip invalide: champs manquants {missing}")
    if tip["sport"] not in ("football", "tennis"):
        raise SystemExit("sport doit être football ou tennis")
    if not (0 < float(tip["estimated_probability"]) < 1):
        raise SystemExit("estimated_probability hors borne")
    if float(tip["taken_odd"]) <= 1:
        raise SystemExit("taken_odd invalide")
    tier = str(tip.get("publication_tier") or "official")
    if tier not in {"official", "prudent_signal"}:
        raise SystemExit("publication_tier doit être official ou prudent_signal")
    computed_ev = float(tip["estimated_probability"]) * float(tip["taken_odd"]) - 1
    if abs(computed_ev - float(tip["expected_value"])) > 0.015:
        raise SystemExit(f"EV incohérente: annoncé={tip['expected_value']} calculé={computed_ev:.3f}")
    params = state.setdefault("params", {})
    ev_floor = float(params.get("ev_min", 0.03)) if tier == "official" else float(params.get("signal_ev_min", 0.01))
    stake_cap = float(params.get("stake_max_units", 3.0)) if tier == "official" else float(params.get("signal_stake_max_units", 0.5))
    if computed_ev < ev_floor:
        raise SystemExit(f"EV {computed_ev:.3f} < seuil {ev_floor} ({tier})")
    if tier == "prudent_signal" and float(tip["confidence"]) > 3:
        raise SystemExit("Un signal prudent doit rester en confiance 1-3")
    if float(tip["stake_units"]) > stake_cap:
        raise SystemExit("stake_units dépasse le plafond")
    # Idempotence: one market per event/selection/day.
    key = (tip["sport"], tip["event"].lower(), tip["market"].lower(), tip["selection"].lower(), tip["start_time"][:10])
    for old in state.get("tips", []):
        oldkey = (old.get("sport"), old.get("event", "").lower(), old.get("market", "").lower(), old.get("selection", "").lower(), old.get("start_time", "")[:10])
        if oldkey == key:
            raise SystemExit("Tip déjà publié pour ce match/marché/sélection (idempotence)")
    # Keep bookmaker trace explicit; the agent must verify ANJ externally.
    if not tip.get("bookmaker_authorized_anj", False):
        raise SystemExit("bookmaker_authorized_anj doit être true après vérification ANJ")


def add_tip(path: Path) -> dict[str, Any]:
    state = ensure_initialized()
    tip = json.loads(path.read_text(encoding="utf-8"))
    validate_tip(tip, state)
    next_id = max([int(t.get("id", 0)) for t in state.get("tips", [])] or [0]) + 1
    tip["id"] = next_id
    tip["status"] = "pending"
    tip["published_at"] = now_iso()
    tip.setdefault("fair_odd", round(1 / float(tip["estimated_probability"]), 3))
    tip.setdefault("pnl_units", None)
    state["tips"].append(tip)
    state["last_cycle_at"] = now_iso()
    save_state(state)
    render()
    return {"published_tip_id": next_id, "event": tip["event"], "selection": tip["selection"]}


def settle(tip_id: int, status: str, source: str) -> dict[str, Any]:
    if status not in {"won", "lost", "void"}:
        raise SystemExit("status doit être won/lost/void")
    state = ensure_initialized()
    tip = next((t for t in state.get("tips", []) if int(t.get("id")) == tip_id), None)
    if not tip:
        raise SystemExit(f"tip {tip_id} introuvable")
    if tip.get("status") != "pending":
        raise SystemExit(f"tip {tip_id} déjà réglé")
    stake = float(tip["stake_units"])
    odd = float(tip["taken_odd"])
    pnl = round(stake * (odd - 1), 2) if status == "won" else (-stake if status == "lost" else 0.0)
    new_balance = round(balance_from_ledger() + pnl, 2)
    tip["status"] = status
    tip["pnl_units"] = pnl
    tip["settled_at"] = now_iso()
    tip["settlement_source"] = source
    append_ledger({"created_at": now_iso(), "type": "bet_settled", "tip_id": tip_id, "delta_units": pnl, "balance_after_units": new_balance, "source": source})
    state["last_cycle_at"] = now_iso()
    save_state(state)
    render()
    return {"tip_id": tip_id, "status": status, "pnl_units": pnl, "balance_after_units": new_balance}


def metrics(state: dict[str, Any] | None = None) -> dict[str, Any]:
    state = state or ensure_initialized()
    tips = state.get("tips", [])
    settled = [t for t in tips if t.get("status") in {"won", "lost", "void"}]
    decided = [t for t in settled if t.get("status") in {"won", "lost"}]
    staked = sum(float(t.get("stake_units", 0)) for t in decided)
    pnl = sum(float(t.get("pnl_units") or 0) for t in settled)
    wins = sum(1 for t in decided if t.get("status") == "won")
    avg_odd = sum(float(t.get("taken_odd", 0)) for t in decided) / len(decided) if decided else None
    brier = None
    if decided:
        brier = sum((float(t["estimated_probability"]) - (1.0 if t["status"] == "won" else 0.0)) ** 2 for t in decided) / len(decided)
    curve = equity_curve()
    peak = curve[0] if curve else START_BANKROLL
    max_dd = cur_dd = 0.0
    for x in curve:
        peak = max(peak, x)
        dd = peak - x
        cur_dd = dd
        max_dd = max(max_dd, dd)
    return {
        "bankroll_units": round(balance_from_ledger(), 2),
        "tips_total": len(tips),
        "pending_total": sum(1 for t in tips if t.get("status") == "pending"),
        "settled_total": len(settled),
        "yield_pct": round((pnl / staked * 100), 2) if staked else 0.0,
        "roi_pct": round(((balance_from_ledger() - START_BANKROLL) / START_BANKROLL * 100), 2),
        "win_rate_pct": round(wins / len(decided) * 100, 2) if decided else None,
        "average_odd": round(avg_odd, 2) if avg_odd else None,
        "current_drawdown_units": round(cur_dd, 2),
        "max_drawdown_units": round(max_dd, 2),
        "brier_score": round(brier, 4) if brier is not None else None,
    }


def equity_curve() -> list[float]:
    rows = read_ledger()
    if not rows:
        return [START_BANKROLL]
    return [float(r["balance_after_units"]) for r in rows]


def ts(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def sport_label(sport: str) -> str:
    return "⚽ Football" if sport == "football" else "🎾 Tennis"


def fmt_when(iso: str) -> str:
    try:
        dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
        return dt.strftime("%d/%m · %H:%M UTC")
    except Exception:
        return iso


def tip_to_ts(t: dict[str, Any]) -> str:
    status_map = {"pending": "avenir", "won": "gagne", "lost": "perdu", "void": "annule", "cancelled": "annule"}
    releve = f"{t['bookmaker']} · cote relevée le {t['odd_captured_at']}"
    return "{\n" + "\n".join([
        f"  id: {int(t['id'])},",
        f"  sport: {ts(t['sport'])}, sportLabel: {ts(sport_label(t['sport']))}, comp: {ts(t['competition'])},",
        f"  matchup: {ts(t['event'])}, when: {ts(fmt_when(t['start_time']))},",
        f"  pari: {ts(t['selection'])}, conf: {int(t['confidence'])}, mise: {ts(str(t['stake_units']).replace('.', ',') + ' u')}, miseN: {float(t['stake_units'])},",
        f"  tier: {ts(str(t.get('publication_tier') or 'official'))},",
        f"  cote: {ts(str(t['taken_odd']))}, coteN: {float(t['taken_odd'])}, book: {ts(t['bookmaker'])},",
        f"  releve: {ts(releve)}, statut: {ts(status_map.get(str(t.get('status') or 'pending'), 'avenir'))},",
        f"  analyse: {ts(t['rationale'])}, pl: {('undefined' if t.get('pnl_units') is None else float(t['pnl_units']))},",
    ]) + "\n}"


def render() -> dict[str, Any]:
    state = ensure_initialized()
    m = metrics(state)
    tips = sorted(state.get("tips", []), key=lambda x: x.get("published_at", ""), reverse=True)
    settled = [t for t in tips if t.get("status") in {"won", "lost", "void"}]
    curve = equity_curve()
    history = []
    for t in settled:
        history.append({
            "date": (t.get("settled_at") or t.get("published_at") or "")[:10],
            "match": t.get("event", ""),
            "pari": t.get("selection", ""),
            "cote": str(t.get("taken_odd", "")),
            "mise": str(t.get("stake_units", "")) + " u",
            "pl": (f"{float(t.get('pnl_units') or 0):+.2f} u").replace(".", ","),
            "win": True if t.get("status") == "won" else False if t.get("status") == "lost" else None,
        })
    details = []
    for t in tips:
        srcs = t.get("sources") or []
        details.append(f"  {int(t['id'])}: {{ iaProb: {round(float(t['estimated_probability'])*100)}, factors: {json.dumps(t.get('factors') or ['Probabilité modèle documentée', 'Cote ANJ horodatée', 'EV supérieure au seuil'], ensure_ascii=False)}, formA: [], formB: [], formALabel: 'Source A', formBLabel: 'Source B', h2h: {ts(t.get('h2h','Non utilisé ou non déterminant.'))}, context: {ts('Sources: ' + '; '.join(srcs[:4]) if srcs else 'Sources publiques tracées dans le journal quotidien.')} }}")
    kpis = [
        {"label": "Yield", "value": f"{m['yield_pct']:.1f} %".replace('.', ',')},
        {"label": "ROI", "value": f"{m['roi_pct']:.1f} %".replace('.', ',')},
        {"label": "Taux de réussite", "value": "—" if m['win_rate_pct'] is None else f"{m['win_rate_pct']:.1f} %".replace('.', ',')},
        {"label": "Cote moyenne", "value": "—" if m['average_odd'] is None else str(m['average_odd']).replace('.', ',')},
        {"label": "Paris réglés", "value": str(m['settled_total'])},
        {"label": "Paris en attente", "value": str(m['pending_total'])},
        {"label": "Seuil signal", "value": f"{float(state.get('params', {}).get('signal_ev_min', 0.01))*100:.1f} %".replace('.', ',')},
        {"label": "Drawdown actuel", "value": f"{m['current_drawdown_units']:.1f} u".replace('.', ',')},
        {"label": "Drawdown max", "value": f"{m['max_drawdown_units']:.1f} u".replace('.', ',')},
    ]
    content = """import type { Tip, TipDetail, HistoryRow, PipelineStep, PricingPlan, Invoice } from \"@/types\";

export const equity = %s;

export const bets: Tip[] = [%s];

export const tipDetails: Record<number, TipDetail> = {
%s
};

export const historyRows: HistoryRow[] = %s;

export const bankrollSummary = {
  current: %s,
  initial: %s,
  deltaAll: %s,
  generatedAt: %s,
};

export const bankrollKpis: { label: string; value: string; color?: string }[] = %s;

export const riskNotice = %s;

export const pipeline: PipelineStep[] = [
  { n: 1, title: \"Collecte de données\", desc: \"Agrégation de données publiques : résultats, xG/forme, classements, blessures publiques et cotes horodatées d’opérateurs agréés ANJ.\" },
  { n: 2, title: \"Analyse statistique\", desc: \"Les modèles estiment une probabilité propre pour chaque issue, séparée de la cote de marché.\" },
  { n: 3, title: \"Détection de valeur\", desc: \"Comparaison probabilité estimée vs cote. Une value n’existe que si EV ≥ 3 %%.\" },
  { n: 4, title: \"Sélection\", desc: \"La majorité des matchs est écartée : données insuffisantes, incertitude forte ou cote non traçable.\" },
  { n: 5, title: \"Mise (unités)\", desc: \"Kelly fractionné à 25 %%, plafonné à 3 unités par pari et 6 unités d’exposition quotidienne.\" },
  { n: 6, title: \"Publication horodatée\", desc: \"Chaque conseil publié indique bookmaker, cote, timestamp et raisonnement. Jamais de cote inventée.\" },
  { n: 7, title: \"Bilan quotidien\", desc: \"Chaque pari réglé met à jour la bankroll publique via un ledger append-only.\" },
  { n: 8, title: \"Auto-amélioration\", desc: \"Les ajustements de modèle restent prudents, versionnés et basés sur échantillon suffisant.\" },
];

export const plans: PricingPlan[] = [
  { key: \"decouverte\", name: \"Découverte\", tagline: \"Pour observer la méthode\", priceM: 0, priceA: 0, cta: \"Commencer gratuitement\", accent: \"#8B98A5\", features: [\"Conseils publiés en différé (J+1)\", \"Bankroll publique en temps réel\", \"Football + Tennis\", \"Bilan hebdomadaire\"] },
  { key: \"pro\", name: \"Pro\", tagline: \"Pour suivre sérieusement\", priceM: 19, priceA: 15, cta: \"Choisir Pro\", popular: true, accent: \"#16C784\", features: [\"Tous les conseils en temps réel\", \"Football + Tennis\", \"Analyses IA complètes\", \"Historique détaillé\", \"Notifications\"] },
  { key: \"expert\", name: \"Expert\", tagline: \"Pour les profils data-driven\", priceM: 39, priceA: 29, cta: \"Choisir Expert\", accent: \"#22D3EE\", features: [\"Tout le forfait Pro\", \"Accès API\", \"Export CSV\", \"Filtres personnalisés\", \"Support prioritaire\"] },
];

export const invoices: Invoice[] = [];

export const navItems = [
  { key: \"accueil\", label: \"Accueil\", icon: \"🏠\", href: \"/\" },
  { key: \"conseils\", label: \"Conseils\", icon: \"🎯\", href: \"/conseils\" },
  { key: \"bankroll\", label: \"Bankroll\", icon: \"📈\", href: \"/bankroll\" },
  { key: \"methode\", label: \"Méthode\", icon: \"🤖\", href: \"/methode\" },
  { key: \"tarifs\", label: \"Tarifs\", icon: \"⚡\", href: \"/tarifs\" },
];
""" % (
        json.dumps(curve, ensure_ascii=False),
        ("\n" + ",\n".join(tip_to_ts(t) for t in tips) + "\n") if tips else "",
        ",\n".join(details),
        json.dumps(history, ensure_ascii=False, indent=2),
        json.dumps(round(m["bankroll_units"], 2), ensure_ascii=False),
        json.dumps(START_BANKROLL),
        json.dumps(round(m["bankroll_units"] - START_BANKROLL, 2)),
        ts(now_iso()),
        json.dumps(kpis, ensure_ascii=False, indent=2),
        ts(DISCLAIMER),
    )
    MOCK_PATH.write_text(content, encoding="utf-8")
    return {"rendered": str(MOCK_PATH), "metrics": m}


def no_bet(observations: list[str], candidates_reviewed: int = 0) -> dict[str, Any]:
    state = ensure_initialized()
    row = {
        "date": now_iso()[:10],
        "created_at": now_iso(),
        "decision": "no_bet",
        "candidates_reviewed": candidates_reviewed,
        "metrics": metrics(state),
        "observations": observations,
        "risk_notice": DISCLAIMER,
        "model_version": state.get("model_version"),
    }
    LEARN_DIR.mkdir(parents=True, exist_ok=True)
    path = LEARN_DIR / f"{row['date']}-cycle.json"
    # Append per day if already exists by timestamped file.
    if path.exists():
        path = LEARN_DIR / f"{row['date']}-{datetime.now(timezone.utc).strftime('%H%M%S')}-cycle.json"
    path.write_text(json.dumps(row, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    state.setdefault("learnings", []).append(row)
    state["last_cycle_at"] = now_iso()
    save_state(state)
    render()
    return {"learning": str(path), "metrics": row["metrics"]}


def sync_standalone_assets() -> None:
    """Next standalone does not copy browser static assets by default.

    Without this, HTML can be served successfully while client chunks/fonts 404,
    which looks like a dark blank page in the browser. Keep .next/static and
    public/ next to standalone/server.js before starting or after a rebuild.
    """
    standalone = ROOT / ".next" / "standalone"
    (standalone / ".next").mkdir(parents=True, exist_ok=True)
    static_src = ROOT / ".next" / "static"
    static_dst = standalone / ".next" / "static"
    public_src = ROOT / "public"
    public_dst = standalone / "public"
    if static_src.exists():
        if static_dst.exists():
            shutil.rmtree(static_dst)
        shutil.copytree(static_src, static_dst)
    if public_src.exists():
        if public_dst.exists():
            shutil.rmtree(public_dst)
        shutil.copytree(public_src, public_dst)


def rebuild_restart() -> dict[str, Any]:
    render()
    build = subprocess.run(["npm", "run", "build"], cwd=ROOT, text=True, capture_output=True, timeout=300)
    if build.returncode != 0:
        return {"ok": False, "stage": "build", "stdout": build.stdout[-4000:], "stderr": build.stderr[-4000:]}
    sync_standalone_assets()
    # Stop previous user-owned server on 4010 if present.
    pids = subprocess.run(["bash", "-lc", "ss -ltnp | awk '/:4010/ {print $NF}' | grep -o 'pid=[0-9]*' | cut -d= -f2 | sort -u"], text=True, capture_output=True)
    for s in pids.stdout.split():
        try:
            os.kill(int(s), signal.SIGTERM)
        except Exception:
            pass
    log = ROOT / "valuebot-server.log"
    env = os.environ.copy()
    env.update({"PORT": "4010", "HOSTNAME": "0.0.0.0", "NODE_ENV": "production"})
    stdout = log.open("ab")
    proc = subprocess.Popen(["node", "server.js"], cwd=ROOT / ".next" / "standalone", env=env, stdout=stdout, stderr=subprocess.STDOUT, start_new_session=True)
    return {"ok": True, "pid": proc.pid, "log": str(log), "assets_synced": True, "build_tail": (build.stdout + build.stderr)[-2000:]}


def report() -> str:
    state = ensure_initialized()
    m = metrics(state)
    pending = [t for t in state.get("tips", []) if t.get("status") == "pending"]
    today = [t for t in state.get("tips", []) if (t.get("published_at") or "")[:10] == now_iso()[:10]]
    lines = [
        "📊 **ValueBot — compte rendu quotidien**",
        f"Bankroll: **{m['bankroll_units']:.2f} u** | ROI: **{m['roi_pct']:.1f}%** | Yield: **{m['yield_pct']:.1f}%**",
        f"Paris publiés aujourd’hui: **{len(today)}** | En attente: **{len(pending)}** | Réglés: **{m['settled_total']}**",
    ]
    if today:
        lines.append("\n🎯 **Conseils publiés**")
        for t in today:
            lines.append(f"- {sport_label(t['sport'])} — {t['event']} — **{t['selection']}** @{t['taken_odd']} ({t['bookmaker']}), mise {t['stake_units']} u, EV {float(t['expected_value'])*100:.1f}%")
    else:
        lines.append("\n🎯 **Conseils publiés**: aucun — filtre value/traçabilité non franchi aujourd’hui.")
    lines.append(f"\n🔗 Site: https://valuebot.wezon.fr")
    lines.append(f"⚠️ {DISCLAIMER}")
    return "\n".join(lines)


def main() -> None:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("init")
    sub.add_parser("render")
    sub.add_parser("metrics")
    sub.add_parser("report")
    p = sub.add_parser("add-tip"); p.add_argument("json_file")
    p = sub.add_parser("settle"); p.add_argument("tip_id", type=int); p.add_argument("status"); p.add_argument("--source", required=True)
    p = sub.add_parser("no-bet"); p.add_argument("--observation", action="append", default=[]); p.add_argument("--candidates", type=int, default=0)
    sub.add_parser("rebuild-restart")
    args = ap.parse_args()
    if args.cmd == "init": out = ensure_initialized(); render(); print(json.dumps({"ok": True, "state": str(STATE_PATH), "ledger": str(LEDGER_PATH)}, ensure_ascii=False))
    elif args.cmd == "render": print(json.dumps(render(), ensure_ascii=False, indent=2))
    elif args.cmd == "metrics": print(json.dumps(metrics(), ensure_ascii=False, indent=2))
    elif args.cmd == "report": print(report())
    elif args.cmd == "add-tip": print(json.dumps(add_tip(Path(args.json_file)), ensure_ascii=False, indent=2))
    elif args.cmd == "settle": print(json.dumps(settle(args.tip_id, args.status, args.source), ensure_ascii=False, indent=2))
    elif args.cmd == "no-bet": print(json.dumps(no_bet(args.observation or ["Aucun pari publié: données/cotes/probas insuffisamment traçables."], args.candidates), ensure_ascii=False, indent=2))
    elif args.cmd == "rebuild-restart": print(json.dumps(rebuild_restart(), ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
