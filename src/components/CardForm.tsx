import { useContext, useEffect } from "react";
import { CardContext } from "@/context/CardContext";

export default function CardForm() {
    const { cardData, setCardData } = useContext(CardContext);

    const handleChange = (field: keyof typeof cardData) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setCardData(prev => ({ ...prev, [field]: e.target.value }));

    useEffect(() => {
        const { cardType, attribute } = cardData;

        if (cardType === "Spell" || cardType === "Trap") {
            setCardData(prev => ({
                ...prev,
                attribute: cardType,
                symbol: "Normal",
                stars: null
            }));
            return;
        }

        if (cardType === "Token") {
            setCardData(prev => ({
                ...prev,
                stars: null
            }));
            return;
        }

        if (cardType === "") {
            setCardData(prev => ({
                ...prev,
                attribute: "",
                symbol: "",
                stars: null
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
            setCardData(prev => ({
                ...prev,
                symbol: ""
            }));
        }
    }, [cardData.cardType]);

    const isRank = cardData.cardType === "Xyz";
    const starsLabel = isRank ? "Rank" : "Nível";

    const isSpell = cardData.cardType === "Spell";
    const isTrap = cardData.cardType === "Trap";
    const isAttributeDisabled = cardData.cardType === "";
    const isStarsDisabled = ["", "Token"].includes(cardData.cardType);
    const isStarsHidden = isSpell || isTrap;

    return (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full" autoComplete="off">
            <div className="flex flex-col">
                <label htmlFor="cardType" className="mb-1 text-sm font-medium">Tipo de carta</label>
                <select
                    id="cardType"
                    value={cardData.cardType}
                    onChange={handleChange("cardType")}
                    className="p-2 border rounded bg-gray-900 text-white"
                    autoComplete="off"
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

            <div className="flex flex-col">
                <label htmlFor="name" className="mb-1 text-sm font-medium">Nome</label>
                <input
                    id="name"
                    type="text"
                    value={cardData.name}
                    maxLength={60}
                    onChange={handleChange("name")}
                    className="p-2 border rounded bg-gray-900 text-white"
                    autoComplete="off"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="attribute" className="mb-1 text-sm font-medium">Atributo</label>
                <select
                    id="attribute"
                    value={cardData.attribute}
                    onChange={handleChange("attribute")}
                    disabled={isAttributeDisabled || isSpell || isTrap}
                    className="p-2 border rounded bg-gray-900 text-white disabled:opacity-50"
                >
                    <option selected disabled value="">Selecione</option>
                    <option value="Dark" disabled={isSpell || isTrap}>Trevas</option>
                    <option value="Divine" disabled={isSpell || isTrap}>Divino</option>
                    <option value="Earth" disabled={isSpell || isTrap}>Terra</option>
                    <option value="Fire" disabled={isSpell || isTrap}>Fogo</option>
                    <option value="Light" disabled={isSpell || isTrap}>Luz</option>
                    <option value="Water" disabled={isSpell || isTrap}>Água</option>
                    <option value="Wind" disabled={isSpell || isTrap}>Vento</option>
                    {isSpell && <option value="Spell" selected>Magia</option>}
                    {isTrap && <option value="Trap" selected>Armadilha</option>}
                </select>
            </div>

            {!isStarsHidden && (
                <div className="flex flex-col">
                    <label htmlFor="stars" className="mb-1 text-sm font-medium">{starsLabel}</label>
                    <input
                        id="stars"
                        type="number"
                        min={1}
                        max={12}
                        value={cardData.stars ?? ""}
                        onChange={handleChange("stars")}
                        className="p-2 border rounded bg-gray-900 text-white disabled:opacity-50"
                        disabled={isStarsDisabled}
                        autoComplete="off"
                    />
                </div>
            )}

            {isSpell && (
                <div className="flex flex-col">
                    <label htmlFor="symbol" className="mb-1 text-sm font-medium">Tipo de Magia</label>
                    <select
                        id="symbol"
                        value={cardData.symbol ?? ""}
                        onChange={handleChange("symbol")}
                        className="p-2 border rounded bg-gray-900 text-white"
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
                <div className="flex flex-col">
                    <label htmlFor="symbol" className="mb-1 text-sm font-medium">Tipo de Armadilha</label>
                    <select
                        id="symbol"
                        value={cardData.symbol ?? ""}
                        onChange={handleChange("symbol")}
                        className="p-2 border rounded bg-gray-900 text-white"
                    >
                        <option value="Normal">Normal</option>
                        <option value="Continuous">Contínua</option>
                        <option value="Counter">Marcador</option>
                    </select>
                </div>
            )}
        </form>
    );
}
