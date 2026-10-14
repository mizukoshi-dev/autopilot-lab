import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI);
const baseURL = "http://127.0.0.1:4173";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 2 : 0,
	reporter: isCI
		? [["html", { open: "never" }], ["github"]]
		: [["list"], ["html", { open: "never" }]],
	expect: {
		toHaveScreenshot: { animations: "disabled" },
	},
	use: {
		baseURL,
		trace: "on-first-retry",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	// dev サーバーではなく本番ビルドを配信して試験する
	webServer: {
		command: "pnpm exec vite build && pnpm exec vite preview",
		url: baseURL,
		reuseExistingServer: !isCI,
		timeout: 120_000,
	},
});
