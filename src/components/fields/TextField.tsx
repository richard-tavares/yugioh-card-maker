import { Field, INPUT_CLASS, type FieldWidth } from "./Field";

type Props = Readonly<{
    id: string;
    label: string;
    width: FieldWidth;
    value: string;
    onChange: (value: string) => void;
    maxLength: number;
    numericKeyboard?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
}>;

export function TextField({ id, label, width, value, onChange, maxLength, numericKeyboard, disabled, readOnly }: Props) {
    return (
        <Field id={id} label={label} width={width}>
            <input
                id={id}
                name={id}
                type="text"
                inputMode={numericKeyboard ? "numeric" : undefined}
                autoComplete="off"
                value={value}
                maxLength={maxLength}
                onChange={event => onChange(event.target.value)}
                disabled={disabled}
                readOnly={readOnly}
                className={INPUT_CLASS}
            />
        </Field>
    );
}
