import { defineConfig } from "vitest/config";

// Stryker 専用: 単体（Node）だけを回す。
// vitest.config.ts の browser プロジェクト（Chromium 必須・遅い）を巻き込まないため分けている
export default defineConfig({
	test: {
		name: "unit",
		environment: "node",
		include: ["src/**/*.test.ts"],
	},
});
