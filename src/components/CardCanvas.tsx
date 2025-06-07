import { useContext, useEffect, useRef, useState } from "react";
import { CardContext } from "@/context/CardContext";

export default function CardCanvas() {
    const { cardData } = useContext(CardContext);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const BASE_WIDTH = 420;
    const BASE_HEIGHT = 610;

    const [flipped, setFlipped] = useState(false);
    const [displayedType, setDisplayedType] = useState<string | null>(null);

    useEffect(() => {
        if (cardData.cardType === "") {
            setFlipped(false);
            setTimeout(() => setDisplayedType(null), 700);
            return;
        }

        if (!displayedType) {
            setDisplayedType(cardData.cardType);
            setFlipped(true);
        } else if (displayedType !== cardData.cardType) {
            setDisplayedType(cardData.cardType);
        }
    }, [cardData.cardType]);

    useEffect(() => {
        if (!displayedType) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = BASE_WIDTH;
        canvas.height = BASE_HEIGHT;
        ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

        const bgImage = new Image();
        bgImage.src = `/images/card/background/${displayedType}.png`;
        bgImage.onload = () => {
            ctx.drawImage(bgImage, 0, 0, BASE_WIDTH, BASE_HEIGHT);

            ctx.font = "55px 'Yu-Gi-Oh! Matrix Small Caps 2'";
            ctx.fillStyle = displayedType === "Xyz" ? "#FFF" : "#000";
            ctx.textBaseline = "top";

            const maxWidth = 330;
            const x = 26;
            const y = 15;
            const name = cardData.name || "";
            const measure = ctx.measureText(name);

            let scale = 1;
            if (measure.width > maxWidth) {
                scale = maxWidth / measure.width;
            }

            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scale, 1);
            ctx.fillText(name, 0, 0);
            ctx.restore();

            if (cardData.attribute) {
                const attrImage = new Image();
                attrImage.src = `/images/card/attribute/${cardData.attribute}.png`;
                attrImage.onload = () => {
                    ctx.drawImage(attrImage, BASE_WIDTH - 60, 29, 35, 35);
                };
            }

            if (
                cardData.stars &&
                !["Spell", "Trap", "Token", "Link"].includes(displayedType)
            ) {
                const starImage = new Image();
                starImage.src =
                    displayedType === "Xyz"
                        ? "/images/card/star/Rank.png"
                        : "/images/card/star/Level.png";

                starImage.onload = () => {
                    const spacing = 28;
                    const y = 73;
                    const isXyz = displayedType === "Xyz";

                    for (let i = 0; i < cardData.stars!; i++) {
                        const x = isXyz
                            ? 43 + i * spacing
                            : BASE_WIDTH - 40 - (i + 1) * spacing;
                        ctx.drawImage(starImage, x, y, 25, 25);
                    }
                };
            }

            if (cardData.symbol) {
                const symbolImage = new Image();
                symbolImage.src = `/images/card/symbol/${cardData.symbol}.png`;
                symbolImage.onload = () => {
                    ctx.drawImage(symbolImage, 26, 110, 30, 30);
                };
            }
        };
    }, [displayedType, cardData.attribute, cardData.stars, cardData.name, cardData.symbol]);

    return (
        <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 flex justify-center items-center">
            <div className="card-wrapper w-full mx-4 mt-10">
                <div className={`card-inner ${flipped ? "flipped" : ""}`}>
                    <div className="card-face card-back">
                        <img
                            src="/images/card/background/Cover.png"
                            alt="Verso da carta"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="card-face card-front">
                        <canvas ref={canvasRef} className="w-full h-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
