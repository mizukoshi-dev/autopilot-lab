import { expect, type Page, test } from "@playwright/test";

async function addTodo(page: Page, title: string) {
	await page.getByLabel("新しいタスク").fill(title);
	await page.getByRole("button", { name: "追加" }).click();
}

test.beforeEach(async ({ page }) => {
	await page.goto("/");
});

test("タスクを追加すると一覧と残り件数に反映される", async ({ page }) => {
	await addTodo(page, "牛乳を買う");
	await addTodo(page, "散歩する");

	await expect(
		page.getByRole("checkbox", { name: "牛乳を買う" }),
	).toBeVisible();
	await expect(page.getByRole("checkbox", { name: "散歩する" })).toBeVisible();
	await expect(page.getByText("残り 2 件")).toBeVisible();
});

test("完了にして「完了」で絞り込める", async ({ page }) => {
	await addTodo(page, "牛乳を買う");
	await addTodo(page, "散歩する");
	await page.getByRole("checkbox", { name: "牛乳を買う" }).check();
	await expect(page.getByText("残り 1 件")).toBeVisible();

	await page.getByRole("button", { name: "完了", exact: true }).click();
	await expect(
		page.getByRole("checkbox", { name: "牛乳を買う" }),
	).toBeVisible();
	await expect(page.getByRole("checkbox", { name: "散歩する" })).toHaveCount(0);

	await page.getByRole("button", { name: "未完了", exact: true }).click();
	await expect(page.getByRole("checkbox", { name: "散歩する" })).toBeVisible();
	await expect(page.getByRole("checkbox", { name: "牛乳を買う" })).toHaveCount(
		0,
	);
});

test("削除すると一覧から消える", async ({ page }) => {
	await addTodo(page, "牛乳を買う");
	await page.getByRole("button", { name: "牛乳を買う を削除" }).click();

	await expect(page.getByRole("checkbox", { name: "牛乳を買う" })).toHaveCount(
		0,
	);
	await expect(page.getByText("タスクがありません")).toBeVisible();
});

test("再読み込みしてもタスクと完了状態が残る", async ({ page }) => {
	await addTodo(page, "牛乳を買う");
	await page.getByRole("checkbox", { name: "牛乳を買う" }).check();

	await page.reload();

	await expect(
		page.getByRole("checkbox", { name: "牛乳を買う" }),
	).toBeChecked();
	await expect(page.getByText("残り 0 件")).toBeVisible();
});

// 基準画像は公式 Docker イメージで撮る（apps/web/README.md 参照）
test("見た目: タスク一覧", async ({ page }) => {
	await addTodo(page, "牛乳を買う");
	await addTodo(page, "メールを返す");
	await addTodo(page, "散歩する");
	await page.getByRole("checkbox", { name: "メールを返す" }).check();
	// フォーカスリングが写り込まないようにする
	await page.evaluate(() => {
		(document.activeElement as HTMLElement | null)?.blur();
	});

	await expect(page.getByRole("main")).toHaveScreenshot("todo-list.png");
});
