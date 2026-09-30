import type { ReactNode } from "react";

const WIDTH_CLASSES = {
    third: "w-full sm:w-full md:w-1/2 lg:w-1/3",
    half: "w-full md:w-full lg:w-1/2",
    twoThirds: "w-full md:w-full lg:w-2/3",
    full: "w-full",
} as const;

export type FieldWidth = keyof typeof WIDTH_CLASSES;

export const INPUT_CLASS = "p-2 border rounded bg-slate-900 text-white";

type Props = Readonly<{
    id: string;
    label: string;
    width: FieldWidth;
    children: ReactNode;
}>;

export function Field({ id, label, width, children }: Props) {
    return (
        <div className={`${WIDTH_CLASSES[width]} px-2 flex flex-col`}>
            <label htmlFor={id} className="mb-1 text-sm font-medium">{label}</label>
            {children}
        </div>
    );
}
