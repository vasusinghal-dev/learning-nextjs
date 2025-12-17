import getTodos from "../lib/Todos";

export const revalidate = 0;

export default async function Dynamic() {
  const todos = await getTodos();
  return <h1>Revalidate 0: {todos.length}</h1>;
}
