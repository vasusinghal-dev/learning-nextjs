import Link from "next/link";
import { Suspense } from "react";
import TodoFilter from "./components/TodoFilter";

type Todo = {
  completed: boolean;
  id: number;
  todo: string;
  userId: number;
};

type TodosResponse = {
  todos: Todo[];
};

async function getTodos(): Promise<Todo[]> {
  await wait(2000);
  const res = await fetch("https://dummyjson.com/todos");
  const data: TodosResponse = await res.json();
  return data.todos;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ completed?: string }>;
}) {
  const { completed } = await searchParams;

  return (
    <>
      <h1>Todos</h1>
      <TodoFilter />

      <Suspense key={completed} fallback={<p>Loading todos...</p>}>
        <TodosList completed={completed} />
      </Suspense>
    </>
  );
}

async function TodosList({ completed }: { completed?: string }) {
  const todos = await getTodos();

  const filteredTodos =
    completed === "true"
      ? todos.filter((t) => t.completed)
      : completed === "false"
      ? todos.filter((t) => !t.completed)
      : todos;

  return (
    <>
      {" "}
      <p>Total Todos: {todos.length}</p>
      <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "list-item",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "800px",
              }}
            >
              <Link href={`/todos/${todo.id}`} style={{ flex: 1 }}>
                <span>{todo.todo}</span>
              </Link>

              <span
                style={{
                  width: "150px",
                  textAlign: "left",
                }}
              >
                {todo.completed ? "Finished" : "Not Finished"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

async function wait(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, duration);
  });
}
