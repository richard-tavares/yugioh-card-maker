import { useMemo, createContext, useState } from "react";
import type { CardData } from "@/types/CardData";

type CardContextType = {
    readonly cardData: CardData;
    readonly setCardData: React.Dispatch<React.SetStateAction<CardData>>;
};

export const CardContext = createContext<CardContextType>({
    cardData: {
        cardType: "",
        name: "",
        attribute: "",
        stars: null,
        symbol: "",
    },
    setCardData: () => { },
});

export function CardProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [cardData, setCardData] = useState<CardData>({
        cardType: "",
        name: "",
        attribute: "",
        stars: null,
        symbol: "",
    });

    const value = useMemo(() => ({ cardData, setCardData }), [cardData]);

    return (
        <CardContext.Provider value={value}>
            {children}
        </CardContext.Provider>
    );
}
