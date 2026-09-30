import type { CardFrame, LinkArrow } from "@/types/card";
import type { Rect } from "../textFit";

export const CARD_WIDTH = 420;
export const CARD_HEIGHT = 610;

export type FrameLayout = Readonly<{
    colors: {
        name: string;
        details: string;
    };
    name: { x: number; y: number; maxWidth: number };
    attribute: { x: number; y: number; size: number };
    stars: { y: number; size: number; spacing: number; rankStartX: number; levelEndX: number };
    spellTrapLabel: { endX: number; y: number; padding: number; symbolSize: number; symbolOffsetY: number };
    art: Rect;
    linkArrows: Record<LinkArrow, Rect>;
    pendulumScale: { leftX: number; rightX: number; y: number };
    pendulumEffect: Rect;
    setCode: { x: number; y: number };
    typeLine: { x: number; y: number };
    effect: Rect;
    effectFontStyle: "normal" | "italic";
    stats: { atkX: number; defX: number; y: number };
    linkRating: { x: number; y: number };
    imprint: { passcodeX: number; copyrightX: number; y: number };
}>;

type LayoutOverride = { [K in keyof FrameLayout]?: FrameLayout[K] extends object ? Partial<FrameLayout[K]> : FrameLayout[K] };

const BASE: FrameLayout = {
    colors: { name: "#000", details: "#000" },
    name: { x: 30, y: 18, maxWidth: 327 },
    attribute: { x: 360, y: 29, size: 35 },
    stars: { y: 73, size: 25, spacing: 28, rankStartX: 43, levelEndX: 380 },
    spellTrapLabel: { endX: 380, y: 87, padding: 2, symbolSize: 25, symbolOffsetY: -12 },
    art: { x: 48, y: 110, width: 325, height: 325 },
    linkArrows: {
        "top-left": { x: 30, y: 93, width: 45, height: 45 },
        "top": { x: 165, y: 84, width: 90, height: 27 },
        "top-right": { x: 345, y: 93, width: 45, height: 45 },
        "left": { x: 20, y: 225, width: 27, height: 90 },
        "right": { x: 372, y: 225, width: 27, height: 90 },
        "bottom-left": { x: 30, y: 402, width: 45, height: 45 },
        "bottom": { x: 165, y: 432, width: 90, height: 27 },
        "bottom-right": { x: 345, y: 402, width: 45, height: 45 },
    },
    pendulumScale: { leftX: 44, rightX: 377, y: 440 },
    pendulumEffect: { x: 67, y: 386, width: 285, height: 66 },
    setCode: { x: 378, y: 453 },
    typeLine: { x: 30, y: 473 },
    effect: { x: 28, y: 475, width: 363, height: 80 },
    effectFontStyle: "normal",
    stats: { atkX: 300, defX: 385, y: 576 },
    linkRating: { x: 385, y: 576 },
    imprint: { passcodeX: 20, copyrightX: 380, y: 598 },
};

const SPELL_TRAP: LayoutOverride = {
    colors: { name: "#FFF" },
    effect: { y: 461, height: 116 },
};

const FRAME_OVERRIDES: Partial<Record<CardFrame, LayoutOverride>> = {
    normal: { effectFontStyle: "italic" },
    xyz: { colors: { name: "#FFF", details: "#FFF" } },
    link: { setCode: { x: 345 } },
    spell: SPELL_TRAP,
    trap: SPELL_TRAP,
};

const PENDULUM: LayoutOverride = {
    colors: { details: "#000" },
    art: { x: 30, width: 360, height: 270 },
    stars: { y: 75 },
    setCode: { x: 100, y: 570 },
    typeLine: { x: 33 },
    effect: { x: 33, width: 354, height: 76 },
    stats: { y: 572 },
    imprint: { y: 595 },
};

function applyOverride(layout: FrameLayout, override: LayoutOverride | undefined): FrameLayout {
    if (!override) return layout;
    const merged: Record<string, unknown> = { ...layout };

    for (const [key, value] of Object.entries(override)) {
        const current = merged[key];
        merged[key] = typeof value === "object" && typeof current === "object" ? { ...current, ...value } : value;
    }

    return merged as FrameLayout;
}

const cache = new Map<string, FrameLayout>();

export function getFrameLayout(frame: CardFrame | "", isPendulum: boolean): FrameLayout {
    const key = `${frame}|${isPendulum}`;
    let layout = cache.get(key);

    if (!layout) {
        layout = applyOverride(BASE, frame === "" ? undefined : FRAME_OVERRIDES[frame]);
        if (isPendulum) layout = applyOverride(layout, PENDULUM);
        cache.set(key, layout);
    }

    return layout;
}
