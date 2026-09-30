import { createRoot } from "react-dom/client";
import { CardPreview } from "@/components/card/CardPreview";
import { CardContext } from "@/contexts/CardContext";
import "@/index.css";
import { fixtures } from "./fixtures";

const params = new URLSearchParams(location.search);
const fixtureName = params.get("fixture") ?? "";
const scale = Number(params.get("scale") ?? 1);
const card = fixtures[fixtureName];

const root = createRoot(document.getElementById("root")!);

if (card) {
    root.render(
        <CardContext.Provider value={{ card, updateCard: () => {} }}>
            <CardPreview scale={scale} />
        </CardContext.Provider>
    );
} else {
    root.render(<p>Unknown fixture: {fixtureName}</p>);
}
