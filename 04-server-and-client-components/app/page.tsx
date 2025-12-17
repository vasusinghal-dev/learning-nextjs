import { Suspense } from "react";
import TodosList from "./components/TodoList";

export default async function Home() {
  console.log("Home");
  return (
    <div className="container">
      <h1>Todos</h1>
      <Suspense fallback={<p>Loading todos...</p>}>
        <TodosList />
      </Suspense>
    </div>
  );
}
