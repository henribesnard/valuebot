import { computeChartPaths } from "@/lib/chart-utils";

interface BankrollChartProps {
  values: number[];
  width?: number;
  height?: number;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  padX?: number;
  padT?: number;
  padB?: number;
  showBaseline?: boolean;
}

export default function BankrollChart({
  values,
  width,
  height = 300,
  viewBoxWidth = 820,
  viewBoxHeight = 300,
  padX = 8,
  padT = 18,
  padB = 18,
  showBaseline = true,
}: BankrollChartProps) {
  if (values.length < 2) return null;

  const { line, area, lastX, lastY, baseY } = computeChartPaths(
    values,
    viewBoxWidth,
    viewBoxHeight,
    padX,
    padT,
    padB,
  );

  return (
    <svg
      width={width ?? "100%"}
      height={height}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="none"
      className="block"
    >
      <defs>
        <linearGradient id="bankrollFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16C784" stopOpacity={0.28} />
          <stop offset="100%" stopColor="#16C784" stopOpacity={0} />
        </linearGradient>
      </defs>

      {showBaseline && (
        <line
          x1={padX}
          y1={baseY}
          x2={viewBoxWidth - padX}
          y2={baseY}
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={1}
          strokeDasharray="6 4"
        />
      )}

      <path d={area} fill="url(#bankrollFill)" />

      <path
        d={line}
        fill="none"
        stroke="#16C784"
        strokeWidth={2.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      <circle
        cx={lastX}
        cy={lastY}
        r={5}
        fill="#16C784"
        stroke="#0E1116"
        strokeWidth={2.5}
      />
    </svg>
  );
}
