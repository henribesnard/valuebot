import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getPublicValueBotData } from "@/lib/valuebot-data";
import { computeChartPaths } from "@/lib/chart-utils";
import TipCard from "@/components/tips/TipCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AccueilPage() {
  noStore();
  const { equity, bets, bankrollSummary, bankrollKpis } = await getPublicValueBotData();
  const heroChart = computeChartPaths(equity, 560, 200, 6, 14, 14);
  const mainChart = computeChartPaths(equity, 820, 300, 8, 18, 18);
  const todayBets = bets.filter((b) => b.statut === "avenir").slice(0, 3);
  const yieldGlobal = bankrollKpis.find((kpi) => kpi.label === "Yield")?.value ?? "0,0 %";
  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="max-w-content mx-auto px-5 pt-14 pb-7">
        <div className="grid grid-cols-1 mobile:grid-cols-2 gap-11 items-center">
          {/* Left column */}
          <div>
            {/* 100% IA badge */}
            <div className="inline-flex items-center gap-2 px-[13px] py-[7px] rounded-full bg-gradient-to-r from-[rgba(34,211,238,0.12)] to-[rgba(124,92,252,0.12)] border border-[rgba(34,211,238,0.3)] mb-6">
              <span className="text-[15px] leading-none">{"🤖"}</span>
              <span className="text-[12.5px] font-semibold text-vb-cyan-light">
                Conseils 100% générés par IA
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading font-bold text-[clamp(34px,5vw,54px)] leading-[1.05] tracking-tight m-0 mb-5">
              Des pronostics générés par IA.
              <br />
              <span className="text-vb-green">Une bankroll publique.</span>
              <br />
              Aucune promesse, des preuves.
            </h1>

            {/* Subtitle */}
            <p className="text-[clamp(15px,1.6vw,18px)] leading-[1.6] text-vb-text-secondary max-w-[520px] mb-[30px]">
              ValueBot publie chaque jour des analyses football &amp; tennis
              produites par des agents IA. Chaque cote est horodatée,
              chaque pari est tracé, et la bankroll est mise à
              jour en temps réel — pour prouver la
              rentabilité sur le long terme.
            </p>

            {/* CTA buttons */}
            <div className="flex gap-3 flex-wrap mb-[38px]">
              <Link
                href="/conseils"
                className="inline-block px-[22px] py-[14px] rounded-xl bg-vb-green text-[#08130D] font-bold text-[15px] no-underline shadow-[0_8px_24px_rgba(22,199,132,0.25)] hover:brightness-110 transition-all"
              >
                Voir les conseils du jour
              </Link>
              <Link
                href="/methode"
                className="inline-block px-[22px] py-[14px] rounded-xl bg-white/5 border border-vb-border-strong text-vb-text font-semibold text-[15px] no-underline hover:bg-white/[0.08] transition-colors"
              >
                Comment ça marche
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex gap-[30px] flex-wrap">
              <div>
                <div className="font-heading font-bold text-[30px] tracking-tight">
                  {bankrollSummary.current.toFixed(1).replace(".", ",")}{" "}
                  <span className="text-[15px] text-vb-text-secondary">u</span>
                </div>
                <div className="text-[12.5px] text-vb-text-secondary mt-0.5">
                  Bankroll actuelle
                </div>
              </div>
              <div>
                <div className="font-heading font-bold text-[30px] tracking-tight text-vb-green">
                  {yieldGlobal.replace(" ", "")}
                </div>
                <div className="text-[12.5px] text-vb-text-secondary mt-0.5">
                  Yield global
                </div>
              </div>
              <div>
                <div className="font-heading font-bold text-[30px] tracking-tight">
                  {bets.length}
                </div>
                <div className="text-[12.5px] text-vb-text-secondary mt-0.5">
                  Paris suivis
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Hero chart card */}
          <div
            className="rounded-[20px] p-6 border border-vb-border"
            style={{
              background:
                "linear-gradient(180deg, rgba(22,27,34,0.9), rgba(22,27,34,0.5))",
              boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
            }}
          >
            {/* Chart header */}
            <div className="flex justify-between items-start mb-[6px]">
              <div>
                <div className="text-[13px] text-vb-text-secondary">
                  Évolution de la bankroll
                </div>
                <div className="font-heading font-bold text-[26px] mt-0.5">
                  {bankrollSummary.current.toFixed(1).replace(".", ",")} u{" "}
                  <span className="text-sm text-vb-text-secondary font-semibold">
                    lancement
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-[6px] text-[11px] text-vb-text-secondary">
                <span className="w-[7px] h-[7px] rounded-full bg-vb-green animate-vb-pulse" />
                En direct
              </div>
            </div>

            {/* Inline hero SVG chart */}
            <svg
              width="100%"
              height="200"
              viewBox="0 0 560 200"
              preserveAspectRatio="none"
              className="block mt-[10px]"
            >
              <defs>
                <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="rgba(22,199,132,0.35)" />
                  <stop offset="1" stopColor="rgba(22,199,132,0)" />
                </linearGradient>
              </defs>
              <path d={heroChart.area} fill="url(#heroFill)" />
              <path
                d={heroChart.line}
                fill="none"
                stroke="#16C784"
                strokeWidth="2.4"
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
              />
              <circle
                cx={heroChart.lastX}
                cy={heroChart.lastY}
                r="4"
                fill="#16C784"
                stroke="#0E1116"
                strokeWidth="2"
              />
            </svg>

            {/* Chart footer */}
            <div className="flex justify-between text-[11px] text-vb-text-muted mt-2">
              <span>Lancement · {bankrollSummary.initial.toFixed(1).replace(".", ",")} u</span>
              <span>Aujourd'hui · {bankrollSummary.current.toFixed(1).replace(".", ",")} u</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ AI TRANSPARENCY BANNER ============ */}
      <section className="max-w-content mx-auto px-5">
        <div
          className="flex items-center gap-[18px] flex-wrap p-[18px_22px] rounded-2xl border border-[rgba(34,211,238,0.2)]"
          style={{
            background:
              "linear-gradient(90deg, rgba(34,211,238,0.08), rgba(124,92,252,0.06))",
          }}
        >
          <div className="text-[26px]">{"🤖"}</div>
          <div className="flex-1 min-w-[240px] text-[14.5px] leading-[1.5]">
            <strong className="text-vb-text">
              100% des analyses de ce site sont produites par des agents IA.
            </strong>{" "}
            <span className="text-vb-text-secondary">
              Aucun humain ne modifie les conseils, ni les cotes, ni les bilans.
            </span>
          </div>
          <Link
            href="/methode"
            className="text-[13.5px] font-semibold text-vb-cyan no-underline whitespace-nowrap hover:underline"
          >
            Comment ça marche →
          </Link>
        </div>
      </section>

      {/* ============ LA PREUVE PAR LA COURBE ============ */}
      <section className="max-w-content mx-auto px-5 mt-12">
        <div className="flex items-baseline gap-3 mb-[18px]">
          <h2 className="font-heading font-bold text-[clamp(22px,2.6vw,30px)] m-0 tracking-tight">
            La preuve par la courbe
          </h2>
          <span className="text-[13px] text-vb-text-secondary">
            depuis le lancement
          </span>
        </div>

        <div className="bg-[rgba(22,27,34,0.6)] border border-vb-border rounded-[20px] p-[26px]">
          {/* Main bankroll SVG */}
          <svg
            width="100%"
            height="320"
            viewBox="0 0 820 320"
            preserveAspectRatio="none"
            className="block"
          >
            <defs>
              <linearGradient id="mainFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(22,199,132,0.28)" />
                <stop offset="1" stopColor="rgba(22,199,132,0)" />
              </linearGradient>
            </defs>
            {/* Baseline dashed line */}
            <line
              x1="0"
              y1={mainChart.baseY}
              x2="820"
              y2={mainChart.baseY}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1"
              strokeDasharray="5 6"
              vectorEffect="non-scaling-stroke"
            />
            <path d={mainChart.area} fill="url(#mainFill)" />
            <path
              d={mainChart.line}
              fill="none"
              stroke="#16C784"
              strokeWidth="2.6"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />
            <circle
              cx={mainChart.lastX}
              cy={mainChart.lastY}
              r="5"
              fill="#16C784"
              stroke="#0E1116"
              strokeWidth="2.5"
            />
          </svg>

          {/* Legend row */}
          <div className="flex justify-between items-center flex-wrap gap-3 mt-[14px]">
            <div className="flex items-center gap-[18px] text-[12.5px] text-vb-text-secondary">
              <span className="flex items-center gap-[6px]">
                <span className="w-[10px] h-[3px] bg-vb-green rounded-sm" />
                Bankroll
              </span>
              <span className="flex items-center gap-[6px]">
                <span
                  className="w-[10px]"
                  style={{ borderTop: "2px dashed rgba(255,255,255,0.4)" }}
                />
                Mise de départ (100 u)
              </span>
            </div>
            <Link
              href="/bankroll"
              className="text-[13px] font-semibold text-vb-cyan no-underline hover:underline"
            >
              Voir le dashboard complet →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CONSEILS DU JOUR ============ */}
      <section className="max-w-content mx-auto px-5 mt-13">
        <div className="flex items-baseline justify-between flex-wrap gap-[10px] mb-[18px]">
          <h2 className="font-heading font-bold text-[clamp(22px,2.6vw,30px)] m-0 tracking-tight">
            Conseils du jour
          </h2>
          <Link
            href="/conseils"
            className="text-[13.5px] font-semibold text-vb-cyan no-underline hover:underline"
          >
            Tous les conseils →
          </Link>
        </div>

        <div className="grid grid-cols-1 mobile:grid-cols-2 wide:grid-cols-3 gap-[18px]">
          {todayBets.length === 0 ? (
            <div className="mobile:col-span-2 wide:col-span-3 rounded-[18px] border border-vb-border bg-vb-bg-card-subtle p-6 text-vb-text-secondary leading-[1.6]">
              Aucun pari publié aujourd'hui : le cycle initial n'a pas trouvé de sélection avec données publiques fiables, cote ANJ horodatée et EV positive vérifiable. Mieux vaut un silence honnête qu'un pari sans valeur.
            </div>
          ) : (
            todayBets.map((bet) => (
              <TipCard key={bet.id} tip={bet} showAnalysis={false} />
            ))
          )}
        </div>
      </section>

      {/* ============ POURQUOI UNE IA ============ */}
      <section className="max-w-content mx-auto px-5 mt-14 pb-16">
        <h2 className="font-heading font-bold text-[clamp(22px,2.6vw,30px)] m-0 mb-[22px] tracking-tight">
          Pourquoi confier les pronostics à une IA ?
        </h2>

        <div className="grid gap-[18px]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {/* Card 1: Zero emotion */}
          <div className="bg-vb-bg-card-solid border border-vb-border rounded-[18px] p-6">
            <div
              className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[22px] mb-4"
              style={{
                background: "rgba(124,92,252,0.14)",
                border: "1px solid rgba(124,92,252,0.3)",
              }}
            >
              {"🧊"}
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">
              Zéro émotion
            </h3>
            <p className="text-sm leading-[1.6] text-vb-text-secondary">
              Pas de tilt, pas de coup de cœur, pas de revanche après
              une perte. Le modèle applique la même discipline sur
              chaque pari, gagnant comme perdant.
            </p>
          </div>

          {/* Card 2: Selectivite */}
          <div className="bg-vb-bg-card-solid border border-vb-border rounded-[18px] p-6">
            <div
              className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[22px] mb-4"
              style={{
                background: "rgba(22,199,132,0.14)",
                border: "1px solid rgba(22,199,132,0.3)",
              }}
            >
              {"🎯"}
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">
              Sélectivité
            </h3>
            <p className="text-sm leading-[1.6] text-vb-text-secondary">
              L'IA n'analyse que la valeur. Certains jours, elle peut ne publier
              aucun conseil si les données publiques, les probabilités modèle ou
              les cotes ANJ horodatées ne franchissent pas le seuil de preuve.
            </p>
          </div>

          {/* Card 3: Tracabilite totale */}
          <div className="bg-vb-bg-card-solid border border-vb-border rounded-[18px] p-6">
            <div
              className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[22px] mb-4"
              style={{
                background: "rgba(34,211,238,0.14)",
                border: "1px solid rgba(34,211,238,0.3)",
              }}
            >
              {"🔎"}
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">
              Traçabilité totale
            </h3>
            <p className="text-sm leading-[1.6] text-vb-text-secondary">
              Chaque cote est horodatée à la source, chaque
              conseil est publié avant le match et jamais
              modifié. La bankroll publique rend toute triche
              impossible.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
