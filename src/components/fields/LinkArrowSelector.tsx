import { STRINGS } from "@/constants/strings";
import type { LinkArrow } from "@/types/card";

type Props = Readonly<{
    labelledBy: string;
    value: readonly LinkArrow[];
    onChange: (value: LinkArrow[]) => void;
}>;

const ARROW_SYMBOLS: Record<LinkArrow, string> = {
    "top-left": "↖",
    "top": "↑",
    "top-right": "↗",
    "left": "←",
    "right": "→",
    "bottom-left": "↙",
    "bottom": "↓",
    "bottom-right": "↘",
};

const GRID: (LinkArrow | null)[] = ["top-left", "top", "top-right", "left", null, "right", "bottom-left", "bottom", "bottom-right"];

export function LinkArrowSelector({ labelledBy, value, onChange }: Props) {
    const toggle = (arrow: LinkArrow) => {
        onChange(value.includes(arrow) ? value.filter(selected => selected !== arrow) : [...value, arrow]);
    };

    return (
        <div role="group" aria-labelledby={labelledBy} className="grid grid-cols-3 gap-1 p-2 bg-slate-950 rounded shadow-inner w-max">
            {GRID.map(arrow => {
                if (!arrow) {
                    return <div key="center" className="w-8 h-8 rounded border border-white bg-slate-800" />;
                }

                const selected = value.includes(arrow);

                return (
                    <label
                        key={arrow}
                        className={`w-8 h-8 flex items-center justify-center rounded border cursor-pointer ${selected ? "bg-orange-500" : "bg-slate-800"} hover:border-white hover:bg-blue-800 has-focus-visible:outline-2 has-focus-visible:outline-white transition`}
                    >
                        <input
                            type="checkbox"
                            aria-label={STRINGS.linkArrows[arrow]}
                            checked={selected}
                            onChange={() => toggle(arrow)}
                            className="sr-only"
                        />
                        <span aria-hidden="true" className="no-emoji text-center text-white font-bold">{ARROW_SYMBOLS[arrow]}</span>
                    </label>
                );
            })}
        </div>
    );
}
