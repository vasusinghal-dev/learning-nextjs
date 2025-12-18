import getTodos, { getTodo, Todo } from "@/app/lib/Todos";

export const revalidate = 60;

export async function generateStaticParams() {
  const todos = await getTodos();

  return todos.map((todo: Todo) => ({
    id: String(todo.id),
  }));
}

export default async function TodoItem({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const todo = await getTodo(id);
  return <h1>Todo: {todo.todo}</h1>;
}
