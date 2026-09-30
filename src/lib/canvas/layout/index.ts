import type { Card } from "@/types/card";
import type { TextSlot } from "../textFit";
import { getFrameLayout, type FrameLayout } from "./frames";
import { TEXT_FIT, TEXT_STYLES } from "./typography";

export { CARD_HEIGHT, CARD_WIDTH, type FrameLayout } from "./frames";
export { FONTS_TO_LOAD, TEXT_STYLES } from "./typography";

type FramedCard = Pick<Card, "frame" | "isPendulum">;

export function getCardLayout(card: FramedCard): FrameLayout {
    return getFrameLayout(card.frame, card.isPendulum);
}

export function getEffectSlot(card: FramedCard): TextSlot {
    const { effect, effectFontStyle } = getCardLayout(card);
    return { box: effect, rules: { ...TEXT_FIT, font: size => TEXT_STYLES.text(effectFontStyle, size) } };
}

export function getPendulumEffectSlot(card: FramedCard): TextSlot {
    const { pendulumEffect } = getCardLayout(card);
    return { box: pendulumEffect, rules: { ...TEXT_FIT, font: size => TEXT_STYLES.text("normal", size) } };
}
