import { useState } from "react";
import type { ChangeEvent } from "react";
import { STRINGS } from "@/constants/strings";
import { Field } from "./Field";

type ArtSource = "file" | "link";

type Props = Readonly<{
    artUrl: string;
    onChange: (artUrl: string) => void;
    disabled?: boolean;
}>;

export function ArtField({ artUrl, onChange, disabled }: Props) {
    const [source, setSource] = useState<ArtSource>("file");

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        onChange(file ? URL.createObjectURL(file) : "");
    };

    return (
        <Field id="art" label={STRINGS.form.art} width="full">
            <div className="flex overflow-hidden rounded border border-white bg-slate-900">
                <select
                    id="artSource"
                    aria-label={STRINGS.form.artSource}
                    value={source}
                    onChange={event => setSource(event.target.value as ArtSource)}
                    disabled={disabled}
                    className="bg-slate-800 text-white px-3 py-2 border border-white"
                >
                    <option value="file">{STRINGS.form.artFromFile}</option>
                    <option value="link">{STRINGS.form.artFromLink}</option>
                </select>

                {source === "link" ? (
                    <input
                        key="link"
                        id="art"
                        type="text"
                        inputMode="url"
                        value={artUrl.startsWith("blob:") ? "" : artUrl}
                        onChange={event => onChange(event.target.value)}
                        disabled={disabled}
                        placeholder={STRINGS.form.artUrlPlaceholder}
                        className="flex-1 px-3 py-2 bg-slate-900 text-white"
                    />
                ) : (
                    <input
                        key="file"
                        id="art"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={disabled}
                        className="flex-1 file:px-3 file:py-2 file:bg-slate-800 file:text-white file:border-0 text-white bg-slate-900"
                    />
                )}
            </div>
        </Field>
    );
}
