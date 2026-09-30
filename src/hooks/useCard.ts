import { useContext } from "react";
import { CardContext, type CardContextValue } from "@/contexts/CardContext";

export function useCard(): CardContextValue {
    const context = useContext(CardContext);
    if (!context) throw new Error("useCard must be used inside a CardProvider");
    return context;
}
