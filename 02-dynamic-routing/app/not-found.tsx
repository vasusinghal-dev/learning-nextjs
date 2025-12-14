import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h2>Page not found</h2>
      <Link href="/">Go to Home</Link>
    </>
  );
}
