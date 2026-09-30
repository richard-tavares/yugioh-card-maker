import { defineConfig, devices } from "@playwright/test";

const PORT = 5199;

export default defineConfig({
    testDir: "tests",
    fullyParallel: true,
    reporter: [["list"], ["html", { open: "never" }]],
    snapshotPathTemplate: "tests/visual/__snapshots__/{arg}{ext}",
    use: {
        baseURL: `http://localhost:${PORT}/yugioh-card-maker/`,
        ...devices["Desktop Chrome"],
    },
    webServer: {
        command: `npm run dev -- --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}/yugioh-card-maker/`,
        reuseExistingServer: true,
    },
});
