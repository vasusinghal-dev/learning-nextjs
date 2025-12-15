import Link from "next/link";
import { cache, Suspense } from "react";

type Todo = {
  completed: boolean;
  id: number;
  todo: string;
  userId: number;
};

type TodosResponse = {
  todos: Todo[];
};

const getTodos = cache(async (): Promise<Todo[]> => {
  await wait(2000);
  console.log("Todos Fetched");
  const res = await fetch("https://dummyjson.com/todos");
  const data: TodosResponse = await res.json();
  return data.todos;
});

export default async function Home() {
  return (
    <div className="container">
      <h1>Todos</h1>
      <Suspense fallback={<p>Loading todos...</p>}>
        <TodosList />
      </Suspense>
    </div>
  );
}

async function TodosList() {
  const todos = await getTodos();
  const todos1 = await getTodos();
  const todos2 = await getTodos();
  const todos3 = await getTodos();

  return (
    <>
      {" "}
      <p>Total Todos: {todos.length}</p>
      <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
        {todos.map((todo) => (
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
