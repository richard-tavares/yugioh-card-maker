import { LINK_ARROWS } from "@/constants/card";
import type { Card, CardFrame } from "@/types/card";

type AnyFrame = CardFrame | "";

export const isSpellTrap = (value: string): value is "spell" | "trap" => value === "spell" || value === "trap";
export const isMonster = (frame: AnyFrame) => frame !== "" && !isSpellTrap(frame);
export const isLink = (frame: AnyFrame) => frame === "link";

export const hasLevel = (frame: AnyFrame) => isMonster(frame) && !isLink(frame);
export const usesRank = (frame: AnyFrame) => frame === "xyz";
export const hasDef = (frame: AnyFrame) => isMonster(frame) && !isLink(frame);
export const canBePendulum = (frame: AnyFrame) => isMonster(frame) && !isLink(frame) && frame !== "token";
export const hasDescription = (frame: AnyFrame) => frame === "normal";

export const hasSpellTrapSymbol = (card: Card) => isSpellTrap(card.frame) && card.spellTrapType !== "" && card.spellTrapType !== "normal";

function adjustToFrame(card: Card): Card {
    const { frame } = card;
    let next: Card = card;

    if (!isLink(frame)) next = { ...next, linkRating: "", linkArrows: [] };
    if (!canBePendulum(frame)) next = { ...next, isPendulum: false };
    if (!next.isPendulum) next = { ...next, pendulumEffect: "" };

    if (isSpellTrap(frame)) {
        return { ...next, attribute: frame, spellTrapType: "normal", level: null, typeLine: "", atk: "", def: "" };
    }

    const attribute = isSpellTrap(next.attribute) ? "" : next.attribute;
    next = { ...next, attribute, spellTrapType: "" };

    if (frame === "") return { ...next, attribute: "", level: null, typeLine: "" };
    if (!hasLevel(frame)) next = { ...next, level: null };
    if (!hasDef(frame)) next = { ...next, def: "" };
    return next;
}

function withLinkRating(card: Card): Card {
    if (!isLink(card.frame)) return card;
    const linkArrows = LINK_ARROWS.filter(arrow => card.linkArrows.includes(arrow));
    return { ...card, linkArrows, linkRating: linkArrows.length ? String(linkArrows.length) : "" };
}

export function applyCardChange(card: Card, change: Partial<Card>): Card {
    const next = { ...card, ...change };
    return withLinkRating(next.frame === card.frame ? next : adjustToFrame(next));
}

export function createEmptyCard(): Card {
    return {
        frame: "",
        name: "New Card",
        attribute: "",
        level: null,
        spellTrapType: "",
        artUrl: "",
        setCode: "TEST-PT000",
        typeLine: "",
        effect: "",
        atk: "",
        def: "",
        passcode: "12345678",
        copyright: "© 1996 KAZUKI TAKAHASHI",
        isPendulum: false,
        pendulumScaleLeft: "1",
        pendulumScaleRight: "12",
        pendulumEffect: "",
        linkArrows: [],
        linkRating: "",
    };
}
