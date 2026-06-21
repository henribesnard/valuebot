import type { TipStatus, StatusMeta } from "@/types";

export function formatFR(n: number, decimals = 2): string {
  return n.toFixed(decimals).replace(".", ",");
}

export function formatUnits(n: number): string {
  const sign = n >= 0 ? "+" : "\u2212";
  return sign + formatFR(Math.abs(n)) + " u";
}

export function getStatusMeta(status: TipStatus): StatusMeta {
  switch (status) {
    case "avenir":
      return {
        label: "\u00C0 venir",
        color: "#22D3EE",
        bg: "rgba(34,211,238,0.12)",
      };
    case "gagne":
      return {
        label: "Gagn\u00e9 \u2705",
        color: "#16C784",
        bg: "rgba(22,199,132,0.12)",
      };
    case "perdu":
      return {
        label: "Perdu \u274C",
        color: "#EA3943",
        bg: "rgba(234,57,67,0.12)",
      };
    case "annule":
      return {
        label: "Annul\u00e9",
        color: "#8B98A5",
        bg: "rgba(255,255,255,0.06)",
      };
  }
}

export function computePL(tip: {
  statut: TipStatus;
  miseN: number;
  coteN: number;
  pl?: number;
}): { text: string; color: string; label: string } {
  if (tip.statut === "avenir") {
    const pot = tip.miseN * (tip.coteN - 1);
    return {
      text: "+" + formatFR(pot) + " u",
      color: "#8B98A5",
      label: "Gain potentiel",
    };
  }
  if (tip.statut === "annule") {
    return { text: "Rembours\u00e9", color: "#8B98A5", label: "R\u00e9sultat" };
  }
  const v = tip.pl ?? 0;
  return {
    text:
      (v >= 0 ? "+" : "\u2212") + formatFR(Math.abs(v)) + " u",
    color: v >= 0 ? "#16C784" : "#EA3943",
    label: "R\u00e9sultat",
  };
}
