import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h2>Todo not found</h2>
      <Link href="/">Go to Home</Link>
    </>
  );
}
