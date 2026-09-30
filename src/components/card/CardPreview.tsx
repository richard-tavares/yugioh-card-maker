import { useEffect, useRef, useState } from "react";
import { STRINGS } from "@/constants/strings";
import { useCard } from "@/hooks/useCard";
import { CARD_SCALE, drawCard } from "@/lib/canvas";
import { publicUrl } from "@/utils/publicUrl";
import "./CardPreview.css";

const FLIP_DURATION_MS = 700;

type Props = Readonly<{
    scale?: number;
}>;

export function CardPreview({ scale = CARD_SCALE }: Props) {
    const { card } = useCard();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [displayedFrame, setDisplayedFrame] = useState(card.frame);
    const isFaceUp = card.frame !== "";

    useEffect(() => {
        if (card.frame) {
            setDisplayedFrame(card.frame);
            return;
        }

        const timeout = setTimeout(() => setDisplayedFrame(""), FLIP_DURATION_MS);
        return () => clearTimeout(timeout);
    }, [card.frame]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !displayedFrame) return;

        let stale = false;
        void drawCard(canvas, { ...card, frame: displayedFrame }, { scale, isStale: () => stale });
        return () => { stale = true; };
    }, [displayedFrame, card, scale]);

    return (
        <div className="w-full md:w-full lg:w-1/3 flex justify-center items-center">
            <div className="card-wrapper lg:mt-10 lg:mx-5 lg:scale-110 lg:z-2">
                <div className={`card-inner ${isFaceUp ? "flipped" : ""}`}>
                    <div className="card-face card-back">
                        <img
                            src={publicUrl("images/card/card-back.png")}
                            alt={STRINGS.preview.cardBack}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="card-face card-front">
                        <canvas ref={canvasRef} role="img" aria-label={STRINGS.preview.card(card.name)} className="w-full h-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
