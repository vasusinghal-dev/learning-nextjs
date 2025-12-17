import getTodos from "../lib/Todos";
import Child from "./Child";
import TodoItem from "./TodoItem";

export default async function TodosList() {
  console.log("TodosList");
  const todos = await getTodos();

  return (
    <>
      {" "}
      <p>Total Todos: {todos.length}</p>
      <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
        {todos.slice(0, 2).map((todo) => (
          <TodoItem key={todo.id} todo={todo}>
            <Child />
          </TodoItem>
        ))}
      </ul>
    </>
  );
}
