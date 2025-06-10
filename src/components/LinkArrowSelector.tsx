import type { LinkArrowKey } from "@/types/CardData";

type Props = {
    id?: string;
    value: Record<LinkArrowKey, boolean>;
    onChange: (key: LinkArrowKey, value: boolean) => void;
};

const positions: {
    key: LinkArrowKey | "center";
    label?: string;
}[] = [
        { key: "linkArrowTopLeft", label: "↖" },
        { key: "linkArrowTopCenter", label: "↑" },
        { key: "linkArrowTopRight", label: "↗" },
        { key: "linkArrowMiddleLeft", label: "←" },
        { key: "center" },
        { key: "linkArrowMiddleRight", label: "→" },
        { key: "linkArrowBottomLeft", label: "↙" },
        { key: "linkArrowBottomCenter", label: "↓" },
        { key: "linkArrowBottomRight", label: "↘" }
    ];

export default function LinkArrowSelector({ id, value, onChange }: Readonly<Props>) {
    return (
        <div id={id} className="grid grid-cols-3 gap-1 p-2 bg-slate-950 rounded shadow-inner w-max">
            {positions.map((pos) => {
                if (pos.key === "center") {
                    return (
                        <div key="center" className="w-8 h-8 rounded border border-white bg-slate-800" />
                    );
                }

                const key = pos.key;

                return (
                    <label
                        key={key}
                        className={`w-8 h-8 flex items-center justify-center rounded border cursor-pointer ${value[key] ? "bg-orange-500" : "bg-slate-800"} hover:border-white hover:bg-blue-800 transition`}
                    >
                        <input
                            type="checkbox"
                            checked={value[key]}
                            onChange={() => onChange(key, !value[key])}
                            className="sr-only"
                        />
                        <span className="no-emoji text-center text-white font-bold">{pos.label}</span>
                    </label>
                );
            })}
        </div>
    );
}
