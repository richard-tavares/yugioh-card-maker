import { useLayoutEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { STRINGS } from "@/constants/strings";
import { useCardFontsLoaded } from "@/hooks/useCardFontsLoaded";
import { measureTextCapacity, type TextCapacity, type TextSlot } from "@/lib/canvas";
import { keepWholeWordsThatFit, splitAroundInsertion } from "@/utils/textInsertion";
import { Field, INPUT_CLASS, type FieldWidth } from "./Field";

const SAFETY_MAX_LENGTH = 2000;

type Props = Readonly<{
    id: string;
    label: string;
    width: FieldWidth;
    rows: number;
    value: string;
    onChange: (value: string) => void;
    slot: TextSlot;
    disabled?: boolean;
}>;

function capacityLabel({ overflows, condense, fontSize }: TextCapacity) {
    if (overflows) return STRINGS.capacity.overflow;
    if (condense < 1) return STRINGS.capacity.condensed(Math.round(condense * 100));
    return STRINGS.capacity.fontSize(fontSize);
}

function capacityBarClass({ overflows, usedPercent }: TextCapacity) {
    if (overflows) return "bg-red-500";
    if (usedPercent >= 90) return "bg-orange-400";
    if (usedPercent >= 60) return "bg-amber-300";
    return "bg-emerald-500";
}

export function CardTextField({ id, label, width, rows, value, onChange, slot, disabled }: Props) {
    const fontsLoaded = useCardFontsLoaded();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const caretToRestore = useRef<number | null>(null);
    const [notice, setNotice] = useState("");
    const [, forceRender] = useState(0);

    useLayoutEffect(() => {
        if (caretToRestore.current === null) return;
        textareaRef.current?.setSelectionRange(caretToRestore.current, caretToRestore.current);
        caretToRestore.current = null;
    });

    const fits = (text: string) => !measureTextCapacity(text, slot).overflows;

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const next = event.target.value;
        const isDeletion = next.length < value.length;

        if (isDeletion || fits(next)) {
            setNotice("");
            onChange(next);
            return;
        }

        const { before, inserted, after, replacedExistingText } = splitAroundInsertion(value, next);
        const isPaste = inserted.length > 1 && !replacedExistingText;
        const kept = isPaste ? keepWholeWordsThatFit(inserted, part => fits(before + part + after)) : "";

        caretToRestore.current = before.length + kept.length;
        setNotice(kept ? STRINGS.capacity.trimmed : STRINGS.capacity.full);
        forceRender(count => count + 1);
        if (kept) onChange(before + kept + after);
    };

    const capacity = fontsLoaded ? measureTextCapacity(value, slot) : null;
    const statusId = `${id}-capacity`;

    return (
        <Field id={id} label={label} width={width}>
            <textarea
                ref={textareaRef}
                id={id}
                rows={rows}
                value={value}
                maxLength={SAFETY_MAX_LENGTH}
                onChange={handleChange}
                onBlur={() => setNotice("")}
                disabled={disabled || !fontsLoaded}
                aria-describedby={statusId}
                aria-invalid={capacity?.overflows || undefined}
                className={`${INPUT_CLASS} ${capacity?.overflows ? "border-red-500" : ""}`}
            />
            <div id={statusId} className="mt-1 flex items-center gap-2 text-xs text-slate-400 min-h-4">
                {capacity && !disabled && (
                    <>
                        <div className="h-1 flex-1 rounded bg-slate-800 overflow-hidden" aria-hidden="true">
                            <div className={`h-full ${capacityBarClass(capacity)}`} style={{ width: `${capacity.usedPercent}%` }} />
                        </div>
                        <span role="status" className={capacity.overflows || notice ? "text-red-400" : ""}>
                            {capacity.overflows ? capacityLabel(capacity) : notice || capacityLabel(capacity)}
                        </span>
                    </>
                )}
            </div>
        </Field>
    );
}
