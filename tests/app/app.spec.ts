import { test, expect, type Page } from "@playwright/test";
import { STRINGS } from "../../src/constants/strings";

const { form, app, capacity, linkArrows } = STRINGS;

const LONG_TEXT = "Once per turn, when a card or effect is activated that includes an effect that destroys a card on the field: you can negate the activation and, if you do, destroy that card. ".repeat(12);

const frameField = (page: Page) => page.getByLabel(form.frame);
const effectField = (page: Page) => page.getByLabel(form.effect, { exact: true });
const downloadButton = (page: Page) => page.getByRole("button", { name: app.download });

function readCanvasAlpha(page: Page, relativeX: number, relativeY: number) {
    return page.evaluate(([x, y]) => {
        const canvas = document.querySelector("canvas")!;
        return canvas.getContext("2d")!.getImageData(canvas.width * x, canvas.height * y, 1, 1).data[3];
    }, [relativeX, relativeY]);
}

test.beforeEach(async ({ page }) => {
    await page.goto("./");
});

test("download is disabled until a frame is chosen", async ({ page }) => {
    await expect(downloadButton(page)).toBeDisabled();
});

test("download produces a high resolution PNG named after the card", async ({ page }) => {
    await frameField(page).selectOption("effect");
    await page.getByLabel(form.name).fill("Blue-Eyes White Dragon");

    const downloadPromise = page.waitForEvent("download");
    await downloadButton(page).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe("blue-eyes-white-dragon.png");

    const chunks: Buffer[] = [];
    for await (const chunk of await download.createReadStream()) chunks.push(chunk as Buffer);
    const png = Buffer.concat(chunks);
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    expect([width, height]).toEqual([1260, 1830]);
});

test("switching a Pendulum monster to Spell or Token turns Pendulum off and keeps the card drawn", async ({ page }) => {
    const pendulumField = page.getByLabel(form.pendulum);
    await frameField(page).selectOption("effect");
    await pendulumField.selectOption("yes");
    await expect(page.getByLabel(form.pendulumEffect)).toBeVisible();

    for (const frame of ["spell", "token"]) {
        await frameField(page).selectOption(frame);
        await expect(pendulumField).toHaveValue("no");
        await expect(pendulumField).toBeDisabled();
        await expect(page.getByLabel(form.pendulumEffect)).toHaveCount(0);
        await expect.poll(() => readCanvasAlpha(page, 0.5, 0.05)).toBe(255);

        await frameField(page).selectOption("effect");
        await pendulumField.selectOption("yes");
    }
});

test("a Spell uses its own type as attribute and monsters get the attribute field back", async ({ page }) => {
    const attributeField = page.getByLabel(form.attribute);

    await frameField(page).selectOption("spell");
    await expect(attributeField).toHaveValue("spell");
    await expect(attributeField).toBeDisabled();
    await expect(page.getByLabel(form.spellType)).toHaveValue("normal");

    await frameField(page).selectOption("effect");
    await expect(attributeField).toHaveValue("");
    await expect(attributeField).toBeEnabled();
});

test("the card ends face up even when the frame changes during the flip", async ({ page }) => {
    const card = page.locator(".card-inner");
    await frameField(page).selectOption("effect");
    await expect(card).toHaveClass(/flipped/);

    await frameField(page).selectOption("");
    await frameField(page).selectOption("fusion");
    await page.waitForTimeout(900);
    await expect(card).toHaveClass(/flipped/);
});

test("Link Rating follows the number of Link Arrows", async ({ page }) => {
    const linkRatingField = page.getByLabel(form.linkRating);
    const arrowButton = (label: string) => page.getByLabel(label, { exact: true }).locator("..");
    const topArrow = arrowButton(linkArrows.top);

    await frameField(page).selectOption("link");
    await expect(linkRatingField).toHaveValue("");

    await topArrow.click();
    await arrowButton(linkArrows["bottom-left"]).click();
    await expect(linkRatingField).toHaveValue("2");

    await topArrow.click();
    await expect(linkRatingField).toHaveValue("1");
});

test("ATK and DEF accept numbers up to 9999 and the undefined value '?'", async ({ page }) => {
    const atkField = page.getByLabel(form.atk);
    const defField = page.getByLabel(form.def);

    await frameField(page).selectOption("effect");
    await atkField.fill("3000");
    await expect(atkField).toHaveValue("3000");
    await atkField.fill("abc");
    await expect(atkField).toHaveValue("");
    await defField.fill("?");
    await expect(defField).toHaveValue("?");
});

test("the effect field stops accepting text when the card box is full", async ({ page }) => {
    await frameField(page).selectOption("effect");
    const effect = effectField(page);

    await effect.fill(LONG_TEXT);
    const pasted = await effect.inputValue();

    expect(pasted.length).toBeGreaterThan(600);
    expect(pasted.length).toBeLessThan(LONG_TEXT.length);
    expect(LONG_TEXT.startsWith(pasted)).toBe(true);
    expect(LONG_TEXT[pasted.length]).toBe(" ");
    await expect(page.getByText(capacity.trimmed)).toBeVisible();

    const typed = " a few more typed words until the card box is completely full";
    await effect.press("Control+End");
    await effect.pressSequentially(typed);
    const full = await effect.inputValue();

    expect(full.length).toBeLessThan(pasted.length + typed.length);
    expect(full.startsWith(pasted)).toBe(true);
    await expect(page.getByText(capacity.full)).toBeVisible();
    await expect(page.getByText(capacity.overflow)).toHaveCount(0);

    await effect.press("Backspace");
    expect(await effect.inputValue()).toBe(full.slice(0, -1));
});

test("a Spell holds more text than a monster and warns when the new frame cannot hold it", async ({ page }) => {
    await frameField(page).selectOption("spell");
    const effect = effectField(page);
    await effect.fill(LONG_TEXT);
    const spellTextLength = (await effect.inputValue()).length;
    expect(spellTextLength).toBeGreaterThan(1200);

    await frameField(page).selectOption("effect");
    await expect(page.getByText(capacity.overflow)).toBeVisible();
    expect(await effect.inputValue()).toHaveLength(spellTextLength);
});

test("uploaded art shows on the card, can be replaced and is included in the download", async ({ page }) => {
    const artWindowAlpha = () => readCanvasAlpha(page, 0.5, 0.45);
    await frameField(page).selectOption("effect");
    await expect.poll(artWindowAlpha).toBe(0);

    await page.locator("#art").setInputFiles("public/images/android-chrome-512x512.png");
    await expect.poll(artWindowAlpha).toBe(255);

    await page.locator("#art").setInputFiles("public/images/android-chrome-192x192.png");
    await page.getByLabel(form.name).fill("Card with art");
    await expect.poll(artWindowAlpha).toBe(255);

    const downloadPromise = page.waitForEvent("download");
    await downloadButton(page).click();
    expect((await downloadPromise).suggestedFilename()).toBe("card-with-art.png");
});
