import { type FormEvent, useEffect, useState } from "react";
import { loadTodos, saveTodos } from "./storage.js";
import {
	addTodo,
	countActive,
	type Filter,
	filterTodos,
	removeTodo,
	type Todo,
	toggleTodo,
} from "./todo.js";

const FILTERS: { value: Filter; label: string }[] = [
	{ value: "all", label: "全部" },
	{ value: "active", label: "未完了" },
	{ value: "completed", label: "完了" },
];

export function App() {
	const [todos, setTodos] = useState<Todo[]>(() =>
		loadTodos(window.localStorage),
	);
	const [filter, setFilter] = useState<Filter>("all");
	const [title, setTitle] = useState("");

	useEffect(() => {
		saveTodos(window.localStorage, todos);
	}, [todos]);

	const visible = filterTodos(todos, filter);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const id = crypto.randomUUID();
		setTodos((current) => addTodo(current, title, id));
		setTitle("");
	}

	function handleToggle(id: string) {
		setTodos((current) => toggleTodo(current, id));
	}

	function handleRemove(id: string) {
		setTodos((current) => removeTodo(current, id));
	}

	return (
		<main className="app">
			<h1>ToDo</h1>

			<form className="new-todo" onSubmit={handleSubmit}>
				<label htmlFor="new-todo">新しいタスク</label>
				<input
					id="new-todo"
					type="text"
					value={title}
					onChange={(event) => setTitle(event.target.value)}
				/>
				<button type="submit">追加</button>
			</form>

			<fieldset className="filters" aria-label="絞り込み">
				{FILTERS.map(({ value, label }) => (
					<button
						key={value}
						type="button"
						aria-pressed={filter === value}
						onClick={() => setFilter(value)}
					>
						{label}
					</button>
				))}
			</fieldset>

			{visible.length === 0 ? (
				<p className="empty">タスクがありません</p>
			) : (
				<ul aria-label="タスク一覧">
					{visible.map((todo) => (
						<li key={todo.id}>
							<label>
								<input
									type="checkbox"
									checked={todo.completed}
									onChange={() => handleToggle(todo.id)}
								/>
								<span className={todo.completed ? "done" : undefined}>
									{todo.title}
								</span>
							</label>
							<button
								type="button"
								aria-label={`${todo.title} を削除`}
								onClick={() => handleRemove(todo.id)}
							>
								削除
							</button>
						</li>
					))}
				</ul>
			)}

			<p className="remaining" aria-live="polite">
				残り {countActive(todos)} 件
			</p>
		</main>
	);
}
