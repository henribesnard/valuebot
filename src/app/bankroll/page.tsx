import { unstable_noStore as noStore } from "next/cache";
import { getPublicValueBotData } from "@/lib/valuebot-data";
import BankrollClient from "./BankrollClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BankrollPage() {
  noStore();
  const { bankrollKpis, bankrollSummary, equity, historyRows } = await getPublicValueBotData();
  return <BankrollClient bankrollKpis={bankrollKpis} bankrollSummary={bankrollSummary} equity={equity} historyRows={historyRows} />;
}
