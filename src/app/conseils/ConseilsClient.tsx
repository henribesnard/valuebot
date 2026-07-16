"use client";

import { useState } from "react";
import type { Tip } from "@/types";
import TipCard from "@/components/tips/TipCard";

type SportFilter = "tous" | "football" | "tennis";
type StatutFilter = "tous" | "avenir" | "regle";

export default function ConseilsClient({ bets }: { bets: Tip[] }) {
  const [sport, setSport] = useState<SportFilter>("tous");
  const [statut, setStatut] = useState<StatutFilter>("tous");

  const filtered = bets.filter((b) => {
    const matchSport = sport === "tous" || b.sport === sport;
    const matchStatut = statut === "tous" || (statut === "avenir" ? b.statut === "avenir" : b.statut !== "avenir");
    return matchSport && matchStatut;
  });

  const sportChips: { value: SportFilter; label: string }[] = [
    { value: "tous", label: "Tous" },
    { value: "football", label: "⚽ Football" },
    { value: "tennis", label: "🎾 Tennis" },
  ];

  const statutChips: { value: StatutFilter; label: string }[] = [
    { value: "tous", label: "Tous" },
    { value: "avenir", label: "À venir" },
    { value: "regle", label: "Réglés" },
  ];

  return (
    <div className="max-w-content mx-auto px-5 pt-11">
      <h1 className="font-heading font-bold text-[clamp(28px,3.6vw,40px)] m-0 mb-2 tracking-tight">Conseils</h1>
      <p className="text-[15px] text-vb-text-secondary m-0 mb-[26px] max-w-[640px]">
        Chaque pari est généré par l&apos;IA, publié avec sa cote horodatée chez un opérateur agréé ANJ, puis réglé en toute transparence. <span className="text-vb-cyan-light">{filtered.length} conseils affichés.</span>
      </p>

      <div className="flex flex-wrap gap-5 mb-[26px]">
        <div>
          <div className="text-[11px] text-vb-text-muted font-semibold tracking-wider mb-2">SPORT</div>
          <div className="flex gap-2 flex-wrap">
            {sportChips.map((chip) => (
              <button key={chip.value} onClick={() => setSport(chip.value)} className={`px-[14px] py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-colors border ${sport === chip.value ? "border-vb-green bg-vb-green-bg text-vb-green" : "border-vb-border-strong text-vb-text-secondary hover:text-vb-text hover:border-vb-border-hover"}`} style={{ background: sport === chip.value ? undefined : "transparent" }}>
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-vb-text-muted font-semibold tracking-wider mb-2">STATUT</div>
          <div className="flex gap-2 flex-wrap">
            {statutChips.map((chip) => (
              <button key={chip.value} onClick={() => setStatut(chip.value)} className={`px-[14px] py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-colors border ${statut === chip.value ? "border-vb-green bg-vb-green-bg text-vb-green" : "border-vb-border-strong text-vb-text-secondary hover:text-vb-text hover:border-vb-border-hover"}`} style={{ background: statut === chip.value ? undefined : "transparent" }}>
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 mobile:grid-cols-2 gap-[18px] pb-10">
        {filtered.map((bet) => <TipCard key={bet.id} tip={bet} showAnalysis={true} />)}
        {filtered.length === 0 && (
          <div className="mobile:col-span-2 bg-vb-bg-card-subtle border border-vb-border rounded-[18px] p-6 text-vb-text-secondary">
            Aucun conseil ne correspond aux filtres sélectionnés.
          </div>
        )}
      </div>
    </div>
  );
}
