import { useEffect, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import { applyCardChange, createEmptyCard } from "@/utils/cardRules";
import { CardContext } from "./CardContext";

export function CardProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [card, updateCard] = useReducer(applyCardChange, undefined, createEmptyCard);
    const { artUrl } = card;

    useEffect(() => {
        if (!artUrl.startsWith("blob:")) return;
        return () => URL.revokeObjectURL(artUrl);
    }, [artUrl]);

    const value = useMemo(() => ({ card, updateCard }), [card]);

    return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
}
