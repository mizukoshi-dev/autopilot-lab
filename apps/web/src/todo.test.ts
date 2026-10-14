import { describe, expect, it } from "vitest";
import {
	addTodo,
	countActive,
	filterTodos,
	removeTodo,
	type Todo,
	toggleTodo,
} from "./todo.js";

const sample: Todo[] = [
	{ id: "a", title: "牛乳を買う", completed: false },
	{ id: "b", title: "メールを返す", completed: true },
	{ id: "c", title: "散歩する", completed: false },
];

describe("addTodo", () => {
	it("末尾に未完了で追加し、元の配列は変えない", () => {
		const result = addTodo(sample, "掃除", "d");
		expect(result).toHaveLength(4);
		expect(result[3]).toEqual({ id: "d", title: "掃除", completed: false });
		expect(sample).toHaveLength(3);
	});

	it("前後の空白を除く", () => {
		expect(addTodo([], "  掃除  ", "d")[0]?.title).toBe("掃除");
	});

	it("空や空白だけのタイトルは追加しない", () => {
		expect(addTodo(sample, "   ", "d")).toEqual(sample);
	});
});

describe("toggleTodo", () => {
	it("指定した id の完了状態だけを反転する", () => {
		const result = toggleTodo(sample, "a");
		expect(result.map((todo) => todo.completed)).toEqual([true, true, false]);
	});

	it("存在しない id では何も変わらない", () => {
		expect(toggleTodo(sample, "x")).toEqual(sample);
	});
});

describe("removeTodo", () => {
	it("指定した id を取り除く", () => {
		expect(removeTodo(sample, "b").map((todo) => todo.id)).toEqual(["a", "c"]);
	});
});

describe("filterTodos", () => {
	it("all は全件", () => {
		expect(filterTodos(sample, "all")).toHaveLength(3);
	});

	it("active は未完了だけ", () => {
		expect(filterTodos(sample, "active").map((todo) => todo.id)).toEqual([
			"a",
			"c",
		]);
	});

	it("completed は完了だけ", () => {
		expect(filterTodos(sample, "completed").map((todo) => todo.id)).toEqual([
			"b",
		]);
	});
});

describe("countActive", () => {
	it("未完了の件数を数える", () => {
		expect(countActive(sample)).toBe(2);
		expect(countActive([])).toBe(0);
	});
});
