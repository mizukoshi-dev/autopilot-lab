import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI);
const allBrowsers = process.env.PW_ALL_BROWSERS === "1";
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
	// 既定は chromium のみ。PW_ALL_BROWSERS=1（夜間ジョブ）のときだけ firefox・webkit・iPhone も回す
	projects: [
		{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
		...(allBrowsers
			? [
					{ name: "firefox", use: { ...devices["Desktop Firefox"] } },
					{ name: "webkit", use: { ...devices["Desktop Safari"] } },
					{ name: "mobile-safari", use: { ...devices["iPhone 15"] } },
				]
			: []),
	],
	// dev サーバーではなく本番ビルドを配信して試験する
	webServer: {
		command: "pnpm exec vite build && pnpm exec vite preview",
		url: baseURL,
		reuseExistingServer: !isCI,
		timeout: 120_000,
	},
});
