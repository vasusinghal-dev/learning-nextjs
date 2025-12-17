"use client";
import Link from "next/link";
import { Todo } from "../lib/Todos";
import { ReactNode } from "react";

export default function TodoItem({
  todo,
  children,
}: {
  todo: Todo;
  children: ReactNode;
}) {
  console.log("TodoItem");
  return (
    <>
      <li
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
      {children}
    </>
  );
}
