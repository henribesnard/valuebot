import type { ChartPaths } from "@/types";

export function computeChartPaths(
  vals: number[],
  W: number,
  H: number,
  padX: number,
  padT: number,
  padB: number
): ChartPaths {
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const r = max - min || 1;
  const n = vals.length;

  const X = (i: number) => padX + (n === 1 ? 0 : (i / (n - 1)) * (W - 2 * padX));
  const Y = (v: number) => H - padB - ((v - min) / r) * (H - padT - padB);

  let line = "";
  vals.forEach((v, i) => {
    line += (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1) + " ";
  });

  const area =
    line +
    "L" + X(n - 1).toFixed(1) + " " + (H - padB) +
    " L" + X(0).toFixed(1) + " " + (H - padB) +
    " Z";

  const baseV = Math.max(min, Math.min(max, 100));

  return {
    line: line.trim(),
    area: area.trim(),
    lastX: parseFloat(X(n - 1).toFixed(1)),
    lastY: parseFloat(Y(vals[vals.length - 1]).toFixed(1)),
    baseY: parseFloat(Y(baseV).toFixed(1)),
  };
}
