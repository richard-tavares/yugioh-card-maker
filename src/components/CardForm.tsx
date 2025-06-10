import { useContext, useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import type { CardData, LinkArrowKey } from "@/types/CardData";
import { CardContext } from "@/context/CardContext";
import LinkArrowSelector from "@/components/LinkArrowSelector";
import { useNumberInputValidator } from "@/hooks/useNumberInputValidator";
import { useSerialInputValidator } from "@/hooks/useSerialInputValidator";

export default function CardForm() {
    const { cardData, setCardData } = useContext(CardContext);
    const [artSource, setArtSource] = useState<"file" | "link">("file");

    const handleChange =
        (field: keyof CardData) =>
            (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                const rawValue = e.target.value;
                let value: any = rawValue;
                if (field === "stars") value = rawValue ? Number(rawValue) : null;
                setCardData(prev => ({ ...prev, [field]: value }));
            };

    const handleArtInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (artSource === "link") {
            setCardData(prev => ({ ...prev, art: e.target.value }));
        } else {
            const file = e.target.files?.[0];
            const imageUrl = file ? URL.createObjectURL(file) : "";
            setCardData(prev => ({ ...prev, art: imageUrl }));
        }
    };

    useEffect(() => {
        const { template, attribute, pendulum } = cardData;

        if (["Spell", "Trap"].includes(template)) {
            setCardData(prev => ({
                ...prev,
                attribute: template,
                symbol: "Normal",
                stars: null,
                type: "",
                atk: "",
                def: ""
            }));
            return;
        }

        if (pendulum === false) {
            setCardData(prev => ({
                ...prev,
                pendulumEffect: ""
            }));
        }

        if (template === "Link") {
            setCardData(prev => ({
                ...prev,
                stars: null,
                pendulum: false,
                def: ""
            }));
        } else {
            setCardData(prev => ({
                ...prev,
                linkRating: "",
                linkArrowTopLeft: false,
                linkArrowTopCenter: false,
                linkArrowTopRight: false,
                linkArrowMiddleLeft: false,
                linkArrowMiddleRight: false,
                linkArrowBottomLeft: false,
                linkArrowBottomCenter: false,
                linkArrowBottomRight: false
            }));
        }

        if (template === "") {
            setCardData(prev => ({
                ...prev,
                attribute: "",
                symbol: "",
                stars: null,
                type: ""
            }));
            return;
        }

        if (["Spell", "Trap"].includes(attribute)) {
            setCardData(prev => ({
                ...prev,
                attribute: "",
                symbol: ""
            }));
        } else {
            setCardData(prev => ({ ...prev, symbol: "" }));
        }
    }, [cardData.template]);

    const { template, pendulum } = cardData;

    const emptyTemplate = template === "";
    const isXyz = template === "Xyz";
    const isPendulum = pendulum === true;
    const isLink = template === "Link";
    const isSpell = template === "Spell";
    const isTrap = template === "Trap";
    const isMagic = isSpell || isTrap;
    const possiblePendulum = !["Spell", "Trap", "Token", "Link", ""].includes(template);
    const starsLabel = isXyz ? "Rank" : "Nível";

    const handleStarsChange = useNumberInputValidator("stars", setCardData, {
        min: 1,
        max: 12
    });

    const handleAtkChange = useNumberInputValidator("atk", setCardData, {
        min: 0,
        max: 9999
    });

    const handleDefChange = useNumberInputValidator("def", setCardData, {
        min: 0,
        max: 9999
    });

    const handleLinkRatingChange = useNumberInputValidator("linkRating", setCardData, {
        min: 1,
        max: 6
    });

    const handlePendulumBlueScaleChange = useNumberInputValidator("pendulumBlueScale", setCardData, {
        min: 1,
        max: 12
    });

    const handlePendulumRedScaleChange = useNumberInputValidator("pendulumRedScale", setCardData, {
        min: 1,
        max: 12
    });

    const validateSerial = useSerialInputValidator();

    const handleArrowChange = (key: LinkArrowKey, checked: boolean) => {
        setCardData(prev => ({ ...prev, [key]: checked }));
    };

    return (
        <div className="w-full md:w-full lg:w-2/3">
            <div className="h-full lg:max-h-[85vh] overflow-y-auto overflow-x-hidden px-3">
                <form className="flex flex-wrap gap-y-2 -mx-2" autoComplete="off">
                    <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 px-2 flex flex-col">
                        <label htmlFor="template" className="mb-1 text-sm font-medium">Template</label>
                        <select
                            id="template"
                            value={cardData.template}
                            onChange={handleChange("template")}
                            className="p-2 border rounded bg-slate-900 text-white"
                        >
                            <option value="">Selecione</option>
                            <option value="Normal">Monstro Normal</option>
                            <option value="Effect">Monstro de Efeito</option>
                            <option value="Fusion">Monstro de Fusão</option>
                            <option value="Ritual">Monstro Ritual</option>
                            <option value="Synchro">Monstro Sincro</option>
                            <option value="Xyz">Monstro Xyz</option>
                            <option value="Link">Monstro Link</option>
                            <option value="Token">Token</option>
                            <option value="Spell">Magia</option>
                            <option value="Trap">Armadilha</option>
                        </select>
                    </div>

                    <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 px-2 flex flex-col">
                        <label htmlFor="attribute" className="mb-1 text-sm font-medium">Atributo</label>
                        <select
                            id="attribute"
                            value={cardData.attribute}
                            onChange={handleChange("attribute")}
                            disabled={emptyTemplate || isSpell || isTrap}
                            className="p-2 border rounded bg-slate-900 text-white"
                        >
                            <option value="">Selecione</option>
                            <option value="Dark">Trevas</option>
                            <option value="Divine">Divino</option>
                            <option value="Earth">Terra</option>
                            <option value="Fire">Fogo</option>
                            <option value="Light">Luz</option>
                            <option value="Water">Água</option>
                            <option value="Wind">Vento</option>
                            {isSpell && <option value="Spell">Magia</option>}
                            {isTrap && <option value="Trap">Armadilha</option>}
                        </select>
                    </div>

                    {!isMagic && (
                        <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 px-2 flex flex-col">
                            <label htmlFor="stars" className="mb-1 text-sm font-medium">{starsLabel}</label>
                            <input
                                id="stars"
                                type="text"
                                inputMode="numeric"
                                value={cardData.stars ?? ""}
                                maxLength={2}
                                onChange={handleStarsChange}
                                className="p-2 border rounded bg-slate-900 text-white"
                                disabled={isMagic || isLink || emptyTemplate}
                            />
                        </div>
                    )}

                    {isSpell && (
                        <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 px-2 flex flex-col">
                            <label htmlFor="symbol" className="mb-1 text-sm font-medium">Tipo de Magia</label>
                            <select
                                id="symbol"
                                value={cardData.symbol ?? ""}
                                onChange={handleChange("symbol")}
                                className="p-2 border rounded bg-slate-900 text-white"
                            >
                                <option value="Normal">Normal</option>
                                <option value="Quick">Rápida</option>
                                <option value="Field">Campo</option>
                                <option value="Equip">Equipamento</option>
                                <option value="Continuous">Contínua</option>
                                <option value="Ritual">Ritual</option>
                            </select>
                        </div>
                    )}

                    {isTrap && (
                        <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 px-2 flex flex-col">
                            <label htmlFor="symbol" className="mb-1 text-sm font-medium">Tipo de Armadilha</label>
                            <select
                                id="symbol"
                                value={cardData.symbol ?? ""}
                                onChange={handleChange("symbol")}
                                className="p-2 border rounded bg-slate-900 text-white"
                            >
                                <option value="Normal">Normal</option>
                                <option value="Continuous">Contínua</option>
                                <option value="Counter">Resposta</option>
                            </select>
                        </div>
                    )}

                    <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 px-2 flex flex-col">
                        <label htmlFor="pendulum" className="mb-1 text-sm font-medium">Pêndulo?</label>
                        <select
                            id="pendulum"
                            value={cardData.pendulum ? "1" : "0"}
                            onChange={e => {
                                const value = e.target.value === "1";
                                setCardData(prev => ({ ...prev, pendulum: value }));
                            }}
                            disabled={!possiblePendulum}
                            className="p-2 border rounded bg-slate-900 text-white"
                        >
                            <option value="0">Não</option>
                            <option value="1">Sim</option>
                        </select>
                    </div>

                    <div className="w-full md:w-full lg:w-2/3 px-2 flex flex-col">
                        <label htmlFor="name" className="mb-1 text-sm font-medium">Nome</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="off"
                            value={cardData.name}
                            maxLength={50}
                            onChange={handleChange("name")}
                            disabled={emptyTemplate}
                            className="p-2 border rounded bg-slate-900 text-white"
                        />
                    </div>

                    {isLink && (
                        <div className="w-full px-2 flex flex-col">
                            <label htmlFor="link-arrow-selector" className="mb-1 text-sm font-medium text-center">Setas Link</label>
                            <div className="flex justify-center">
                                <LinkArrowSelector id="link-arrow-selector" value={cardData} onChange={handleArrowChange} />
                            </div>
                        </div>
                    )}

                    <div className="w-full px-2 flex flex-col">
                        <label htmlFor="art" className="mb-1 text-sm font-medium">Arte</label>
                        <div className="flex overflow-hidden rounded border border-white bg-slate-900">
                            <select
                                id="artSource"
                                value={artSource}
                                onChange={e => setArtSource(e.target.value as "link" | "file")}
                                disabled={emptyTemplate}
                                className="bg-slate-800 text-white px-3 py-2 border border-white"
                            >
                                <option value="file">Arquivo</option>
                                <option value="link">Link</option>
                            </select>

                            {artSource === "link" ? (
                                <input
                                    key="link"
                                    id="art"
                                    type="text"
                                    inputMode="url"
                                    value={cardData.art ?? ""}
                                    onChange={handleArtInputChange}
                                    disabled={emptyTemplate}
                                    placeholder="URL da imagem"
                                    className="flex-1 px-3 py-2 bg-slate-900 text-white"
                                />
                            ) : (
                                <input
                                    key="file"
                                    id="art"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleArtInputChange}
                                    disabled={emptyTemplate}
                                    className="flex-1 file:px-3 file:py-2 file:bg-slate-800 file:text-white file:border-0 text-white bg-slate-900"
                                />
                            )}
                        </div>
                    </div>

                    {isPendulum && (
                        <>
                            <div className="w-full px-2 flex flex-col">
                                <label htmlFor="pendulumBlueScale" className="mb-1 text-sm font-medium">
                                    Escalas Pêndulo
                                </label>
                                <div className="flex w-full border rounded bg-slate-900 px-0 py-2 relative overflow-hidden">
                                    <div className="relative flex-1">
                                        <img
                                            src={`${import.meta.env.BASE_URL}/images/blue-scale.svg`}
                                            alt="Escala Azul"
                                            className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                                        />
                                        <input
                                            id="pendulumBlueScale"
                                            type="text"
                                            inputMode="numeric"
                                            value={cardData.pendulumBlueScale ?? ""}
                                            maxLength={2}
                                            onChange={handlePendulumBlueScaleChange}
                                            disabled={!isPendulum}
                                            className="text-center w-full pl-8 pr-2 bg-slate-900 text-white border-none focus:ring-0 focus:outline-none"
                                        />
                                    </div>

                                    <div className="relative flex-1 border-l border-white">
                                        <img
                                            src={`${import.meta.env.BASE_URL}/images/red-scale.svg`}
                                            alt="Escala Vermelha"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                                        />
                                        <input
                                            id="pendulumRedScale"
                                            type="text"
                                            inputMode="numeric"
                                            value={cardData.pendulumRedScale ?? ""}
                                            maxLength={2}
                                            onChange={handlePendulumRedScaleChange}
                                            disabled={!isPendulum}
                                            className="text-center w-full pr-8 pl-2 bg-slate-900 text-white border-none focus:ring-0 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="w-full px-2 flex flex-col">
                                <label htmlFor="pendulumEffect" className="mb-1 text-sm font-medium">Efeito Pêndulo</label>
                                <textarea
                                    id="pendulumEffect"
                                    rows={3}
                                    value={cardData.pendulumEffect ?? ""}
                                    maxLength={300}
                                    onChange={handleChange("pendulumEffect")}
                                    disabled={!isPendulum}
                                    className="p-2 border rounded bg-slate-900 text-white"
                                />
                            </div>
                        </>
                    )}

                    <div className="w-full md:w-full lg:w-1/2 px-2 flex flex-col">
                        <label htmlFor="type" className="mb-1 text-sm font-medium">Tipo</label>
                        <input
                            id="type"
                            type="text"
                            value={cardData.type ?? ""}
                            maxLength={30}
                            onChange={handleChange("type")}
                            disabled={isMagic || emptyTemplate}
                            className="p-2 border rounded bg-slate-900 text-white"
                        />
                    </div>

                    <div className="w-full md:w-full lg:w-1/2 px-2 flex flex-col">
                        <label htmlFor="edition" className="mb-1 text-sm font-medium">Edição</label>
                        <input
                            id="edition"
                            type="text"
                            value={cardData.edition ?? ""}
                            maxLength={10}
                            onChange={handleChange("edition")}
                            disabled={emptyTemplate}
                            className="p-2 border rounded bg-slate-900 text-white"
                        />
                    </div>

                    <div className="w-full px-2 flex flex-col">
                        <label htmlFor="effect" className="mb-1 text-sm font-medium">Efeito</label>
                        <textarea
                            id="effect"
                            rows={4}
                            value={cardData.effect ?? ""}
                            maxLength={600}
                            onChange={handleChange("effect")}
                            disabled={emptyTemplate}
                            className="p-2 border rounded bg-slate-900 text-white"
                        />
                    </div>

                    {!isMagic && (
                        <>
                            <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 px-2 flex flex-col">
                                <label htmlFor="atk" className="mb-1 text-sm font-medium">Ataque</label>
                                <input
                                    id="atk"
                                    type="text"
                                    inputMode="numeric"
                                    value={cardData.atk ?? ""}
                                    maxLength={4}
                                    onChange={handleAtkChange}
                                    disabled={isMagic || emptyTemplate}
                                    className="p-2 border rounded bg-slate-900 text-white"
                                />
                            </div>

                            <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 px-2 flex flex-col">
                                <label htmlFor="def" className="mb-1 text-sm font-medium">Defesa</label>
                                <input
                                    id="def"
                                    type="text"
                                    inputMode="numeric"
                                    value={cardData.def ?? ""}
                                    maxLength={4}
                                    onChange={handleDefChange}
                                    disabled={isMagic || emptyTemplate || isLink}
                                    className="p-2 border rounded bg-slate-900 text-white"
                                />
                            </div>

                            <div className="w-full md:w-full lg:w-1/3 px-2 flex flex-col">
                                <label htmlFor="linkRating" className="mb-1 text-sm font-medium">Classificação Link</label>
                                <input
                                    id="linkRating"
                                    type="text"
                                    inputMode="numeric"
                                    value={cardData.linkRating ?? ""}
                                    maxLength={1}
                                    onChange={handleLinkRatingChange}
                                    disabled={!isLink}
                                    className="p-2 border rounded bg-slate-900 text-white"
                                />
                            </div>
                        </>
                    )}

                    <div className="w-full md:w-full lg:w-1/2 px-2 flex flex-col">
                        <label htmlFor="serial" className="mb-1 text-sm font-medium">Número de Série</label>
                        <input
                            id="serial"
                            type="text"
                            inputMode="numeric"
                            value={cardData.serial ?? ""}
                            maxLength={8}
                            onChange={e =>
                                setCardData(prev => ({
                                    ...prev,
                                    serial: validateSerial(e.target.value),
                                }))
                            }
                            disabled={emptyTemplate}
                            className="p-2 border rounded bg-slate-900 text-white"
                        />
                    </div>

                    <div className="w-full md:w-full lg:w-1/2 px-2 flex flex-col">
                        <label htmlFor="copyright" className="mb-1 text-sm font-medium">Direitos Autorais</label>
                        <input
                            id="copyright"
                            type="text"
                            value={cardData.copyright ?? ""}
                            maxLength={30}
                            onChange={handleChange("copyright")}
                            disabled={emptyTemplate}
                            className="p-2 border rounded bg-slate-900 text-white"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
