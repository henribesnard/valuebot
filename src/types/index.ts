export type Sport = "football" | "tennis";
export type TipStatus = "avenir" | "gagne" | "perdu" | "annule";

export interface Tip {
  id: number;
  sport: Sport;
  sportLabel: string;
  comp: string;
  matchup: string;
  when: string;
  pari: string;
  conf: number;
  mise: string;
  miseN: number;
  cote: string;
  coteN: number;
  book: string;
  releve: string;
  statut: TipStatus;
  analyse: string;
  pl?: number;
  tier?: "official" | "prudent_signal";
}

export interface TipDetail {
  iaProb: number;
  factors: string[];
  formA: string[];
  formB: string[];
  formALabel: string;
  formBLabel: string;
  h2h: string;
  context: string;
}

export interface HistoryRow {
  date: string;
  match: string;
  pari: string;
  cote: string;
  mise: string;
  pl: string;
  win: boolean | null;
}

export interface PipelineStep {
  n: number;
  title: string;
  desc: string;
}

export interface PricingPlan {
  key: string;
  name: string;
  tagline: string;
  priceM: number;
  priceA: number;
  cta: string;
  popular?: boolean;
  accent: string;
  features: string[];
}

export interface Invoice {
  date: string;
  amount: string;
  label: string;
  status: string;
}

export interface StatusMeta {
  label: string;
  color: string;
  bg: string;
}

export interface ChartPaths {
  line: string;
  area: string;
  lastX: number;
  lastY: number;
  baseY: number;
}

export interface NavItem {
  key: string;
  label: string;
  icon: string;
  href: string;
}
