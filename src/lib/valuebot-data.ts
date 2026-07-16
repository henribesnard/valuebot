import "server-only";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Tip, TipDetail, HistoryRow } from "@/types";

function projectRoot(): string {
  if (process.env.VALUEBOT_ROOT) return process.env.VALUEBOT_ROOT;
  const cwd = process.cwd();
  if (cwd.endsWith(path.join(".next", "standalone"))) return path.resolve(cwd, "..", "..");
  return cwd;
}

const START_BANKROLL = 100.0;
const STATE_PATH = path.join(projectRoot(), "data", "state", "valuebot_state.json");
const LEDGER_PATH = path.join(projectRoot(), "data", "state", "bankroll_ledger.jsonl");

export const riskNotice = "18+. Les paris comportent des risques : endettement, isolement, dépendance. Joueurs Info Service : 09 74 75 13 13. Aucune garantie de gain. Conseils générés par IA.";

export interface RawTip {
  id: number;
  sport: "football" | "tennis";
  competition: string;
  event: string;
  start_time: string;
  market: string;
  selection: string;
  estimated_probability: number;
  taken_odd: number;
  bookmaker: string;
  bookmaker_authorized_anj: boolean;
  odd_captured_at: string;
  expected_value: number;
  confidence: number;
  stake_units: number;
  rationale: string;
  sources: string[];
  factors?: string[];
  h2h?: string;
  status?: "pending" | "won" | "lost" | "void" | "cancelled";
  publication_tier?: "official" | "prudent_signal";
  published_at?: string;
  fair_odd?: number;
  pnl_units?: number | null;
  settled_at?: string;
  settlement_source?: string;
}

interface State {
  model_version: string;
  params: Record<string, number>;
  tips: RawTip[];
  learnings: unknown[];
  last_cycle_at: string | null;
}

export interface PublicValueBotData {
  tips: RawTip[];
  bets: Tip[];
  tipDetails: Record<number, TipDetail>;
  historyRows: HistoryRow[];
  equity: number[];
  bankrollSummary: { current: number; initial: number; deltaAll: number; generatedAt: string };
  bankrollKpis: { label: string; value: string; color?: string }[];
}

function nowIso(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

async function ensureStateDir() {
  await mkdir(path.dirname(STATE_PATH), { recursive: true });
}

export async function loadState(): Promise<State> {
  try {
    const raw = await readFile(STATE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return { model_version: "v1.0-launch", params: {}, tips: [], learnings: [], last_cycle_at: null, ...parsed };
  } catch {
    return {
      model_version: "v1.0-launch",
      params: { ev_min: 0.03, signal_ev_min: 0.01, signal_stake_max_units: 0.5, kelly_fraction: 0.25, stake_max_units: 3, daily_exposure_max_units: 6 },
      tips: [],
      learnings: [],
      last_cycle_at: null,
    };
  }
}

export async function saveState(state: State): Promise<void> {
  await ensureStateDir();
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2) + "\n", "utf8");
}

async function readLedger(): Promise<Array<{ balance_after_units: number }>> {
  try {
    const txt = await readFile(LEDGER_PATH, "utf8");
    return txt.split(/\n+/).filter(Boolean).map((line) => JSON.parse(line));
  } catch {
    return [{ balance_after_units: START_BANKROLL }];
  }
}

