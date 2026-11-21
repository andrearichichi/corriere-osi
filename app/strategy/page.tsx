import type { Metadata } from "next";
import { Deck } from "@/components/deck/Deck";

export const metadata: Metadata = { title: "Presentazione · Il Filo" };

export default function StrategyPage() {
  return <Deck />;
}
