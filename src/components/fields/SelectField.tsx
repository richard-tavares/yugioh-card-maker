import type { SelectOption } from "@/constants/selectOptions";
import { Field, INPUT_CLASS, type FieldWidth } from "./Field";

type Props<T extends string> = Readonly<{
    id: string;
    label: string;
    width: FieldWidth;
    value: T | "";
    onChange: (value: T | "") => void;
    options: readonly SelectOption<T>[];
    placeholder?: string;
    disabled?: boolean;
}>;

export function SelectField<T extends string>({ id, label, width, value, onChange, options, placeholder, disabled }: Props<T>) {
    return (
        <Field id={id} label={label} width={width}>
            <select
                id={id}
                value={value}
                onChange={event => onChange(event.target.value as T | "")}
                disabled={disabled}
                className={INPUT_CLASS}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </Field>
    );
}
