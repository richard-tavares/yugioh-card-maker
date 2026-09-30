import { LINK_ARROWS } from "@/constants/card";
import { STRINGS } from "@/constants/strings";
import type { Card } from "@/types/card";
import { hasSpellTrapSymbol, isLink, isSpellTrap, usesRank } from "@/utils/cardRules";
import type { CardAssets } from "./assets";
import { CARD_HEIGHT, CARD_WIDTH, TEXT_STYLES, getCardLayout, getEffectSlot, getPendulumEffectSlot, type FrameLayout } from "./layout";
import { drawFittedText } from "./textFit";

type Context = CanvasRenderingContext2D;

type TextStyle = {
    x: number;
    y: number;
    font: string;
    color: string;
    align: CanvasTextAlign;
    baseline: CanvasTextBaseline;
};

function drawText(context: Context, text: string, { x, y, font, color, align, baseline }: TextStyle) {
    context.font = font;
    context.fillStyle = color;
    context.textAlign = align;
    context.textBaseline = baseline;
    context.fillText(text, x, y);
}

function drawArt(context: Context, layout: FrameLayout, assets: CardAssets) {
    if (!assets.art) return;
    const { x, y, width, height } = layout.art;
    context.drawImage(assets.art, x, y, width, height);
}

function drawName(context: Context, card: Card, layout: FrameLayout) {
    const { x, y, maxWidth } = layout.name;
    context.font = TEXT_STYLES.name;
    context.fillStyle = layout.colors.name;
    context.textBaseline = "top";

    const width = context.measureText(card.name).width;
    const condense = width > maxWidth ? maxWidth / width : 1;

    context.save();
    context.translate(x, y);
    context.scale(condense, 1);
    context.fillText(card.name, 0, 0);
    context.restore();
}

function applySpellTrapLabelStyle(context: Context) {
    context.font = TEXT_STYLES.spellTrapLabel;
    context.fillStyle = "#000";
    context.textBaseline = "middle";
    context.textAlign = "left";
}

function drawSpellTrapLabel(context: Context, card: Card, layout: FrameLayout): { symbolX: number } | null {
    if (!isSpellTrap(card.frame)) return null;
    const { endX, y, padding, symbolSize } = layout.spellTrapLabel;
    const label = card.frame === "spell" ? STRINGS.card.spellLabel : STRINGS.card.trapLabel;
    const hasSymbol = hasSpellTrapSymbol(card);

    applySpellTrapLabelStyle(context);
    const openBracketWidth = context.measureText("[").width;
    const labelWidth = context.measureText(label).width;
    const closeBracketWidth = context.measureText("]").width;
    const totalWidth = openBracketWidth + labelWidth + (hasSymbol ? symbolSize : 0) + closeBracketWidth + padding * (hasSymbol ? 3 : 2);

    let x = endX - totalWidth;
    context.fillText("[", x, y);
    x += openBracketWidth + padding;

    context.fillText(label, x, y);
    x += labelWidth + padding;

    if (hasSymbol) return { symbolX: x };

    context.fillText("]", x, y);
    return null;
}

function drawSpellTrapSymbol(context: Context, layout: FrameLayout, assets: CardAssets, symbolX: number) {
    if (!assets.spellTrapSymbol) return;
    const { y, padding, symbolSize, symbolOffsetY } = layout.spellTrapLabel;

    context.drawImage(assets.spellTrapSymbol, symbolX, y + symbolOffsetY, symbolSize, symbolSize);
    applySpellTrapLabelStyle(context);
    context.fillText("]", symbolX + symbolSize + padding, y);
}

function drawPendulumScales(context: Context, card: Card, layout: FrameLayout) {
    if (!card.isPendulum) return;
    const { leftX, rightX, y } = layout.pendulumScale;
    const style = { y, font: TEXT_STYLES.pendulumScale, color: "#000", align: "center", baseline: "bottom" } as const;
    drawText(context, card.pendulumScaleLeft, { ...style, x: leftX });
    drawText(context, card.pendulumScaleRight, { ...style, x: rightX });
}

function drawPendulumEffect(context: Context, card: Card) {
    if (!card.isPendulum || !card.pendulumEffect) return;
    drawFittedText(context, card.pendulumEffect, getPendulumEffectSlot(card));
}

