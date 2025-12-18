import { cache } from "react";

export type Todo = {
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

export const getTodo = async (id: string | number): Promise<Todo> => {
  await wait(2000);
  console.log(`Todo ${id} Fetched`);
  const res = await fetch(`https://dummyjson.com/todos/${id}`);
  const data: Todo = await res.json();
  return data;
};

export default getTodos;

async function wait(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, duration);
  });
}