export function validateRawTip(input: Partial<RawTip>, state: State, existingId?: number): string[] {
  const errors: string[] = [];
  const required: Array<keyof RawTip> = ["sport", "competition", "event", "start_time", "market", "selection", "estimated_probability", "taken_odd", "bookmaker", "odd_captured_at", "expected_value", "confidence", "stake_units", "rationale", "sources"];
  for (const key of required) {
    const value = input[key];
    if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) errors.push(`Champ requis manquant: ${key}`);
  }
  if (input.sport && !["football", "tennis"].includes(input.sport)) errors.push("sport doit être football ou tennis");
  const p = Number(input.estimated_probability);
  const odd = Number(input.taken_odd);
  const ev = Number(input.expected_value);
  const stake = Number(input.stake_units);
  if (!(p > 0 && p < 1)) errors.push("estimated_probability doit être entre 0 et 1");
  if (!(odd > 1)) errors.push("taken_odd doit être > 1");
  const tier = input.publication_tier ?? "official";
  if (!["official", "prudent_signal"].includes(tier)) errors.push("publication_tier doit être official ou prudent_signal");
  if (Number.isFinite(p) && Number.isFinite(odd) && Number.isFinite(ev) && Math.abs(p * odd - 1 - ev) > 0.015) errors.push("expected_value incohérente avec probabilité*cote-1");
  const evFloor = tier === "prudent_signal" ? Number(state.params?.signal_ev_min ?? 0.01) : Number(state.params?.ev_min ?? 0.03);
  const stakeCap = tier === "prudent_signal" ? Number(state.params?.signal_stake_max_units ?? 0.5) : Number(state.params?.stake_max_units ?? 3);
  if (Number.isFinite(ev) && ev < evFloor) errors.push(`EV sous le seuil ${evFloor} (${tier})`);
  if (!(stake > 0)) errors.push("stake_units doit être > 0");
  if (tier === "prudent_signal" && Number(input.confidence) > 3) errors.push("Un signal prudent doit rester en confiance 1-3");
  if (stake > stakeCap) errors.push("stake_units dépasse le plafond");
  if (!input.bookmaker_authorized_anj) errors.push("bookmaker_authorized_anj doit être true");
  if (input.start_time && Number.isNaN(Date.parse(input.start_time))) errors.push("start_time invalide");
  if (input.odd_captured_at && Number.isNaN(Date.parse(input.odd_captured_at))) errors.push("odd_captured_at invalide");
  if (input.event && input.market && input.selection && input.start_time && input.sport) {
    const key = [input.sport, input.event.toLowerCase(), input.market.toLowerCase(), input.selection.toLowerCase(), input.start_time.slice(0, 10)].join("|");
    if (state.tips.some((old) => old.id !== existingId && [old.sport, old.event.toLowerCase(), old.market.toLowerCase(), old.selection.toLowerCase(), old.start_time.slice(0, 10)].join("|") === key)) {
      errors.push("Conseil déjà publié pour ce match/marché/sélection");
    }
  }
  return errors;
}

export async function createTip(input: Partial<RawTip>): Promise<RawTip> {
  const state = await loadState();
  const errors = validateRawTip(input, state);
  if (errors.length) throw new Error(errors.join("; "));
  const nextId = Math.max(0, ...state.tips.map((t) => Number(t.id) || 0)) + 1;
  const tip: RawTip = {
    ...(input as RawTip),
    id: nextId,
    status: input.status ?? "pending",
    publication_tier: input.publication_tier ?? "official",
    published_at: nowIso(),
    fair_odd: input.fair_odd ?? Number((1 / Number(input.estimated_probability)).toFixed(3)),
    pnl_units: input.pnl_units ?? null,
  };
  state.tips.push(tip);
  state.last_cycle_at = nowIso();
  await saveState(state);
  return tip;
}

export async function updateTip(id: number, patch: Partial<RawTip>): Promise<RawTip> {
  const state = await loadState();
  const idx = state.tips.findIndex((t) => Number(t.id) === id);
  if (idx === -1) throw new Error("Conseil introuvable");
  const next = { ...state.tips[idx], ...patch, id };
  const errors = validateRawTip(next, state, id);
  if (errors.length) throw new Error(errors.join("; "));
  state.tips[idx] = next;
  state.last_cycle_at = nowIso();
  await saveState(state);
  return next;
}