function drawSetCode(context: Context, card: Card, layout: FrameLayout) {
    if (!card.setCode) return;
    const { x, y } = layout.setCode;
    drawText(context, card.setCode, { x, y, font: TEXT_STYLES.setCode, color: layout.colors.details, align: "right", baseline: "bottom" });
}

function drawTypeLine(context: Context, card: Card, layout: FrameLayout) {
    if (isSpellTrap(card.frame) || !card.typeLine) return;
    const { x, y } = layout.typeLine;
    drawText(context, `[${card.typeLine}]`, { x, y, font: TEXT_STYLES.typeLine, color: "#000", align: "left", baseline: "bottom" });
}

function drawEffect(context: Context, card: Card) {
    if (!card.effect) return;
    drawFittedText(context, card.effect, getEffectSlot(card));
}

function drawStats(context: Context, card: Card, layout: FrameLayout) {
    if (isSpellTrap(card.frame)) return;
    const { atkX, defX, y } = layout.stats;
    const style = { y, font: TEXT_STYLES.stats, color: "#000", align: "right", baseline: "bottom" } as const;

    if (card.atk) drawText(context, card.atk, { ...style, x: atkX });
    if (card.def && !isLink(card.frame)) drawText(context, card.def, { ...style, x: defX });
}

function drawLinkRating(context: Context, card: Card, layout: FrameLayout) {
    if (!isLink(card.frame) || !card.linkRating) return;
    const { x, y } = layout.linkRating;
    drawText(context, card.linkRating, { x, y, font: TEXT_STYLES.linkRating, color: "#000", align: "right", baseline: "bottom" });
}

function drawImprint(context: Context, card: Card, layout: FrameLayout) {
    const { passcodeX, copyrightX, y } = layout.imprint;
    const style = { y, font: TEXT_STYLES.imprint, color: layout.colors.details, baseline: "bottom" } as const;

    if (card.passcode) drawText(context, card.passcode, { ...style, x: passcodeX, align: "left" });
    if (card.copyright) drawText(context, card.copyright, { ...style, x: copyrightX, align: "right" });
}

function drawAttribute(context: Context, layout: FrameLayout, assets: CardAssets) {
    if (!assets.attribute) return;
    const { x, y, size } = layout.attribute;
    context.drawImage(assets.attribute, x, y, size, size);
}

function drawStars(context: Context, card: Card, layout: FrameLayout, assets: CardAssets) {
    if (!assets.star || !card.level) return;
    const { y, size, spacing, rankStartX, levelEndX } = layout.stars;

    for (let index = 0; index < card.level; index++) {
        const x = usesRank(card.frame) ? rankStartX + index * spacing : levelEndX - (index + 1) * spacing;
        context.drawImage(assets.star, x, y, size, size);
    }
}

function drawLinkArrows(context: Context, layout: FrameLayout, assets: CardAssets) {
    for (const arrow of LINK_ARROWS) {
        const image = assets.linkArrows[arrow];
        if (!image) continue;
        const { x, y, width, height } = layout.linkArrows[arrow];
        context.drawImage(image, x, y, width, height);
    }
}

export function drawCardLayers(canvas: HTMLCanvasElement, card: Card, assets: CardAssets, scale: number) {
    const context = canvas.getContext("2d");
    if (!context) return;
    const layout = getCardLayout(card);

    canvas.width = CARD_WIDTH * scale;
    canvas.height = CARD_HEIGHT * scale;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.textRendering = "geometricPrecision";

    drawArt(context, layout, assets);
    if (!assets.frame) return;
    context.drawImage(assets.frame, 0, 0, CARD_WIDTH, CARD_HEIGHT);

    drawName(context, card, layout);
    const pendingSymbol = drawSpellTrapLabel(context, card, layout);
    drawPendulumScales(context, card, layout);
    drawPendulumEffect(context, card);
    drawSetCode(context, card, layout);
    drawTypeLine(context, card, layout);
    drawEffect(context, card);
    drawStats(context, card, layout);
    drawLinkRating(context, card, layout);
    drawImprint(context, card, layout);

    drawAttribute(context, layout, assets);
    drawStars(context, card, layout, assets);
    if (pendingSymbol) drawSpellTrapSymbol(context, layout, assets, pendingSymbol.symbolX);
    drawLinkArrows(context, layout, assets);
}
