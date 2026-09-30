import type { TextFitLimits } from "../textFit";

const FONTS = {
    name: "'YGO Matrix Small Caps'",
    label: "'YGO Stone Serif Small Caps'",
    text: "'YGO Matrix Book'",
    numbers: "'YGO Times New Roman', 'Times New Roman', Times, serif",
    linkRating: "'YGO Eurostile Candy'",
} as const;

export const TEXT_STYLES = {
    name: `50px ${FONTS.name}`,
    spellTrapLabel: `22px ${FONTS.label}`,
    typeLine: `14px ${FONTS.label}`,
    pendulumScale: `bold 16px ${FONTS.numbers}`,
    stats: `bold 16px ${FONTS.numbers}`,
    linkRating: `bold 16px ${FONTS.linkRating}`,
    setCode: `12px ${FONTS.numbers}`,
    imprint: `12px ${FONTS.numbers}`,
    text: (style: "normal" | "italic", size: number) => `${style} ${size}px ${FONTS.text}`,
} as const;

export const FONTS_TO_LOAD = [
    TEXT_STYLES.name,
    TEXT_STYLES.spellTrapLabel,
    TEXT_STYLES.linkRating,
    TEXT_STYLES.text("normal", 12),
    TEXT_STYLES.text("italic", 12),
    TEXT_STYLES.setCode,
    TEXT_STYLES.stats,
];

export const TEXT_FIT: TextFitLimits = { maxFontSize: 12, minFontSize: 9, minCondense: 0.75, maxLineSpacing: 1.2 };
