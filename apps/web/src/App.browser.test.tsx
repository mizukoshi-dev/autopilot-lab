import { beforeEach, describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { App } from "./App.js";
import { STORAGE_KEY } from "./storage.js";

async function addTodo(
	screen: Awaited<ReturnType<typeof render>>,
	title: string,
) {
	await screen.getByLabelText("新しいタスク").fill(title);
	await screen.getByRole("button", { name: "追加" }).click();
}

describe("App（実ブラウザ）", () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	it("最初はタスクがない", async () => {
		const screen = await render(<App />);
		await expect.element(screen.getByText("タスクがありません")).toBeVisible();
		await expect.element(screen.getByText("残り 0 件")).toBeVisible();
	});

	it("タスクを追加すると一覧に出て、入力欄が空になる", async () => {
		const screen = await render(<App />);
		await addTodo(screen, "牛乳を買う");
		await expect
			.element(screen.getByRole("checkbox", { name: "牛乳を買う" }))
			.toBeVisible();
		await expect.element(screen.getByLabelText("新しいタスク")).toHaveValue("");
		await expect.element(screen.getByText("残り 1 件")).toBeVisible();
	});

	it("空のタスクは追加されない", async () => {
		const screen = await render(<App />);
		await addTodo(screen, "   ");
		await expect.element(screen.getByText("タスクがありません")).toBeVisible();
	});

	it("チェックすると完了になり残り件数が減る", async () => {
		const screen = await render(<App />);
		await addTodo(screen, "牛乳を買う");
		await screen.getByRole("checkbox", { name: "牛乳を買う" }).click();
		await expect
			.element(screen.getByRole("checkbox", { name: "牛乳を買う" }))
			.toBeChecked();
		await expect.element(screen.getByText("残り 0 件")).toBeVisible();
	});

	it("絞り込みで表示が切り替わる", async () => {
		const screen = await render(<App />);
		await addTodo(screen, "牛乳を買う");
		await addTodo(screen, "散歩する");
		await screen.getByRole("checkbox", { name: "牛乳を買う" }).click();

		await screen.getByRole("button", { name: "完了", exact: true }).click();
		await expect
			.element(screen.getByRole("checkbox", { name: "牛乳を買う" }))
			.toBeVisible();
		await expect
			.element(screen.getByRole("checkbox", { name: "散歩する" }))
			.not.toBeInTheDocument();

		await screen.getByRole("button", { name: "未完了", exact: true }).click();
		await expect
			.element(screen.getByRole("checkbox", { name: "散歩する" }))
			.toBeVisible();
		await expect
			.element(screen.getByRole("checkbox", { name: "牛乳を買う" }))
			.not.toBeInTheDocument();
	});

	it("削除すると一覧から消える", async () => {
		const screen = await render(<App />);
		await addTodo(screen, "牛乳を買う");
		await screen.getByRole("button", { name: "牛乳を買う を削除" }).click();
		await expect
			.element(screen.getByRole("checkbox", { name: "牛乳を買う" }))
			.not.toBeInTheDocument();
	});

	it("変更が localStorage に保存される", async () => {
		const screen = await render(<App />);
		await addTodo(screen, "牛乳を買う");
		await expect
			.poll(() => window.localStorage.getItem(STORAGE_KEY))
			.toContain("牛乳を買う");
	});
});
