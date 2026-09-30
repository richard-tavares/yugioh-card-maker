import { measureTextFit, type TextSlot } from "./textFit";

export type TextCapacity = {
    usedPercent: number;
    fontSize: number;
    condense: number;
    overflows: boolean;
};

const SHRINKING_STARTS_AT = 60;
const CONDENSING_STARTS_AT = 90;

let measuringContext: CanvasRenderingContext2D | null = null;

function getMeasuringContext() {
    if (!measuringContext) {
        measuringContext = document.createElement("canvas").getContext("2d");
        if (measuringContext) measuringContext.textRendering = "geometricPrecision";
    }
    return measuringContext;
}

export function measureTextCapacity(text: string, slot: TextSlot): TextCapacity {
    const { box, rules } = slot;
    const context = getMeasuringContext();
    if (!context || !text.trim()) return { usedPercent: 0, fontSize: rules.maxFontSize, condense: 1, overflows: false };

    const { lines, fontSize, condense, truncated } = measureTextFit(context, text, slot);

    let usedPercent: number;
    if (truncated) {
        usedPercent = 100;
    } else if (condense < 1) {
        const condensedShare = (1 - condense) / (1 - rules.minCondense);
        usedPercent = CONDENSING_STARTS_AT + condensedShare * (100 - CONDENSING_STARTS_AT);
    } else if (fontSize < rules.maxFontSize) {
        const shrunkShare = (rules.maxFontSize - fontSize) / (rules.maxFontSize - rules.minFontSize);
        usedPercent = SHRINKING_STARTS_AT + shrunkShare * (CONDENSING_STARTS_AT - SHRINKING_STARTS_AT);
    } else {
        usedPercent = ((lines.length * fontSize) / box.height) * SHRINKING_STARTS_AT;
    }

    return { usedPercent: Math.min(100, usedPercent), fontSize, condense, overflows: truncated };
}
