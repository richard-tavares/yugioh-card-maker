import type { Card } from "@/types/card";
import { loadCardAssets } from "./assets";
import { drawCardLayers } from "./drawCardLayers";

export const CARD_SCALE = 3;

type DrawOptions = {
    scale?: number;
    isStale?: () => boolean;
};

export async function drawCard(canvas: HTMLCanvasElement, card: Card, options: DrawOptions = {}) {
    const assets = await loadCardAssets(card);
    if (options.isStale?.()) return;
    drawCardLayers(canvas, card, assets, options.scale ?? CARD_SCALE);
}
