import type { CARD_FRAMES, LINK_ARROWS, MONSTER_ATTRIBUTES } from "@/constants/card";

export type CardFrame = (typeof CARD_FRAMES)[number];

export type MonsterAttribute = (typeof MONSTER_ATTRIBUTES)[number];
export type Attribute = MonsterAttribute | "spell" | "trap";

export type SpellTrapType = "normal" | "quick-play" | "field" | "equip" | "continuous" | "ritual" | "counter";

export type LinkArrow = (typeof LINK_ARROWS)[number];

export type Card = Readonly<{
    frame: CardFrame | "";
    name: string;
    attribute: Attribute | "";
    level: number | null;
    spellTrapType: SpellTrapType | "";
    artUrl: string;
    setCode: string;
    typeLine: string;
    effect: string;
    atk: string;
    def: string;
    passcode: string;
    copyright: string;
    isPendulum: boolean;
    pendulumScaleLeft: string;
    pendulumScaleRight: string;
    pendulumEffect: string;
    linkArrows: readonly LinkArrow[];
    linkRating: string;
}>;
