import { useContext, useEffect, useRef, useState } from "react";
import { CardContext } from "@/context/CardContext";

export default function CardCanvas() {
    const { cardData } = useContext(CardContext);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const BASE_WIDTH = 420;
    const BASE_HEIGHT = 610;

    const [flipped, setFlipped] = useState(false);
    const [displayedTemplate, setDisplayedTemplate] = useState<string | null>(null);

    useEffect(() => {
        if (!cardData.template) {
            setFlipped(false);
            setTimeout(() => setDisplayedTemplate(null), 700);
            return;
        }

        if (!displayedTemplate) {
            setDisplayedTemplate(cardData.template);
            setFlipped(true);
        } else if (displayedTemplate !== cardData.template) {
            setDisplayedTemplate(cardData.template);
        }
    }, [cardData.template]);

    useEffect(() => {
        if (!displayedTemplate) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        (async () => {
            await Promise.all([
                document.fonts.load("55px 'Yu-Gi-Oh! Matrix Small Caps 2'"),
                document.fonts.load("22px 'Yu-Gi-Oh! ITC Stone Serifa Negrito Versalete'"),
                document.fonts.load("16px 'Eurostile Candy W01 Semibold'")
            ]);

            canvas.width = BASE_WIDTH;
            canvas.height = BASE_HEIGHT;
            ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

            const safeTemplate = displayedTemplate.trim() || "Cover";
            drawArt(ctx);

            const bgImage = new Image();
            const isPendulum = cardData.pendulum === true;
            const bgPath = isPendulum
                ? `${import.meta.env.BASE_URL}/images/card/backgrounds/${safeTemplate}.pendulum.png`
                : `${import.meta.env.BASE_URL}/images/card/backgrounds/${safeTemplate}.png`;

            bgImage.src = bgPath;
            bgImage.onload = () => {
                ctx.drawImage(bgImage, 0, 0, BASE_WIDTH, BASE_HEIGHT);
                drawCardElements(ctx, safeTemplate);
            };
        })();
    }, [displayedTemplate, cardData]);

    const drawCardElements = (ctx: CanvasRenderingContext2D, template: string) => {
        drawCardName(ctx, template);
        drawAttribute(ctx);
        drawStars(ctx, template);
        drawSpellTrapLabel(ctx, template);
        drawLinkArrows(ctx, template);
        drawPendulumBlueScale(ctx);
        drawPendulumRedScale(ctx);
        drawPendulumEffect(ctx)
        drawEdition(ctx, template);
        drawType(ctx, template);
        drawEffect(ctx, template)
        drawAtk(ctx, template);
        drawDef(ctx, template);
        drawLinkRating(ctx, template);
        drawSerialNumber(ctx, template);
        drawCopyright(ctx, template);
    };

    const drawText = (ctx: CanvasRenderingContext2D, text: string, options: any) => {
        const { x, y, font, color, align, baseline } = options;
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
        ctx.fillText(text, x, y);
    };

    const drawCardName = (ctx: CanvasRenderingContext2D, template: string) => {
        const name = cardData.name || "";
        ctx.font = "50px 'Yu-Gi-Oh! Matrix Small Caps 2'";
        ctx.fillStyle = ["Xyz", "Spell", "Trap"].includes(template) ? "#FFF" : "#000";
        ctx.textBaseline = "top";

        const maxWidth = 327;
        const measure = ctx.measureText(name);
        const scale = measure.width > maxWidth ? maxWidth / measure.width : 1;

        ctx.save();
        ctx.translate(30, 18);
        ctx.scale(scale, 1);
        ctx.fillText(name, 0, 0);
        ctx.restore();
    };

    const drawAttribute = (ctx: CanvasRenderingContext2D) => {
        if (!cardData.attribute) return;
        const img = new Image();
        img.src = `${import.meta.env.BASE_URL}/images/card/attributes/${cardData.attribute}.png`;
        img.onload = () => ctx.drawImage(img, BASE_WIDTH - 60, 29, 35, 35);
    };

    const drawStars = (ctx: CanvasRenderingContext2D, template: string) => {
        if (!cardData.stars || ["Spell", "Trap", "Link"].includes(template)) return;
        const img = new Image();
        img.src = template === "Xyz"
            ? `${import.meta.env.BASE_URL}/images/card/stars/Rank.png`
            : `${import.meta.env.BASE_URL}/images/card/stars/Level.png`;
        img.onload = () => {
            const y = 73, spacing = 28;
            for (let i = 0; i < cardData.stars!; i++) {
                const x = template === "Xyz" ? 43 + i * spacing : BASE_WIDTH - 40 - (i + 1) * spacing;
                ctx.drawImage(img, x, y, 25, 25);
            }
        };
    };

    const drawSpellTrapLabel = (ctx: CanvasRenderingContext2D, template: string) => {
        if (!['Spell', 'Trap'].includes(template)) return;

        const text = template === 'Spell' ? 'Card de Magia' : 'Card de Armadilha';
        ctx.font = "22px 'Yu-Gi-Oh! ITC Stone Serifa Negrito Versalete'";
        ctx.fillStyle = "#000";
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";

        const padding = 2;
        const symbolSize = 25;
        const textY = 87;
        const hasSymbol = cardData.symbol && cardData.symbol !== "Normal";
        const bracketWidth = ctx.measureText("[").width;
        const textWidth = ctx.measureText(text).width;
        const endBracketWidth = ctx.measureText("]").width;

        const totalWidth = bracketWidth + textWidth + (hasSymbol ? symbolSize : 0) + endBracketWidth + padding * (hasSymbol ? 3 : 2);
        const startX = 380 - totalWidth;

        let x = startX;

        ctx.fillText("[", x, textY);
        x += bracketWidth + padding;

        ctx.fillText(text, x, textY);
        x += textWidth + padding;

        if (hasSymbol) {
            const symbolImage = new Image();
            const currentX = x;

            symbolImage.src = `${import.meta.env.BASE_URL}/images/card/symbols/${cardData.symbol}.png`;
            symbolImage.onload = () => {
                ctx.drawImage(symbolImage, currentX, textY - 12, symbolSize, symbolSize);

                ctx.font = "22px 'Yu-Gi-Oh! ITC Stone Serifa Negrito Versalete'";
                ctx.fillStyle = "#000";
                ctx.textBaseline = "middle";
                ctx.textAlign = "left";

                const closingBracketX = currentX + symbolSize + padding;
                ctx.fillText("]", closingBracketX, textY);
            };
        } else {
            ctx.fillText("]", x, textY);
        }
    };

    const drawArt = (ctx: CanvasRenderingContext2D) => {
        if (!cardData.art) return;

        const isPendulum = cardData.pendulum === true;

        const x = isPendulum ? 30 : 48;
        const y = 110;
        const w = isPendulum ? 360 : 325;
        const h = isPendulum ? 270 : 325;

        const img = new Image();
        img.src = cardData.art;
        img.onload = () => ctx.drawImage(img, x, y, w, h);
    };

    const drawLinkArrows = (ctx: CanvasRenderingContext2D, template: string) => {
        if (template !== "Link") return;
        const arrows: { key: keyof typeof cardData; x: number; y: number, w: number, h: number }[] = [
            { key: "linkArrowTopLeft", x: 30, y: 93, w: 45, h: 45 },
            { key: "linkArrowTopCenter", x: 165, y: 84, w: 90, h: 27 },
            { key: "linkArrowTopRight", x: 345, y: 93, w: 45, h: 45 },
            { key: "linkArrowMiddleLeft", x: 20, y: 225, w: 27, h: 90 },
            { key: "linkArrowMiddleRight", x: 372, y: 225, w: 27, h: 90 },
            { key: "linkArrowBottomLeft", x: 30, y: 402, w: 45, h: 45 },
            { key: "linkArrowBottomCenter", x: 165, y: 432, w: 90, h: 27 },
            { key: "linkArrowBottomRight", x: 345, y: 402, w: 45, h: 45 },
        ];

        arrows.forEach(({ key, x, y, w, h }) => {
            if (!cardData[key]) return;
            const img = new Image();
            img.src = `${import.meta.env.BASE_URL}/images/card/arrows/${key}.png`;
            img.onload = () => ctx.drawImage(img, x, y, w, h);
        });
    };

    const drawPendulumBlueScale = (ctx: CanvasRenderingContext2D) => {
        const isPendulum = cardData.pendulum === true;
        if (!isPendulum) return;
        drawText(ctx, cardData.pendulumBlueScale, {
            x: 44,
            y: BASE_HEIGHT - 170,
            font: "bold 16px 'Yu-Gi-Oh! Matrix Regular Small Caps'",
            color: "#000",
            align: "center",
            baseline: "bottom"
        });
    };

    const drawPendulumRedScale = (ctx: CanvasRenderingContext2D) => {
        const isPendulum = cardData.pendulum === true;
        if (!isPendulum) return;
        drawText(ctx, cardData.pendulumRedScale, {
            x: 377,
            y: BASE_HEIGHT - 170,
            font: "bold 16px 'Yu-Gi-Oh! Matrix Regular Small Caps'",
            color: "#000",
            align: "center",
            baseline: "bottom"
        });
    };

    const drawPendulumEffect = (ctx: CanvasRenderingContext2D) => {
        if (!cardData.pendulum || !cardData.pendulumEffect) return;

        const baseX = 67;
        const baseY = 385;
        const maxWidth = 290;
        const maxLines = 5;
        let fontSize = 12;
        const minFontSize = 10;
        const lineHeightFactor = 1;

        let finalLines: string[] = [];

        const getFont = (size: number) => {
            return `${size}px 'Yu-Gi-Oh! Matrix Book'`;
        };

        const formatLines = (text: string, fontSize: number): string[] => {
            const words = text.split(" ");
            const lines: string[] = [];
            let line = "";

            ctx.font = getFont(fontSize);

            for (const word of words) {
                const testLine = line + word + " ";
                const testWidth = ctx.measureText(testLine).width;

                if (testWidth > maxWidth && line !== "") {
                    lines.push(line.trim());
                    line = word + " ";
                } else {
                    line = testLine;
                }
            }

            if (line.trim() !== "") lines.push(line.trim());
            return lines;
        };

        const buildLines = () => {
            const paragraphs = cardData.pendulumEffect.trim().split("\n");
            let tempLines: string[] = [];

            for (const paragraph of paragraphs) {
                const lines = formatLines(paragraph, fontSize);
                tempLines.push(...lines);
            }

            return tempLines;
        };

        do {
            ctx.font = getFont(fontSize);
            finalLines = buildLines();
            if (finalLines.length <= maxLines) break;
            fontSize--;
        } while (fontSize >= minFontSize);

        ctx.fillStyle = "#000";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        finalLines.slice(0, maxLines).forEach((line, index) => {
            const y = baseY + index * (fontSize * lineHeightFactor);
            const measure = ctx.measureText(line);
            const scale = measure.width > maxWidth ? maxWidth / measure.width : 1;

            ctx.save();
            ctx.translate(baseX, y);
            ctx.scale(scale, 1);
            ctx.font = getFont(fontSize);
            ctx.fillText(line, 0, 0);
            ctx.restore();
        });
    };

    const drawEdition = (ctx: CanvasRenderingContext2D, template: string) => {
        if (!cardData.edition) return;

        const isPendulum = cardData.pendulum === true;
        const isXyz = template === "Xyz";
        const isLink = template === "Link";

        let x: number;
        if (isPendulum) {
            x = 100;
        } else if (isLink) {
            x = 345;
        } else {
            x = 378;
        }

        const y = BASE_HEIGHT - (isPendulum ? 40 : 157);

        drawText(ctx, cardData.edition, {
            x,
            y,
            font: "12px 'Yu-Gi-Oh! Matrix Regular Small Caps'",
            color: isXyz && !isPendulum ? "#FFF" : "#000",
            align: "right",
            baseline: "bottom"
        });
    };


    const drawType = (ctx: CanvasRenderingContext2D, template: string) => {
        if (["Spell", "Trap"].includes(template) || !cardData.type) return;
        const isPendulum = cardData.pendulum === true;
        const baseX = isPendulum ? 33 : 30;
        drawText(ctx, `[${cardData.type}]`, {
            x: baseX,
            y: BASE_HEIGHT - 137,
            font: "14px 'Yu-Gi-Oh! ITC Stone Serifa Negrito Versalete'",
            color: "#000",
            align: "left",
            baseline: "bottom"
        });
    };

    const drawEffect = (ctx: CanvasRenderingContext2D, safeTemplate: string) => {
        if (!cardData.effect) return;
        const isPendulum = cardData.pendulum === true;
        const baseX = isPendulum ? 33 : 28;
        const baseY = 475;
        const maxWidth = isPendulum ? 357 : 363;
        const maxLines = 8;
        let fontSize = 12;
        const minFontSize = 10;
        const lineHeightFactor = 1;

        let finalLines: string[] = [];

        const getFont = (size: number) => {
            const style = safeTemplate === "Normal" ? "italic" : "normal";
            return `${style} ${size}px 'Yu-Gi-Oh! Matrix Book'`;
        };

        const formatLines = (text: string, fontSize: number): string[] => {
            const words = text.split(" ");
            const lines: string[] = [];
            let line = "";

            ctx.font = getFont(fontSize);

            for (const word of words) {
                const testLine = line + word + " ";
                const testWidth = ctx.measureText(testLine).width;

                if (testWidth > maxWidth && line !== "") {
                    lines.push(line.trim());
                    line = word + " ";
                } else {
                    line = testLine;
                }
            }

            if (line.trim() !== "") lines.push(line.trim());
            return lines;
        };

        const buildLines = () => {
            const paragraphs = cardData.effect.trim().split("\n");
            let tempLines: string[] = [];

            for (const paragraph of paragraphs) {
                const lines = formatLines(paragraph, fontSize);
                tempLines.push(...lines);
            }

            return tempLines;
        };

        do {
            ctx.font = getFont(fontSize);
            finalLines = buildLines();
            if (finalLines.length <= maxLines) break;
            fontSize--;
        } while (fontSize >= minFontSize);

        ctx.fillStyle = "#000";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        finalLines.slice(0, maxLines).forEach((line, index) => {
            const y = baseY + index * (fontSize * lineHeightFactor);
            const measure = ctx.measureText(line);
            const scale = measure.width > maxWidth ? maxWidth / measure.width : 1;

            ctx.save();
            ctx.translate(baseX, y);
            ctx.scale(scale, 1);
            ctx.font = getFont(fontSize);
            ctx.fillText(line, 0, 0);
            ctx.restore();
        });
    };

    const drawAtk = (ctx: CanvasRenderingContext2D, template: string) => {
        if (["Spell", "Trap"].includes(template) || !cardData.atk) return;
        drawText(ctx, cardData.atk, {
            x: 300,
            y: BASE_HEIGHT - 34,
            font: "bold 16px 'Yu-Gi-Oh! Matrix Regular Small Caps'",
            color: "#000",
            align: "right",
            baseline: "bottom"
        });
    };

    const drawDef = (ctx: CanvasRenderingContext2D, template: string) => {
        if (["Spell", "Trap", "Link"].includes(template) || !cardData.def) return;
        drawText(ctx, cardData.def, {
            x: 385,
            y: BASE_HEIGHT - 34,
            font: "bold 16px 'Yu-Gi-Oh! Matrix Regular Small Caps'",
            color: "#000",
            align: "right",
            baseline: "bottom"
        });
    };

    const drawLinkRating = (ctx: CanvasRenderingContext2D, template: string) => {
        if (template !== "Link" || !cardData.linkRating) return;
        drawText(ctx, cardData.linkRating, {
            x: 385,
            y: BASE_HEIGHT - 34,
            font: "bold 16px 'Eurostile Candy W01 Semibold'",
            color: "#000",
            align: "right",
            baseline: "bottom"
        });
    };

    const drawSerialNumber = (ctx: CanvasRenderingContext2D, template: string) => {
        if (!cardData.serial) return;
        const isXyz = template === "Xyz";
        const isPendulum = cardData.pendulum === true;
        const offsetY = isPendulum ? 15 : 12;
        drawText(ctx, cardData.serial, {
            x: 20,
            y: BASE_HEIGHT - offsetY,
            font: "12px 'Yu-Gi-Oh! Matrix Regular Small Caps'",
            color: isXyz && !isPendulum ? "#FFF" : "#000",
            align: "left",
            baseline: "bottom"
        });
    };

    const drawCopyright = (ctx: CanvasRenderingContext2D, template: string) => {
        if (!cardData.copyright) return;
        const isXyz = template === "Xyz";
        const isPendulum = cardData.pendulum === true;
        const offsetY = isPendulum ? 15 : 12;

        drawText(ctx, cardData.copyright, {
            x: 380,
            y: BASE_HEIGHT - offsetY,
            font: "12px 'Yu-Gi-Oh! Matrix Regular Small Caps'",
            color: isXyz && !isPendulum ? "#FFF" : "#000",
            align: "right",
            baseline: "bottom"
        });
    };

    return (
        <div className="w-full md:w-full lg:w-1/3 flex justify-center items-center">
            <div className="card-wrapper lg:mt-10 lg:mx-5 lg:scale-110 z-2">
                <div className={`card-inner ${flipped ? "flipped" : ""}`}>
                    <div className="card-face card-back">
                        <img
                            src={`${import.meta.env.BASE_URL}/images/card/backgrounds/Cover.png`}
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
