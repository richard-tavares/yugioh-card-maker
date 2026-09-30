import { createContext } from "react";
import type { Card } from "@/types/card";

export type CardContextValue = {
    readonly card: Card;
    readonly updateCard: (change: Partial<Card>) => void;
};

export const CardContext = createContext<CardContextValue | null>(null);
