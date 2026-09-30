import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { STRINGS } from "@/constants/strings";
import { useCard } from "@/hooks/useCard";
import { CardExportError, exportCardPng } from "@/lib/canvas";
import { publicUrl } from "@/utils/publicUrl";

const FALLBACK_FILE_NAME = "yugioh-card";

function toFileName(cardName: string) {
    const slug = cardName.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
    return `${slug || FALLBACK_FILE_NAME}.png`;
}

function saveFile(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
}

export function Header() {
    const { card } = useCard();
    const [error, setError] = useState("");
    const canDownload = card.frame !== "";

    const handleDownload = async () => {
        setError("");
        try {
            saveFile(await exportCardPng(card), toFileName(card.name));
        } catch (failure) {
            setError(STRINGS.exportErrors[failure instanceof CardExportError ? failure.failure : "unknown"]);
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full h-14 bg-black text-white flex items-center px-4 shadow z-10 justify-between">
            <div className="flex items-center">
                <img src={publicUrl("images/logo.png")} width="40" alt="" className="mx-2" />
                <h1 className="font-yugioh text-lg">{STRINGS.app.title}</h1>
            </div>

            <div className="flex items-center gap-3">
                {error && <p role="alert" className="text-xs text-red-400 max-w-xs text-right">{error}</p>}
                <button
                    onClick={handleDownload}
                    disabled={!canDownload}
                    title={canDownload ? undefined : STRINGS.app.downloadNeedsFrame}
                    className="flex items-center gap-2 text-sm bg-black border border-white text-white px-3 py-1 rounded hover:text-blue-800 hover:border-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-white disabled:hover:border-white"
                >
                    <FaDownload className="text-base" />
                    <span className="hidden sm:inline">{STRINGS.app.download}</span>
                </button>
            </div>
        </header>
    );
}
