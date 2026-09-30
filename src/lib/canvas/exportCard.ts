import type { Card } from "@/types/card";
import { drawCard } from "./drawCard";

export type CardExportFailure = "blocked-art" | "encoding-failed";

export class CardExportError extends Error {
    readonly failure: CardExportFailure;

    constructor(failure: CardExportFailure) {
        super(failure);
        this.failure = failure;
    }
}

export async function exportCardPng(card: Card): Promise<Blob> {
    const canvas = document.createElement("canvas");
    await drawCard(canvas, card);

    return new Promise((resolve, reject) => {
        try {
            canvas.toBlob(blob => (blob ? resolve(blob) : reject(new CardExportError("encoding-failed"))), "image/png");
        } catch {
            reject(new CardExportError("blocked-art"));
        }
    });
}
