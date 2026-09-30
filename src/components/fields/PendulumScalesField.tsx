import { STRINGS } from "@/constants/strings";
import { sanitizeInteger } from "@/utils/inputSanitizers";
import { publicUrl } from "@/utils/publicUrl";
import { Field } from "./Field";

const MIN_SCALE = 1;
const MAX_SCALE = 12;
const INPUT_CLASS = "text-center w-full bg-slate-900 text-white border-none focus:ring-0 focus:outline-none";
const GEM_CLASS = "absolute top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none";

type Props = Readonly<{
    left: string;
    right: string;
    onLeftChange: (scale: string) => void;
    onRightChange: (scale: string) => void;
}>;

export function PendulumScalesField({ left, right, onLeftChange, onRightChange }: Props) {
    return (
        <Field id="pendulumScaleLeft" label={STRINGS.form.pendulumScales} width="full">
            <div className="flex w-full border rounded bg-slate-900 px-0 py-2 relative overflow-hidden">
                <div className="relative flex-1">
                    <img src={publicUrl("images/pendulum-scale-left.svg")} alt="" className={`${GEM_CLASS} left-2`} />
                    <input
                        id="pendulumScaleLeft"
                        aria-label={STRINGS.form.pendulumScaleLeft}
                        type="text"
                        inputMode="numeric"
                        value={left}
                        maxLength={2}
                        onChange={event => onLeftChange(sanitizeInteger(event.target.value, MIN_SCALE, MAX_SCALE))}
                        className={`${INPUT_CLASS} pl-8 pr-2`}
                    />
                </div>

                <div className="relative flex-1 border-l border-white">
                    <img src={publicUrl("images/pendulum-scale-right.svg")} alt="" className={`${GEM_CLASS} right-2`} />
                    <input
                        id="pendulumScaleRight"
                        aria-label={STRINGS.form.pendulumScaleRight}
                        type="text"
                        inputMode="numeric"
                        value={right}
                        maxLength={2}
                        onChange={event => onRightChange(sanitizeInteger(event.target.value, MIN_SCALE, MAX_SCALE))}
                        className={`${INPUT_CLASS} pr-8 pl-2`}
                    />
                </div>
            </div>
        </Field>
    );
}
