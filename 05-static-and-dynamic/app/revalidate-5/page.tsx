import getTodos from "../lib/Todos";

export const revalidate = 5;

export default async function Dynamic() {
  const todos = await getTodos();
  return <h1>Revalidate 5: {todos.length}</h1>;
}
