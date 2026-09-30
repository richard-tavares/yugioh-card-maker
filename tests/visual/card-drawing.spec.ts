import { test, expect, type Page } from "@playwright/test";
import { fixtures } from "./fixtures";

const STABLE_READS_REQUIRED = 4;
const READ_INTERVAL_MS = 250;
const TIMEOUT_MS = 10_000;
const HIGH_RESOLUTION_FIXTURES = ["effect-long-text", "pendulum-xyz", "spell-quick", "link"];

async function readCanvasWhenStable(page: Page): Promise<string> {
    const readCanvas = () => page.evaluate(() => document.querySelector("canvas")!.toDataURL("image/png"));
    const deadline = Date.now() + TIMEOUT_MS;
    let previous = "";
    let stableReads = 0;

    while (Date.now() < deadline) {
        const current = await readCanvas();
        stableReads = current === previous ? stableReads + 1 : 0;
        if (stableReads >= STABLE_READS_REQUIRED) return current;
        previous = current;
        await page.waitForTimeout(READ_INTERVAL_MS);
    }

    throw new Error("The canvas did not stop changing in time");
}

const cases = [
    ...Object.keys(fixtures).map(fixture => ({ snapshot: fixture, fixture, scale: 1 })),
    ...HIGH_RESOLUTION_FIXTURES.map(fixture => ({ snapshot: `hires-${fixture}`, fixture, scale: 3 })),
];

for (const { snapshot, fixture, scale } of cases) {
    test(snapshot, async ({ page }) => {
        await page.goto(`tests/visual/harness.html?fixture=${fixture}&scale=${scale}`);
        await page.evaluate(() => document.fonts.ready);

        const dataUrl = await readCanvasWhenStable(page);
        const png = Buffer.from(dataUrl.split(",")[1], "base64");

        expect(png).toMatchSnapshot(`${snapshot}.png`, { maxDiffPixels: 0 });
    });
}
