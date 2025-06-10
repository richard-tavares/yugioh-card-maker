import type { ChangeEvent, Dispatch, SetStateAction } from "react";

type NumericInputOptions = {
    min: number;
    max: number;
    nullable?: boolean;
};

export function useNumberInputValidator<T extends object>(
    field: keyof T,
    setData: Dispatch<SetStateAction<T>>,
    options: NumericInputOptions
) {
    const { min, max, nullable = true } = options;

    return (e: ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const numeric = raw.replace(/\D/g, "");

        if (nullable && raw === "") {
            setData(prev => ({ ...prev, [field]: null }));
            return;
        }

        const parsed = parseInt(numeric, 10);
        const value = isNaN(parsed) ? null : Math.min(Math.max(parsed, min), max);

        setData(prev => ({ ...prev, [field]: value }));
    };
}
