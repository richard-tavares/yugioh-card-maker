import { useEffect, useState } from "react";
import { loadCardFonts } from "@/lib/canvas";

export function useCardFontsLoaded(): boolean {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let active = true;
        void loadCardFonts().catch(() => {}).then(() => { if (active) setLoaded(true); });
        return () => { active = false; };
    }, []);

    return loaded;
}
