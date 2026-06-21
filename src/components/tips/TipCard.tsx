import Link from "next/link";
import type { Tip } from "@/types";
import { computePL } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import ConfidenceBar from "./ConfidenceBar";

interface TipCardProps {
  tip: Tip;
  showAnalysis?: boolean;
}

export default function TipCard({ tip, showAnalysis = true }: TipCardProps) {
  const pl = computePL(tip);

  return (
    <Link href={`/conseils/${tip.id}`} className="block">
      <div className="bg-vb-bg-card border border-vb-border rounded-[18px] p-5 flex flex-col gap-[14px] cursor-pointer hover:border-vb-border-hover hover:-translate-y-0.5 transition-all">
        {/* Row 1: Sport + Competition + Status */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold px-[9px] py-1 rounded-[7px] bg-white/[0.06] text-vb-text-tag">
            {tip.sportLabel}
          </span>
          <span className="text-[11.5px] text-vb-text-muted">{tip.comp}</span>
          <span className="ml-auto">
            <StatusBadge status={tip.statut} />
          </span>
        </div>

        {/* Row 2: Matchup + Date */}
        <div>
          <h3 className="font-heading font-semibold text-[16.5px] text-vb-text">
            {tip.matchup}
          </h3>
          <p className="text-xs text-vb-text-muted mt-0.5">{tip.when}</p>
        </div>

        {/* Row 3: Pari Conseille box */}
        <div className="bg-[rgba(34,211,238,0.06)] border border-[rgba(34,211,238,0.18)] rounded-xl p-[13px_15px] flex items-center justify-between">
          <div>
            <p className="text-[11px] text-vb-cyan-light font-semibold uppercase tracking-wide">
              Pari conseillé
            </p>
            <p className="font-heading font-semibold text-[17px] text-vb-text mt-0.5">
              {tip.pari}
            </p>
          </div>
          <div className="text-right">
            <p className="font-heading font-bold text-xl text-vb-text">
              @{tip.cote}
            </p>
            <p className="text-[11px] text-vb-text-secondary">
              Mise : {tip.mise}
            </p>
          </div>
        </div>

        {/* Row 4: AI Analysis (optional) */}
        {showAnalysis && (
          <div className="bg-white/[0.025] border-l-2 border-l-[rgba(34,211,238,0.4)] px-[14px] py-[11px] rounded-r-[10px]">
            <p className="text-[13px] leading-[1.55] text-vb-text-tag">
              <span className="text-[11px] text-vb-cyan-light font-semibold">
                {"🤖 ANALYSE IA — "}
              </span>
              {tip.analyse}
            </p>
          </div>
        )}

        {/* Row 5: Confidence + P/L */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-vb-text-secondary">
              Confiance
            </span>
            <ConfidenceBar level={tip.conf} />
          </div>
          <div className="text-right">
            <span className="text-[11px] text-vb-text-secondary">
              {pl.label}{" "}
            </span>
            <span
              className="font-heading font-bold text-[13px]"
              style={{ color: pl.color }}
            >
              {pl.text}
            </span>
          </div>
        </div>

        {/* Row 6: Footer */}
        <div className="border-t border-vb-border-subtle pt-[11px] flex items-center justify-between">
          <span className="text-[11px] text-vb-text-muted leading-snug">
            {"📍 "}{tip.releve}
          </span>
          <span className="text-[12px] text-vb-cyan font-semibold whitespace-nowrap ml-3 shrink-0">
            Détail →
          </span>
        </div>
      </div>
    </Link>
  );
}
