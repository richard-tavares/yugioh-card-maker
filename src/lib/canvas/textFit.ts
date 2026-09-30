export type Rect = Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
}>;

export type TextFitLimits = Readonly<{
    maxFontSize: number;
    minFontSize: number;
    minCondense: number;
    maxLineSpacing: number;
}>;

export type TextFitRules = TextFitLimits & Readonly<{
    font: (size: number) => string;
}>;

export type TextSlot = Readonly<{ box: Rect; rules: TextFitRules }>;

export type TextLine = {
    text: string;
    last: boolean;
};

export type FittedText = {
    lines: TextLine[];
    fontSize: number;
    condense: number;
    lineHeight: number;
    truncated: boolean;
};

const FONT_STEP = 0.25;
const CONDENSE_STEP = 0.025;
const ELLIPSIS = "…";
const MAX_JUSTIFY_GAP = 4;

function wrapParagraph(context: CanvasRenderingContext2D, text: string, maxWidth: number): TextLine[] {
    const words = text.split(" ");
    const lines: TextLine[] = [];
    let line = "";

    for (const word of words) {
        const testLine = line + word + " ";
        const testWidth = context.measureText(testLine).width;

        if (testWidth > maxWidth && line !== "") {
            lines.push({ text: line.trim(), last: false });
            line = word + " ";
        } else {
            line = testLine;
        }
    }

    if (line.trim() !== "") lines.push({ text: line.trim(), last: true });
    return lines;
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): TextLine[] {
    return text.trim().split("\n").flatMap(paragraph => wrapParagraph(context, paragraph, maxWidth));
}

function withLineHeight(fit: Omit<FittedText, "lineHeight">, box: Rect, rules: TextFitRules): FittedText {
    const shrunk = fit.fontSize < rules.maxFontSize || fit.condense < 1;
    const natural = fit.fontSize;
    const fill = fit.lines.length > 1 ? box.height / fit.lines.length : natural;
    const lineHeight = shrunk ? Math.min(Math.max(fill, natural), natural * rules.maxLineSpacing) : natural;
    return { ...fit, lineHeight };
}

export function measureTextFit(context: CanvasRenderingContext2D, text: string, { box, rules }: TextSlot): FittedText {
    const { font, maxFontSize, minFontSize, minCondense } = rules;
    const fits = (lines: TextLine[], size: number) => lines.length * size <= box.height;

    for (let size = maxFontSize; size >= minFontSize; size -= FONT_STEP) {
        context.font = font(size);
        const lines = wrapText(context, text, box.width);
        if (fits(lines, size)) return withLineHeight({ lines, fontSize: size, condense: 1, truncated: false }, box, rules);
    }

    context.font = font(minFontSize);
    for (let condense = 1 - CONDENSE_STEP; condense >= minCondense; condense -= CONDENSE_STEP) {
        const lines = wrapText(context, text, box.width / condense);
        if (fits(lines, minFontSize)) return withLineHeight({ lines, fontSize: minFontSize, condense, truncated: false }, box, rules);
    }

    const lines = wrapText(context, text, box.width / minCondense);
    const maxLines = Math.max(1, Math.floor(box.height / minFontSize));
    const visible = lines.slice(0, maxLines);
    const truncated = lines.length > maxLines;
    if (truncated) visible[maxLines - 1] = { text: visible[maxLines - 1].text + ELLIPSIS, last: true };
    return { lines: visible, fontSize: minFontSize, condense: minCondense, lineHeight: minFontSize, truncated };
}

function drawJustifiedLine(context: CanvasRenderingContext2D, line: string, width: number): boolean {
    const words = line.split(" ");
    if (words.length < 2) return false;

    const wordWidths = words.map(word => context.measureText(word).width);
    const gap = (width - wordWidths.reduce((sum, w) => sum + w, 0)) / (words.length - 1);
    if (gap > context.measureText(" ").width * MAX_JUSTIFY_GAP) return false;

    let x = 0;
    words.forEach((word, i) => {
        context.fillText(word, x, 0);
        x += wordWidths[i] + gap;
    });
    return true;
}

export function drawFittedText(context: CanvasRenderingContext2D, text: string, slot: TextSlot) {
    const { box, rules } = slot;
    const { lines, fontSize, condense, lineHeight } = measureTextFit(context, text, slot);
    const wrapWidth = box.width / condense;

    context.font = rules.font(fontSize);
    context.fillStyle = "#000";
    context.textAlign = "left";
    context.textBaseline = "top";

    lines.forEach((line, index) => {
        const measure = context.measureText(line.text);
        const overflows = measure.width > wrapWidth;
        const scale = overflows ? wrapWidth / measure.width : 1;

        context.save();
        context.translate(box.x, box.y + index * lineHeight);
        context.scale(scale * condense, 1);
        context.font = rules.font(fontSize);
        const justified = !line.last && !overflows && drawJustifiedLine(context, line.text, wrapWidth);
        if (!justified) context.fillText(line.text, 0, 0);
        context.restore();
    });
}
