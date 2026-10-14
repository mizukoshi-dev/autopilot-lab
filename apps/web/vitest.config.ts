import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

// 単体（Node）とコンポーネント（実ブラウザ）を projects で分ける。
// e2e/ は Playwright Test の管轄なので include に含めない。
export default defineConfig({
	plugins: [react()],
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: "unit",
					environment: "node",
					include: ["src/**/*.test.ts"],
				},
			},
			{
				extends: true,
				test: {
					name: "browser",
					include: ["src/**/*.browser.test.tsx"],
					browser: {
						enabled: true,
						headless: true,
						provider: playwright(),
						instances: [{ browser: "chromium" }],
					},
				},
			},
		],
	},
});
