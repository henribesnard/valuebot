"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";

type RawTip = {
  id?: number;
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
  status?: string;
  published_at?: string;
};

const emptyForm: RawTip = {
  sport: "football",
  competition: "FIFA World Cup / Coupe du Monde",
  event: "",
  start_time: "",
  market: "Résultat 1N2",
  selection: "",
  estimated_probability: 0.55,
  taken_odd: 2,
  bookmaker: "Winamax",
  bookmaker_authorized_anj: true,
  odd_captured_at: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  expected_value: 0.1,
  confidence: 3,
  stake_units: 1,
  rationale: "",
  sources: ["https://www.winamax.fr/paris-sportifs/sports/1", "https://anj.fr/offre-de-jeu-et-marche/operateurs-agrees"],
  factors: [],
  h2h: "Non utilisé ou non déterminant.",
};

function token() {
  return typeof window === "undefined" ? null : localStorage.getItem("vb_access_token");
}

export default function AdminTipsPanel() {
  const [tips, setTips] = useState<RawTip[]>([]);
  const [form, setForm] = useState<RawTip>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const ev = useMemo(() => Number((Number(form.estimated_probability) * Number(form.taken_odd) - 1).toFixed(3)), [form.estimated_probability, form.taken_odd]);

  const loadTips = async () => {
    const access = token();
    if (!access) return;
    const res = await apiFetch<{ tips: RawTip[] }>("/api/admin/tips", { token: access });
    setTips(res.tips);
  };

  useEffect(() => {
    loadTips().catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible"));
  }, []);

  useEffect(() => {
    setForm((prev) => ({ ...prev, expected_value: ev }));
  }, [ev]);

  const update = <K extends keyof RawTip>(key: K, value: RawTip[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const parseLines = (value: string) => value.split("\n").map((x) => x.trim()).filter(Boolean);

  const submit = async () => {
    setLoading(true); setError(""); setMessage("");
    try {
      const access = token();
      if (!access) throw new Error("Session expirée");
      const payload = { ...form, sources: form.sources, factors: form.factors || [] };
      if (editingId) {
        await apiFetch("/api/admin/tips", { method: "PATCH", token: access, body: { id: editingId, ...payload } });
        setMessage(`Conseil #${editingId} mis à jour sans rebuild.`);
      } else {
        const res = await apiFetch<{ tip: RawTip }>("/api/admin/tips", { method: "POST", token: access, body: payload });
        setMessage(`Conseil #${res.tip.id} publié sans rebuild.`);
      }
      setEditingId(null); setForm({ ...emptyForm, odd_captured_at: new Date().toISOString().replace(/\.\d{3}Z$/, "Z") });
      await loadTips();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message); else setError(err instanceof Error ? err.message : "Enregistrement impossible");
    } finally { setLoading(false); }
  };

  const edit = (tip: RawTip) => {
    setEditingId(tip.id || null);
    setForm({ ...emptyForm, ...tip, sources: tip.sources || [], factors: tip.factors || [] });
    setMessage(""); setError("");
  };

  const settle = async (tip: RawTip, status: "won" | "lost" | "void") => {
    setLoading(true); setError(""); setMessage("");
    try {
      const access = token();
      if (!access || !tip.id) throw new Error("Session expirée");
      await apiFetch("/api/admin/tips", { method: "PATCH", token: access, body: { id: tip.id, action: "settle", status, source: "Admin ValueBot" } });
      setMessage(`Conseil #${tip.id} réglé (${status}).`);
      await loadTips();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Règlement impossible");
    } finally { setLoading(false); }
  };

  return (
    <div className="grid grid-cols-1 desktop:grid-cols-[1fr_0.9fr] gap-5">
      <div className="bg-vb-bg-card-subtle border border-vb-border rounded-[18px] p-6">
        <h3 className="font-heading font-semibold text-[17px] mb-4">{editingId ? `Modifier le conseil #${editingId}` : "Publier un conseil"}</h3>
        {message && <div className="mb-4 text-sm text-vb-green bg-vb-green-bg border border-vb-green/30 rounded-xl p-3">{message}</div>}
        {error && <div className="mb-4 text-sm text-vb-red-light bg-red-500/10 border border-red-500/30 rounded-xl p-3">{error}</div>}
        <div className="grid grid-cols-1 mobile:grid-cols-2 gap-4">
          <label className="text-sm">Sport<select value={form.sport} onChange={(e) => update("sport", e.target.value as RawTip["sport"])} className="mt-1 w-full px-3 py-3 rounded-xl bg-white/[0.04] border border-vb-border-input"><option value="football">Football</option><option value="tennis">Tennis</option></select></label>
          <Input label="Compétition" value={form.competition} onChange={(v) => update("competition", v)} />
          <Input label="Match" value={form.event} onChange={(v) => update("event", v)} />
          <Input label="Début UTC ISO" value={form.start_time} onChange={(v) => update("start_time", v)} placeholder="2026-06-24T22:00:00Z" />
          <Input label="Marché" value={form.market} onChange={(v) => update("market", v)} />
          <Input label="Sélection" value={form.selection} onChange={(v) => update("selection", v)} />
          <Input label="Bookmaker" value={form.bookmaker} onChange={(v) => update("bookmaker", v)} />
          <Input label="Cote relevée UTC ISO" value={form.odd_captured_at} onChange={(v) => update("odd_captured_at", v)} />
          <NumberInput label="Probabilité estimée" value={form.estimated_probability} step="0.01" onChange={(v) => update("estimated_probability", v)} />
          <NumberInput label="Cote" value={form.taken_odd} step="0.01" onChange={(v) => update("taken_odd", v)} />
          <NumberInput label="EV calculée" value={form.expected_value} step="0.001" onChange={(v) => update("expected_value", v)} />
          <NumberInput label="Confiance 1-5" value={form.confidence} step="1" onChange={(v) => update("confidence", v)} />
          <NumberInput label="Mise unités" value={form.stake_units} step="0.1" onChange={(v) => update("stake_units", v)} />
        </div>
        <label className="block mt-4 text-sm">Analyse<textarea value={form.rationale} onChange={(e) => update("rationale", e.target.value)} rows={5} className="mt-1 w-full px-3 py-3 rounded-xl bg-white/[0.04] border border-vb-border-input" /></label>
        <label className="block mt-4 text-sm">Sources (une par ligne)<textarea value={form.sources.join("\n")} onChange={(e) => update("sources", parseLines(e.target.value))} rows={3} className="mt-1 w-full px-3 py-3 rounded-xl bg-white/[0.04] border border-vb-border-input" /></label>
        <label className="block mt-4 text-sm">Facteurs (un par ligne)<textarea value={(form.factors || []).join("\n")} onChange={(e) => update("factors", parseLines(e.target.value))} rows={3} className="mt-1 w-full px-3 py-3 rounded-xl bg-white/[0.04] border border-vb-border-input" /></label>
        <div className="flex gap-3 mt-5">
          <button disabled={loading} onClick={submit} className="px-5 py-[11px] rounded-xl bg-vb-green text-[#08130D] font-bold text-sm disabled:opacity-60">{editingId ? "Mettre à jour" : "Publier"}</button>
          {editingId && <button onClick={() => { setEditingId(null); setForm(emptyForm); }} className="px-5 py-[11px] rounded-xl bg-white/[0.06] border border-vb-border text-sm">Annuler</button>}
        </div>
      </div>

      <div className="bg-vb-bg-card-subtle border border-vb-border rounded-[18px] p-6">
        <h3 className="font-heading font-semibold text-[17px] mb-4">Conseils publiés</h3>
        <div className="flex flex-col gap-3">
          {tips.map((tip) => (
            <div key={tip.id} className="border border-vb-border rounded-xl p-4 bg-white/[0.02]">
              <div className="font-semibold">#{tip.id} · {tip.event}</div>
              <div className="text-xs text-vb-text-secondary mt-1">{tip.selection} @{tip.taken_odd} · {tip.bookmaker} · {tip.status || "pending"}</div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={() => edit(tip)} className="px-3 py-2 rounded-lg bg-white/[0.06] text-xs">Modifier</button>
                {(tip.status || "pending") === "pending" && <><button onClick={() => settle(tip, "won")} className="px-3 py-2 rounded-lg bg-vb-green-bg text-vb-green text-xs">Gagné</button><button onClick={() => settle(tip, "lost")} className="px-3 py-2 rounded-lg bg-red-500/10 text-vb-red-light text-xs">Perdu</button><button onClick={() => settle(tip, "void")} className="px-3 py-2 rounded-lg bg-white/[0.06] text-xs">Annulé</button></>}
              </div>
            </div>
          ))}
          {tips.length === 0 && <p className="text-sm text-vb-text-secondary">Aucun conseil pour l’instant.</p>}
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <label className="text-sm">{label}<input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full px-3 py-3 rounded-xl bg-white/[0.04] border border-vb-border-input" /></label>;
}

function NumberInput({ label, value, step, onChange }: { label: string; value: number; step: string; onChange: (v: number) => void }) {
  return <label className="text-sm">{label}<input type="number" step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full px-3 py-3 rounded-xl bg-white/[0.04] border border-vb-border-input" /></label>;
}
