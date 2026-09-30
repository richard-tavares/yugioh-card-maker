import { CARD_FRAMES, MONSTER_ATTRIBUTES } from "@/constants/card";
import { STRINGS } from "@/constants/strings";
import type { Attribute, CardFrame, SpellTrapType } from "@/types/card";

export type SelectOption<T extends string> = Readonly<{ value: T; label: string }>;

function toOptions<T extends string>(labels: Partial<Record<T, string>>, values: readonly T[]): SelectOption<T>[] {
    return values.map(value => ({ value, label: labels[value] ?? value }));
}

export const FRAME_OPTIONS = toOptions<CardFrame>(STRINGS.frames, CARD_FRAMES);

export const ATTRIBUTE_OPTIONS = toOptions<Attribute>(STRINGS.attributes, [...MONSTER_ATTRIBUTES, "spell", "trap"]);

export const SPELL_TYPE_OPTIONS = toOptions<SpellTrapType>(STRINGS.spellTypes, ["normal", "quick-play", "field", "equip", "continuous", "ritual"]);

export const TRAP_TYPE_OPTIONS = toOptions<SpellTrapType>(STRINGS.trapTypes, ["normal", "continuous", "counter"]);

export const YES_NO_OPTIONS: SelectOption<"yes" | "no">[] = [
    { value: "no", label: STRINGS.form.no },
    { value: "yes", label: STRINGS.form.yes },
];
