import UseParams from "@/app/components/UseParams";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Todo ${id}`,
    description: `Details for todo ${id}`,
  };
}

type Todo = {
  completed: boolean;
  id: number;
  todo: string;
  userId: number;
};

async function getTodo(id: string): Promise<Todo> {
  const res = await fetch(`https://dummyjson.com/todos/${id}`);
  if (!res.ok) {
    notFound();
  }
  const data: Todo = await res.json();
  return data;
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const todo = await getTodo(id);

  return (
    <>
      <UseParams />
      <p>{todo.todo}</p>
      <div>{todo.completed ? "Finished" : "Not Finished"}</div>
    </>
  );
};

export default Page;