export async function settleTip(id: number, status: "won" | "lost" | "void", source: string): Promise<RawTip> {
  const state = await loadState();
  const tip = state.tips.find((t) => Number(t.id) === id);
  if (!tip) throw new Error("Conseil introuvable");
  if (tip.status !== "pending") throw new Error("Conseil déjà réglé");
  const stake = Number(tip.stake_units);
  const odd = Number(tip.taken_odd);
  tip.status = status;
  tip.pnl_units = status === "won" ? Number((stake * (odd - 1)).toFixed(2)) : status === "lost" ? -stake : 0;
  tip.settled_at = nowIso();
  tip.settlement_source = source;
  const ledger = await readLedger();
  const lastBalance = Number(ledger.at(-1)?.balance_after_units ?? START_BANKROLL);
  await ensureStateDir();
  const row = { created_at: nowIso(), type: "bet_settled", tip_id: id, delta_units: tip.pnl_units, balance_after_units: Number((lastBalance + tip.pnl_units).toFixed(2)), source };
  const { appendFile } = await import("fs/promises");
  await appendFile(LEDGER_PATH, JSON.stringify(row, null, 0) + "\n", "utf8");
  state.last_cycle_at = nowIso();
  await saveState(state);
  return tip;
}

function sportLabel(sport: string): string {
  return sport === "football" ? "⚽ Football" : "🎾 Tennis";
}

function fmtWhen(iso: string): string {
  try {
    const dt = new Date(iso);
    return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "UTC", hour12: false }).format(dt).replace(",", " ·") + " UTC";
  } catch {
    return iso;
  }
}

function statusToTipStatus(status?: string): Tip["statut"] {
  if (status === "won") return "gagne";
  if (status === "lost") return "perdu";
  if (status === "void" || status === "cancelled") return "annule";
  return "avenir";
}

function toTip(t: RawTip): Tip {
  return {
    id: Number(t.id),
    sport: t.sport,
    sportLabel: sportLabel(t.sport),
    comp: t.competition,
    matchup: t.event,
    when: fmtWhen(t.start_time),
    pari: t.selection,
    conf: Number(t.confidence),
    mise: `${String(t.stake_units).replace(".", ",")} u`,
    miseN: Number(t.stake_units),
    cote: String(t.taken_odd),
    coteN: Number(t.taken_odd),
    book: t.bookmaker,
    releve: `${t.bookmaker} · cote relevée le ${t.odd_captured_at}`,
    statut: statusToTipStatus(t.status),
    analyse: t.rationale,
    pl: t.pnl_units ?? undefined,
    tier: t.publication_tier ?? "official",
  };
}

function metrics(tips: RawTip[], equity: number[]) {
  const settled = tips.filter((t) => ["won", "lost", "void"].includes(t.status || ""));
  const decided = settled.filter((t) => ["won", "lost"].includes(t.status || ""));
  const staked = decided.reduce((s, t) => s + Number(t.stake_units || 0), 0);
  const pnl = settled.reduce((s, t) => s + Number(t.pnl_units || 0), 0);
  const wins = decided.filter((t) => t.status === "won").length;
  const averageOdd = decided.length ? decided.reduce((s, t) => s + Number(t.taken_odd), 0) / decided.length : null;
  let peak = equity[0] ?? START_BANKROLL;
  let currentDrawdown = 0;
  let maxDrawdown = 0;
  for (const x of equity) {
    peak = Math.max(peak, x);
    currentDrawdown = peak - x;
    maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
  }
  return {
    bankroll_units: Number((equity.at(-1) ?? START_BANKROLL).toFixed(2)),
    tips_total: tips.length,
    pending_total: tips.filter((t) => (t.status || "pending") === "pending").length,
    settled_total: settled.length,
    yield_pct: staked ? Number(((pnl / staked) * 100).toFixed(2)) : 0,
    roi_pct: Number((((equity.at(-1) ?? START_BANKROLL) - START_BANKROLL) / START_BANKROLL * 100).toFixed(2)),
    win_rate_pct: decided.length ? Number((wins / decided.length * 100).toFixed(2)) : null,
    average_odd: averageOdd ? Number(averageOdd.toFixed(2)) : null,
    current_drawdown_units: Number(currentDrawdown.toFixed(2)),
    max_drawdown_units: Number(maxDrawdown.toFixed(2)),
  };
}

