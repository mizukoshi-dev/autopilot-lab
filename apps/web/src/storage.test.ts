import { describe, expect, it } from "vitest";
import { loadTodos, STORAGE_KEY, saveTodos } from "./storage.js";
import type { Todo } from "./todo.js";

function fakeStorage(initial?: string) {
	const data = new Map<string, string>();
	if (initial !== undefined) {
		data.set(STORAGE_KEY, initial);
	}
	return {
		data,
		getItem: (key: string) => data.get(key) ?? null,
		setItem: (key: string, value: string) => {
			data.set(key, value);
		},
	};
}

describe("storage", () => {
	it("保存したものをそのまま読み戻せる", () => {
		const todos: Todo[] = [{ id: "a", title: "牛乳", completed: true }];
		const storage = fakeStorage();
		saveTodos(storage, todos);
		expect(loadTodos(storage)).toEqual(todos);
	});

	it("何も保存されていなければ空配列", () => {
		expect(loadTodos(fakeStorage())).toEqual([]);
	});

	it("壊れた JSON は空配列", () => {
		expect(loadTodos(fakeStorage("{not json"))).toEqual([]);
	});

	it("配列でない JSON は空配列", () => {
		expect(loadTodos(fakeStorage('{"id":"a"}'))).toEqual([]);
	});

	it("形の合わない要素だけを捨てる", () => {
		const raw = JSON.stringify([
			{ id: "a", title: "ok", completed: false },
			{ id: 1, title: "bad", completed: false },
			null,
		]);
		expect(loadTodos(fakeStorage(raw))).toEqual([
			{ id: "a", title: "ok", completed: false },
		]);
	});

	it("書き込みに失敗しても例外を投げない", () => {
		const failing = {
			setItem: () => {
				throw new Error("QuotaExceededError");
			},
		};
		expect(() => saveTodos(failing, [])).not.toThrow();
	});
});
