import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// .claude/ 配下の worktree のテストを拾わない
		exclude: [...configDefaults.exclude, ".claude/**"],
	},
});
