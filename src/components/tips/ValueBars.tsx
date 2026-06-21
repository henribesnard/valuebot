interface ValueBarsProps {
  iaProb: number;
  impliedProb: number;
}

export default function ValueBars({ iaProb, impliedProb }: ValueBarsProps) {
  const max = Math.max(iaProb, impliedProb, 100);

  return (
    <div className="flex flex-col gap-[14px]">
      {/* Bar 1: IA Probability */}
      <div>
        <div className="flex justify-between text-[13px] mb-[7px]">
          <span className="text-vb-cyan-light">
            {"🤖 Proba estim\u00e9e par l\u2019IA"}
          </span>
          <span className="font-heading font-bold text-[#22D3EE]">
            {iaProb}%
          </span>
        </div>
        <div className="h-[10px] rounded-[6px] bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-[6px]"
            style={{
              width: `${(iaProb / max) * 100}%`,
              background: "linear-gradient(90deg, #22D3EE, #7C5CFC)",
            }}
          />
        </div>
      </div>

      {/* Bar 2: Implied Probability */}
      <div>
        <div className="flex justify-between text-[13px] mb-[7px]">
          <span className="text-vb-text-secondary">
            {"🏦 Proba implicite de la cote"}
          </span>
          <span className="font-heading font-bold text-vb-text-body">
            {impliedProb}%
          </span>
        </div>
        <div className="h-[10px] rounded-[6px] bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-[6px] bg-white/[0.28]"
            style={{
              width: `${(impliedProb / max) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
