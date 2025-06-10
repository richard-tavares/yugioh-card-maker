import { FaDownload } from "react-icons/fa";

export default function Header() {
    const handleDownload = () => {
        const canvas = document.querySelector("canvas");
        if (!canvas) return;

        const link = document.createElement("a");
        link.download = "yugioh-card.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    return (
        <header className="fixed top-0 left-0 w-full h-14 bg-black text-white flex items-center px-4 shadow z-1 justify-between">
            <div className="flex items-center">
                <img src={`${import.meta.env.BASE_URL}/images/logo.png`} width="40" alt="logo" className="mx-2" />
                <h1 className="font-yugioh text-lg">Yu-Gi-Oh! Card Maker</h1>
            </div>

            <button
                onClick={handleDownload}
                className="flex items-center gap-2 text-sm bg-black border border-white text-white px-3 py-1 rounded hover:text-blue-800 hover:border-blue-800 transition-all"
            >
                <FaDownload className="text-base" />
                <span className="hidden sm:inline">Download</span>
            </button>
        </header>
    );
}
