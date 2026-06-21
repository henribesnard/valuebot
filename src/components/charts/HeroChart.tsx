import { computeChartPaths } from "@/lib/chart-utils";

interface HeroChartProps {
  values: number[];
  width?: number;
  height?: number;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  padX?: number;
  padT?: number;
  padB?: number;
}

export default function HeroChart({
  values,
  width,
  height = 200,
  viewBoxWidth = 560,
  viewBoxHeight = 200,
  padX = 6,
  padT = 14,
  padB = 14,
}: HeroChartProps) {
  if (values.length < 2) return null;

  const { line, area, lastX, lastY } = computeChartPaths(
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
        <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16C784" stopOpacity={0.28} />
          <stop offset="100%" stopColor="#16C784" stopOpacity={0} />
        </linearGradient>
      </defs>

      <path d={area} fill="url(#heroFill)" />

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
