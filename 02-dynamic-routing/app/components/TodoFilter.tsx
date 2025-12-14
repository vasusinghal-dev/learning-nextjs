"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TodoFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const completed = searchParams.get("completed");

  function setFilter(value: "true" | "false" | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (completed === value) return;

    if (value === null) {
      params.delete("completed");
    } else {
      params.set("completed", value);
    }

    router.push(`/?${params.toString()}`);
  }

  return (
    <div style={{ marginBottom: "1rem" }}>
      <button onClick={() => setFilter(null)}>All</button>{" "}
      <button onClick={() => setFilter("true")}>Completed</button>{" "}
      <button onClick={() => setFilter("false")}>Pending</button>
    </div>
  );
}
