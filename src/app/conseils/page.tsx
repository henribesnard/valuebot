import { unstable_noStore as noStore } from "next/cache";
import { getPublicValueBotData } from "@/lib/valuebot-data";
import ConseilsClient from "./ConseilsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ConseilsPage() {
  noStore();
  const data = await getPublicValueBotData();
  return <ConseilsClient bets={data.bets} />;
}
