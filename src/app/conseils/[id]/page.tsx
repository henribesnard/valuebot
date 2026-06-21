import { notFound } from "next/navigation";
import Link from "next/link";
import { bets, tipDetails } from "@/lib/mock-data";
import { computePL } from "@/lib/utils";
import StatusBadge from "@/components/tips/StatusBadge";
import ConfidenceBar from "@/components/tips/ConfidenceBar";
import FormChips from "@/components/tips/FormChips";
import ValueBars from "@/components/tips/ValueBars";

export function generateStaticParams() {
  return bets.map((b) => ({ id: String(b.id) }));
}

export default async function DetailPariPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bet = bets.find((b) => b.id === Number(id));
  if (!bet) notFound();

  const detail = tipDetails[bet.id];
  const pl = computePL(bet);
  const coteN = bet.coteN;
  const impliedProb = Math.round(100 / coteN);
  const iaProb = detail?.iaProb ?? 50;
  const edge = iaProb - impliedProb;
  const edgeText = edge >= 0 ? `+${edge} pts` : `\u2212${Math.abs(edge)} pts`;
  const edgeColor = edge >= 0 ? "#16C784" : "#EA3943";

  return (
    <main className="max-w-content mx-auto px-5 py-13">
      {/* Back link */}
      <Link
        href="/conseils"
        className="text-[13.5px] text-vb-cyan cursor-pointer mb-5 inline-block"
      >
        ← Retour aux conseils
      </Link>

      {/* Match header */}
      <div className="flex items-center gap-[10px] flex-wrap mb-[10px]">
        <span className="text-[13px] font-semibold rounded-[8px] px-[10px] py-[5px] bg-white/[0.06] text-vb-text-tag">
          {bet.sportLabel}
        </span>
        <span className="text-[13px] text-vb-text-secondary">{bet.comp}</span>
        <StatusBadge status={bet.statut} />
      </div>

      <h1 className="font-heading font-bold text-[clamp(28px,3.8vw,42px)] text-vb-text mb-1">
        {bet.matchup}
      </h1>

      <p className="text-sm text-vb-text-secondary mb-[26px]">
        {"\uD83D\uDCC5"} {bet.when}
      </p>

      {/* Bet banner */}
      <div
        className="border border-[rgba(34,211,238,0.3)] rounded-[20px] p-[26px] mb-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(34,211,238,0.10), rgba(22,27,34,0.6))",
        }}
      >
        <div className="flex flex-wrap items-center gap-[22px]">
          {/* Left */}
          <div className="flex-1 min-w-[200px]">
            <p className="text-xs text-vb-cyan-light font-semibold tracking-wider mb-[6px]">
              PARI CONSEILLÉ PAR L'IA
            </p>
            <p className="font-heading font-bold text-[26px] text-vb-text mb-[10px]">
              {bet.pari}
            </p>
            <div className="flex items-center gap-[10px]">
              <span className="text-xs text-vb-text-secondary">
                Confiance {bet.conf}/5
              </span>
              <ConfidenceBar level={bet.conf} />
            </div>
          </div>

          {/* Right */}
          <div className="flex gap-[26px] flex-wrap">
            <div className="text-center">
              <p className="text-xs text-vb-text-secondary mb-1">Cote</p>
              <p className="font-heading font-bold text-[30px] text-vb-text">
                @{bet.cote}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-vb-text-secondary mb-1">Mise</p>
              <p className="font-heading font-bold text-[30px] text-vb-text">
                {bet.mise}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-vb-text-secondary mb-1">{pl.label}</p>
              <p
                className="font-heading font-bold text-[30px]"
                style={{ color: pl.color }}
              >
                {pl.text}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 mobile:grid-cols-[1.3fr_0.9fr] gap-5 items-start mb-5">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* AI Analysis card */}
          <div className="bg-vb-bg-card-subtle border border-vb-border rounded-[18px] p-6">
            <h3 className="font-heading font-semibold text-[17px] text-vb-text mb-[14px]">
              {"\uD83E\uDD16"} Analyse de l'IA
            </h3>
            <p className="text-[14.5px] leading-[1.7] text-vb-text-body mb-[18px]">
              {bet.analyse}
            </p>
            {detail && (
              <>
                <p className="text-xs text-vb-cyan-light font-semibold tracking-wider mb-[11px]">
                  FACTEURS DE VALEUR IDENTIFIÉS
                </p>
                <ul className="flex flex-col gap-[8px]">
                  {detail.factors.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-[8px] text-[13.5px] text-vb-text-body"
                    >
                      <span className="text-vb-green mt-[1px]">{"\u2713"}</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Context & form card */}
          {detail && (
            <div className="bg-vb-bg-card-subtle border border-vb-border rounded-[18px] p-6">
              <h3 className="font-heading font-semibold text-[17px] text-vb-text mb-[14px]">
                Contexte &amp; forme
              </h3>

              {/* Form rows */}
              <div className="flex flex-col gap-[14px] mb-[18px]">
                <div className="flex items-center justify-between gap-[10px]">
                  <span className="text-[13px] text-vb-text-secondary min-w-[80px]">
                    {detail.formALabel}
                  </span>
                  <FormChips form={detail.formA} />
                </div>
                <div className="flex items-center justify-between gap-[10px]">
                  <span className="text-[13px] text-vb-text-secondary min-w-[80px]">
                    {detail.formBLabel}
                  </span>
                  <FormChips form={detail.formB} />
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-vb-border-subtle mb-[14px]" />

              <p className="text-[13.5px] text-vb-text-body leading-[1.65] mb-[10px]">
                <span className="font-semibold text-vb-text">H2H :</span>{" "}
                {detail.h2h}
              </p>
              <p className="text-[13.5px] text-vb-text-body leading-[1.65]">
                <span className="font-semibold text-vb-text">Contexte :</span>{" "}
                {detail.context}
              </p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Value detection card */}
          {detail && (
            <div className="bg-vb-bg-card-subtle border border-vb-border rounded-[18px] p-6">
              <h3 className="font-heading font-semibold text-[17px] text-vb-text mb-[14px]">
                Détection de value
              </h3>

              <ValueBars iaProb={iaProb} impliedProb={impliedProb} />

              {/* Edge section */}
              <div className="border-t border-vb-border-subtle my-[18px]" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-vb-text-secondary">
                  Avantage (edge)
                </span>
                <span
                  className="font-heading font-bold text-[18px]"
                  style={{ color: edgeColor }}
                >
                  {edgeText}
                </span>
              </div>
            </div>
          )}

          {/* Traceability card */}
          <div className="bg-vb-bg-card-subtle border border-vb-border rounded-[18px] p-6">
            <h3 className="font-heading font-semibold text-[17px] text-vb-text mb-[14px]">
              Traçabilité
            </h3>
            <div className="flex flex-col gap-[12px] text-[13.5px] text-vb-text-body leading-[1.65]">
              <p>
                {"\uD83D\uDCCD"} {bet.releve}
              </p>
              <p>
                {"\uD83D\uDD12"} Conseil publié avant le coup d'envoi et
                jamais modifié depuis.
              </p>
              <p>
                {"\uD83C\uDFDB\uFE0F"} Cote relevée chez un opérateur
                agréé ANJ.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-vb-text-muted bg-white/[0.02] border border-vb-border-subtle rounded-[14px] px-[18px] py-4">
        {"\uD83E\uDD16"} Analyse générée par IA à but
        pédagogique. ValueBot ne garantit aucun résultat financier.
        Les paris sportifs comportent un risque de perte. Jouez de manière
        responsable.
      </div>
    </main>
  );
}
