import { useMemo, createContext, useState } from "react";
import type { CardData } from "@/types/CardData";

type CardContextType = {
    readonly cardData: CardData;
    readonly setCardData: React.Dispatch<React.SetStateAction<CardData>>;
};

export const CardContext = createContext<CardContextType>({
    cardData: {
        cardType: "",
        attribute: "",
        name: "",
    },
    setCardData: () => { },
});

export function CardProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [cardData, setCardData] = useState<CardData>({
        cardType: "",
        attribute: "",
        name: "",
    });

    const value = useMemo(() => ({ cardData, setCardData }), [cardData]);

    return (
        <CardContext.Provider value={value}>
            {children}
        </CardContext.Provider>
    );
}
