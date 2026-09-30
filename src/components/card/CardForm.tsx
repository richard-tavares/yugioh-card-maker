import { ArtField } from "@/components/fields/ArtField";
import { CardTextField } from "@/components/fields/CardTextField";
import { LinkArrowSelector } from "@/components/fields/LinkArrowSelector";
import { PendulumScalesField } from "@/components/fields/PendulumScalesField";
import { SelectField } from "@/components/fields/SelectField";
import { TextField } from "@/components/fields/TextField";
import { ATTRIBUTE_OPTIONS, FRAME_OPTIONS, SPELL_TYPE_OPTIONS, TRAP_TYPE_OPTIONS, YES_NO_OPTIONS } from "@/constants/selectOptions";
import { STRINGS } from "@/constants/strings";
import { useCard } from "@/hooks/useCard";
import { getEffectSlot, getPendulumEffectSlot } from "@/lib/canvas";
import { canBePendulum, hasDef, hasDescription, hasLevel, isLink, isSpellTrap, usesRank } from "@/utils/cardRules";
import { sanitizeDigits, sanitizeInteger, sanitizeStat } from "@/utils/inputSanitizers";

const MAX_LEVEL = 12;
const MAX_STAT = 9999;
const PASSCODE_LENGTH = 8;

export function CardForm() {
    const { card, updateCard } = useCard();
    const { frame } = card;
    const labels = STRINGS.form;
    const hasNoFrame = frame === "";
    const isSpellOrTrap = isSpellTrap(frame);
    const attributeOptions = ATTRIBUTE_OPTIONS.filter(option => !isSpellTrap(option.value) || option.value === frame);

    return (
        <div className="w-full md:w-full lg:w-2/3">
            <div className="h-full lg:max-h-[85vh] overflow-y-auto overflow-x-hidden px-3">
                <form className="flex flex-wrap gap-y-2 -mx-2" autoComplete="off" onSubmit={event => event.preventDefault()}>
                    <SelectField
                        id="frame"
                        label={labels.frame}
                        width="third"
                        value={frame}
                        onChange={value => updateCard({ frame: value })}
                        options={FRAME_OPTIONS}
                        placeholder={labels.selectPlaceholder}
                    />

                    <SelectField
                        id="attribute"
                        label={labels.attribute}
                        width="third"
                        value={card.attribute}
                        onChange={value => updateCard({ attribute: value })}
                        options={attributeOptions}
                        placeholder={labels.selectPlaceholder}
                        disabled={hasNoFrame || isSpellOrTrap}
                    />

                    {!isSpellOrTrap && (
                        <TextField
                            id="level"
                            label={usesRank(frame) ? labels.rank : labels.level}
                            width="third"
                            numericKeyboard
                            value={card.level?.toString() ?? ""}
                            maxLength={2}
                            onChange={value => updateCard({ level: Number(sanitizeInteger(value, 1, MAX_LEVEL)) || null })}
                            disabled={!hasLevel(frame)}
                        />
                    )}

                    {isSpellOrTrap && (
                        <SelectField
                            id="spellTrapType"
                            label={frame === "spell" ? labels.spellType : labels.trapType}
                            width="third"
                            value={card.spellTrapType}
                            onChange={value => updateCard({ spellTrapType: value })}
                            options={frame === "spell" ? SPELL_TYPE_OPTIONS : TRAP_TYPE_OPTIONS}
                        />
                    )}

                    <SelectField
                        id="isPendulum"
                        label={labels.pendulum}
                        width="third"
                        value={card.isPendulum ? "yes" : "no"}
                        onChange={value => updateCard({ isPendulum: value === "yes" })}
                        options={YES_NO_OPTIONS}
                        disabled={!canBePendulum(frame)}
                    />

                    <TextField
                        id="name"
                        label={labels.name}
                        width="twoThirds"
                        value={card.name}
                        maxLength={50}
                        onChange={value => updateCard({ name: value })}
                        disabled={hasNoFrame}
                    />

                    {isLink(frame) && (
                        <div className="w-full px-2 flex flex-col">
                            <span id="link-arrows-label" className="mb-1 text-sm font-medium text-center">{labels.linkArrows}</span>
                            <div className="flex justify-center">
                                <LinkArrowSelector
                                    labelledBy="link-arrows-label"
                                    value={card.linkArrows}
                                    onChange={linkArrows => updateCard({ linkArrows })}
                                />
                            </div>
                        </div>
                    )}

                    <ArtField artUrl={card.artUrl} onChange={artUrl => updateCard({ artUrl })} disabled={hasNoFrame} />

                    {card.isPendulum && (
                        <>
                            <PendulumScalesField
                                left={card.pendulumScaleLeft}
                                right={card.pendulumScaleRight}
                                onLeftChange={pendulumScaleLeft => updateCard({ pendulumScaleLeft })}
                                onRightChange={pendulumScaleRight => updateCard({ pendulumScaleRight })}
                            />

                            <CardTextField
                                id="pendulumEffect"
                                label={labels.pendulumEffect}
                                width="full"
                                rows={3}
                                value={card.pendulumEffect}
                                onChange={pendulumEffect => updateCard({ pendulumEffect })}
                                slot={getPendulumEffectSlot(card)}
                            />
                        </>
                    )}

                    <TextField
                        id="typeLine"
                        label={labels.typeLine}
                        width="half"
                        value={card.typeLine}
                        maxLength={30}
                        onChange={typeLine => updateCard({ typeLine })}
                        disabled={hasNoFrame || isSpellOrTrap}
                    />

                    <TextField
                        id="setCode"
                        label={labels.setCode}
                        width="half"
                        value={card.setCode}
                        maxLength={10}
                        onChange={setCode => updateCard({ setCode })}
                        disabled={hasNoFrame}
                    />

                    <CardTextField
                        id="effect"
                        label={hasDescription(frame) ? labels.description : labels.effect}
                        width="full"
                        rows={4}
                        value={card.effect}
                        onChange={effect => updateCard({ effect })}
                        slot={getEffectSlot(card)}
                        disabled={hasNoFrame}
                    />

                    {!isSpellOrTrap && (
                        <>
                            <TextField
                                id="atk"
                                label={labels.atk}
                                width="third"
                                value={card.atk}
                                maxLength={4}
                                onChange={value => updateCard({ atk: sanitizeStat(value, MAX_STAT) })}
                                disabled={hasNoFrame}
                            />

                            <TextField
                                id="def"
                                label={labels.def}
                                width="third"
                                value={card.def}
                                maxLength={4}
                                onChange={value => updateCard({ def: sanitizeStat(value, MAX_STAT) })}
                                disabled={!hasDef(frame)}
                            />

                            <TextField
                                id="linkRating"
                                label={labels.linkRating}
                                width="third"
                                value={card.linkRating}
                                maxLength={1}
                                onChange={() => {}}
                                disabled={!isLink(frame)}
                                readOnly
                            />
                        </>
                    )}

                    <TextField
                        id="passcode"
                        label={labels.passcode}
                        width="half"
                        numericKeyboard
                        value={card.passcode}
                        maxLength={PASSCODE_LENGTH}
                        onChange={value => updateCard({ passcode: sanitizeDigits(value, PASSCODE_LENGTH) })}
                        disabled={hasNoFrame}
                    />

                    <TextField
                        id="copyright"
                        label={labels.copyright}
                        width="half"
                        value={card.copyright}
                        maxLength={30}
                        onChange={copyright => updateCard({ copyright })}
                        disabled={hasNoFrame}
                    />
                </form>
            </div>
        </div>
    );
}
