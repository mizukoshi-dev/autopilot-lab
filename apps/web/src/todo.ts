export type Filter = "all" | "active" | "completed";

export type Todo = {
	id: string;
	title: string;
	completed: boolean;
};

/** 前後の空白を除いて末尾に追加する。空のタイトルは何も追加しない。 */
export function addTodo(
	todos: readonly Todo[],
	title: string,
	id: string,
): Todo[] {
	const trimmed = title.trim();
	if (trimmed === "") {
		return [...todos];
	}
	return [...todos, { id, title: trimmed, completed: false }];
}

export function toggleTodo(todos: readonly Todo[], id: string): Todo[] {
	return todos.map((todo) =>
		todo.id === id ? { ...todo, completed: !todo.completed } : todo,
	);
}

export function removeTodo(todos: readonly Todo[], id: string): Todo[] {
	return todos.filter((todo) => todo.id !== id);
}

export function filterTodos(todos: readonly Todo[], filter: Filter): Todo[] {
	switch (filter) {
		case "all":
			return [...todos];
		case "active":
			return todos.filter((todo) => !todo.completed);
		case "completed":
			return todos.filter((todo) => todo.completed);
	}
}

export function countActive(todos: readonly Todo[]): number {
	return todos.filter((todo) => !todo.completed).length;
}