export async function getPublicValueBotData(): Promise<PublicValueBotData> {
  const [state, ledger] = await Promise.all([loadState(), readLedger()]);
  const tips = [...state.tips].sort((a, b) => String(b.published_at || "").localeCompare(String(a.published_at || "")));
  const equity = ledger.length ? ledger.map((r) => Number(r.balance_after_units)) : [START_BANKROLL];
  const m = metrics(state.tips, equity);
  const settledTips = tips.filter((t) => ["won", "lost", "void"].includes(t.status || ""));
  const historyRows: HistoryRow[] = settledTips.map((t) => ({
    date: (t.settled_at || t.published_at || "").slice(0, 10),
    match: t.event,
    pari: t.selection,
    cote: String(t.taken_odd),
    mise: `${t.stake_units} u`,
    pl: `${Number(t.pnl_units || 0) >= 0 ? "+" : ""}${Number(t.pnl_units || 0).toFixed(2).replace(".", ",")} u`,
    win: t.status === "won" ? true : t.status === "lost" ? false : null,
  }));
  const tipDetails: Record<number, TipDetail> = {};
  for (const t of tips) {
    tipDetails[Number(t.id)] = {
      iaProb: Math.round(Number(t.estimated_probability) * 100),
      factors: t.factors?.length ? t.factors : ["Probabilité modèle documentée", "Cote ANJ horodatée", "EV supérieure au seuil"],
      formA: [],
      formB: [],
      formALabel: "Source A",
      formBLabel: "Source B",
      h2h: t.h2h || "Non utilisé ou non déterminant.",
      context: t.sources?.length ? `Sources: ${t.sources.slice(0, 4).join("; ")}` : "Sources publiques tracées.",
    };
  }
  const kpis = [
    { label: "Yield", value: `${m.yield_pct.toFixed(1).replace(".", ",")} %` },
    { label: "ROI", value: `${m.roi_pct.toFixed(1).replace(".", ",")} %` },
    { label: "Taux de réussite", value: m.win_rate_pct == null ? "—" : `${m.win_rate_pct.toFixed(1).replace(".", ",")} %` },
    { label: "Cote moyenne", value: m.average_odd == null ? "—" : String(m.average_odd).replace(".", ",") },
    { label: "Paris réglés", value: String(m.settled_total) },
    { label: "Paris en attente", value: String(m.pending_total) },
    { label: "Drawdown actuel", value: `${m.current_drawdown_units.toFixed(1).replace(".", ",")} u` },
    { label: "Drawdown max", value: `${m.max_drawdown_units.toFixed(1).replace(".", ",")} u` },
  ];
  return {
    tips,
    bets: tips.map(toTip),
    tipDetails,
    historyRows,
    equity,
    bankrollSummary: { current: m.bankroll_units, initial: START_BANKROLL, deltaAll: Number((m.bankroll_units - START_BANKROLL).toFixed(2)), generatedAt: nowIso() },
    bankrollKpis: kpis,
  };
}

export const pipeline = [
  { n: 1, title: "Collecte de données", desc: "Agrégation de données publiques : résultats, forme, classements, blessures publiques et cotes horodatées d’opérateurs agréés ANJ." },
  { n: 2, title: "Analyse statistique", desc: "Les modèles estiment une probabilité propre pour chaque issue, séparée de la cote de marché." },
  { n: 3, title: "Détection de valeur", desc: "Comparaison probabilité estimée vs cote. Une value n’existe que si EV ≥ 3 %." },
  { n: 4, title: "Sélection", desc: "La majorité des matchs est écartée : données insuffisantes, incertitude forte ou cote non traçable." },
  { n: 5, title: "Mise (unités)", desc: "Kelly fractionné à 25 %, plafonné à 3 unités par pari et 6 unités d’exposition quotidienne." },
  { n: 6, title: "Publication horodatée", desc: "Chaque conseil publié indique bookmaker, cote, timestamp et raisonnement. Jamais de cote inventée." },
  { n: 7, title: "Bilan quotidien", desc: "Chaque pari réglé met à jour la bankroll publique via un ledger append-only." },
  { n: 8, title: "Auto-amélioration", desc: "Les ajustements de modèle restent prudents, versionnés et basés sur échantillon suffisant." },
];
