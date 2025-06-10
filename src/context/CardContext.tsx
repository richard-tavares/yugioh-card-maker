import { createContext, useState, useMemo } from "react";
import type { Dispatch, SetStateAction, ReactNode } from "react";
import type { CardData } from "@/types/CardData";

type CardContextType = {
    readonly cardData: CardData;
    readonly setCardData: Dispatch<SetStateAction<CardData>>;
};

export const CardContext = createContext<CardContextType>({} as CardContextType);

export function CardProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [cardData, setCardData] = useState<CardData>({
        template: "",
        name: "New Card",
        attribute: "",
        stars: null,
        symbol: "",
        art: "",
        edition: "TEST-PT000",
        type: "",
        effect: "",
        atk: "",
        def: "",
        serial: "12345678",
        copyright: "© 1996 KAZUKI TAKAHASHI",
        pendulum: false,
        pendulumBlueScale: "1",
        pendulumRedScale: "12",
        pendulumEffect: "",
        linkRating: "",
        linkArrowTopLeft: false,
        linkArrowTopCenter: false,
        linkArrowTopRight: false,
        linkArrowMiddleLeft: false,
        linkArrowMiddleRight: false,
        linkArrowBottomLeft: false,
        linkArrowBottomCenter: false,
        linkArrowBottomRight: false,
    });

    const value = useMemo(() => ({ cardData, setCardData }), [cardData]);

    return (
        <CardContext.Provider value={value}>
            {children}
        </CardContext.Provider>
    );
}
