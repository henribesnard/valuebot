"use client";

import { useState } from "react";
import Link from "next/link";
import type { HistoryRow } from "@/types";
import { computeChartPaths } from "@/lib/chart-utils";

type Period = "7" | "30" | "all";

const periodSegments: { key: Period; label: string }[] = [
  { key: "7", label: "7 j" },
  { key: "30", label: "30 j" },
  { key: "all", label: "Depuis le début" },
];

const periodLabelMap: Record<Period, string> = {
  "7": "· 7 derniers jours",
  "30": "· 30 derniers jours",
  all: "· depuis le lancement",
};

export default function BankrollClient({ bankrollKpis, bankrollSummary, equity, historyRows }: { bankrollKpis: { label: string; value: string; color?: string }[]; bankrollSummary: { current: number; initial: number; deltaAll: number; generatedAt: string }; equity: number[]; historyRows: import("@/types").HistoryRow[] }) {
  const [period, setPeriod] = useState<Period>("all");

  const slice =
    period === "7"
      ? equity.slice(-7)
      : period === "30"
        ? equity.slice(-30)
        : equity;

  const periodDelta = `${bankrollSummary.deltaAll >= 0 ? "+" : ""}${bankrollSummary.deltaAll.toFixed(1).replace(".", ",")} u`;
  const periodLabel = periodLabelMap[period];

  const { line, area, lastX, lastY, baseY } = computeChartPaths(
    slice,
    820,
    300,
    8,
    18,
    18,
  );

  return (
    <main className="max-w-content mx-auto px-5 pt-11">
      {/* Header */}
      <h1 className="font-heading font-bold text-[32px] text-vb-text mb-2">
        Bankroll &amp; Performance
      </h1>
      <p className="text-[15px] text-vb-text-secondary mb-8 leading-[1.55]">
        Dashboard public mis à jour à chaque pari réglé. Gestion en unités (1 u
        = 1 % de la bankroll de départ).
      </p>

      {/* Main chart card */}
      <div className="bg-[rgba(22,27,34,0.6)] border border-vb-border rounded-[20px] p-6 mb-[22px]">
        {/* Header row */}
        <div className="flex justify-between items-start flex-wrap gap-[14px] mb-2">
          {/* Left */}
          <div>
            <p className="text-[13px] text-vb-text-secondary mb-1">
              Bankroll {periodLabel}
            </p>
            <p className="font-heading font-bold text-[32px] text-vb-text leading-none">
              {bankrollSummary.current.toFixed(1).replace(".", ",")} u{" "}
              <span className="text-[15px] text-vb-text-secondary font-semibold">
                {periodDelta}
              </span>
            </p>
          </div>
          {/* Right: period selector */}
          <div className="flex gap-[6px] bg-white/[0.04] p-1 rounded-xl">
            {periodSegments.map((seg) => (
              <button
                key={seg.key}
                onClick={() => setPeriod(seg.key)}
                className={`px-[14px] py-2 rounded-[9px] text-[13px] font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                  period === seg.key
                    ? "bg-vb-text text-vb-bg"
                    : "text-vb-text-secondary"
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inline SVG chart */}
        <svg
          width="100%"
          height={300}
          viewBox="0 0 820 300"
          preserveAspectRatio="none"
          className="block"
        >
          <defs>
            <linearGradient id="bankrollPageFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16C784" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#16C784" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Dashed baseline */}
          <line
            x1={8}
            y1={baseY}
            x2={812}
            y2={baseY}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={1}
            strokeDasharray="6 4"
          />

          {/* Gradient fill */}
          <path d={area} fill="url(#bankrollPageFill)" />

          {/* Green line */}
          <path
            d={line}
            fill="none"
            stroke="#16C784"
            strokeWidth={2.6}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* End circle */}
          <circle
            cx={lastX}
            cy={lastY}
            r={5}
            fill="#16C784"
            stroke="#0E1116"
            strokeWidth={2.5}
          />
        </svg>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 mobile:grid-cols-4 gap-[14px] mb-[22px]">
        {bankrollKpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-vb-bg-card-solid border border-vb-border rounded-[14px] p-[18px]"
          >
            <p className="text-xs text-vb-text-secondary mb-[6px]">
              {kpi.label}
            </p>
            <p
              className="font-heading font-bold text-2xl"
              style={{ color: kpi.color ?? "#E6EDF3" }}
            >
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 mobile:grid-cols-2 gap-[18px] mb-[22px]">
        {/* Left: Répartition par sport */}
        <div className="bg-vb-bg-card-solid border border-vb-border rounded-[18px] p-6">
          <h3 className="font-heading font-semibold text-[17px] text-vb-text mb-[18px]">
            Répartition par sport
          </h3>
          <p className="text-[13.5px] text-vb-text-secondary leading-[1.65]">
            La répartition sera calculée automatiquement dès que des paris réels
            auront été publiés et réglés. Les anciennes performances de
            démonstration ont été retirées : seules les données traçables de
            ValueBot alimentent désormais ce dashboard.
          </p>
        </div>

        {/* Right: Variance card */}
        <div
          className="rounded-[18px] p-6 border border-[rgba(234,57,67,0.25)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(234,57,67,0.08), rgba(234,57,67,0.02))",
          }}
        >
          <h3 className="font-heading font-semibold text-[17px] text-vb-red-light mb-3">
            La variance existe. Voici nos pires séries.
          </h3>
          <p className="text-[13px] text-vb-text-secondary leading-[1.55] mb-4">
            Aucun système ne gagne à tous les coups. Nous affichons nos pires
            séquences pour prouver notre transparence et montrer que la variance
            fait partie du jeu.
          </p>

          <div className="flex gap-[14px] flex-wrap">
            <div className="flex-1 min-w-[120px] bg-black/20 rounded-xl p-[14px]">
              <p className="text-[11px] text-vb-text-muted mb-1">Pire série</p>
              <p className="font-heading font-bold text-xl text-vb-red mb-1">
                0,0 u
              </p>
              <p className="text-[11px] text-vb-text-secondary">
                aucune série réglée à ce stade
              </p>
            </div>
            <div className="flex-1 min-w-[120px] bg-black/20 rounded-xl p-[14px]">
              <p className="text-[11px] text-vb-text-muted mb-1">
                Temps de récupération
              </p>
              <p className="font-heading font-bold text-xl text-vb-text mb-1">
                —
              </p>
              <p className="text-[11px] text-vb-text-secondary">
                calculé après données réelles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="bg-vb-bg-card-solid border border-vb-border rounded-[18px] p-6 mb-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-semibold text-[17px] text-vb-text">
            Historique des paris
          </h3>
          <button className="text-[13px] text-vb-cyan hover:underline cursor-pointer">
            ↓ Exporter CSV
          </button>
        </div>

        <div className="overflow-x-auto vb-scroll">
          <table className="w-full border-collapse text-[13px] min-w-[560px]">
            <thead>
              <tr className="text-vb-text-muted text-left text-[11px] tracking-wider">
                <th className="pb-3 font-semibold">DATE</th>
                <th className="pb-3 font-semibold">MATCH</th>
                <th className="pb-3 font-semibold">PARI</th>
                <th className="pb-3 font-semibold text-right">COTE</th>
                <th className="pb-3 font-semibold text-right">MISE</th>
                <th className="pb-3 font-semibold text-right">P/L</th>
              </tr>
            </thead>
            <tbody>
              {historyRows.map((row: HistoryRow, i: number) => (
                <tr key={i} className="border-t border-vb-border-subtle">
                  <td className="py-3 text-vb-text-secondary whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="py-3">{row.match}</td>
                  <td className="py-3 text-vb-text-tag">{row.pari}</td>
                  <td className="py-3 text-right font-heading">{row.cote}</td>
                  <td className="py-3 text-right text-vb-text-secondary">
                    {row.mise}
                  </td>
                  <td
                    className="py-3 text-right font-heading font-semibold"
                    style={{
                      color:
                        row.win === true
                          ? "#16C784"
                          : row.win === false
                            ? "#EA3943"
                            : "#8B98A5",
                    }}
                  >
                    {row.pl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
