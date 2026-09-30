import type { Card, LinkArrow } from "@/types/card";
import { hasLevel, hasSpellTrapSymbol, isLink, usesRank } from "@/utils/cardRules";
import { publicUrl } from "@/utils/publicUrl";
import { FONTS_TO_LOAD } from "./layout";

export type CardAssets = {
    frame: HTMLImageElement | null;
    art: HTMLImageElement | null;
    attribute: HTMLImageElement | null;
    star: HTMLImageElement | null;
    spellTrapSymbol: HTMLImageElement | null;
    linkArrows: Partial<Record<LinkArrow, HTMLImageElement | null>>;
};

const cardImageUrl = (path: string) => publicUrl(`images/card/${path}.png`);

function loadImage(src: string, crossOrigin?: "anonymous"): Promise<HTMLImageElement | null> {
    return new Promise(resolve => {
        const image = new Image();
        if (crossOrigin) image.crossOrigin = crossOrigin;
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = src;
    });
}

const cardImages = new Map<string, Promise<HTMLImageElement | null>>();

function loadCardImage(path: string): Promise<HTMLImageElement | null> {
    let image = cardImages.get(path);
    if (!image) {
        image = loadImage(cardImageUrl(path));
        cardImages.set(path, image);
    }
    return image;
}

let latestArt: { url: string; image: Promise<HTMLImageElement | null> } | null = null;

async function loadExportableArt(url: string): Promise<HTMLImageElement | null> {
    return (await loadImage(url, "anonymous")) ?? loadImage(url);
}

function loadArt(url: string): Promise<HTMLImageElement | null> {
    if (latestArt?.url !== url) {
        const isFromAnotherSite = /^https?:\/\//i.test(url) && !url.startsWith(location.origin);
        latestArt = { url, image: isFromAnotherSite ? loadExportableArt(url) : loadImage(url) };
    }
    return latestArt.image;
}

let fonts: Promise<unknown> | null = null;

export function loadCardFonts(): Promise<unknown> {
    fonts ??= Promise.all(FONTS_TO_LOAD.map(font => document.fonts.load(font)));
    return fonts;
}

const noImage = Promise.resolve(null);

export async function loadCardAssets(card: Card): Promise<CardAssets> {
    const frame = card.isPendulum ? `${card.frame}-pendulum` : card.frame;
    const hasStars = hasLevel(card.frame) && !!card.level;
    const arrows = isLink(card.frame) ? card.linkArrows : [];

    const [, frameImage, art, attribute, star, spellTrapSymbol, ...arrowImages] = await Promise.all([
        loadCardFonts(),
        loadCardImage(`frames/${frame}`),
        card.artUrl ? loadArt(card.artUrl) : noImage,
        card.attribute ? loadCardImage(`attributes/${card.attribute}`) : noImage,
        hasStars ? loadCardImage(`stars/${usesRank(card.frame) ? "rank" : "level"}`) : noImage,
        hasSpellTrapSymbol(card) ? loadCardImage(`spell-trap-types/${card.spellTrapType}`) : noImage,
        ...arrows.map(arrow => loadCardImage(`link-arrows/${arrow}`)),
    ]);

    const linkArrows: CardAssets["linkArrows"] = {};
    arrows.forEach((arrow, index) => { linkArrows[arrow] = arrowImages[index]; });

    return { frame: frameImage, art, attribute, star, spellTrapSymbol, linkArrows };
}
