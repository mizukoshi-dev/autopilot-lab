import type { Todo } from "./todo.js";

export const STORAGE_KEY = "autopilot-lab:todos";

function isTodo(value: unknown): value is Todo {
	if (typeof value !== "object" || value === null) {
		return false;
	}
	const record = value as Record<string, unknown>;
	return (
		typeof record.id === "string" &&
		typeof record.title === "string" &&
		typeof record.completed === "boolean"
	);
}

/** 壊れた JSON や想定外の形のデータは空配列として扱う。 */
export function loadTodos(storage: Pick<Storage, "getItem">): Todo[] {
	try {
		const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? "[]");
		return Array.isArray(parsed) ? parsed.filter(isTodo) : [];
	} catch {
		return [];
	}
}

export function saveTodos(
	storage: Pick<Storage, "setItem">,
	todos: readonly Todo[],
): void {
	try {
		storage.setItem(STORAGE_KEY, JSON.stringify(todos));
	} catch {
		// 容量超過やプライベートモードでは保存を諦める（画面は動かし続ける）
	}
}
