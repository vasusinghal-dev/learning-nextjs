export default async function TodoItem({
  param,
}: {
  param: Promise<{ id: string }>;
}) {
  const { id } = await param;
  return <h1>{id}</h1>;
}
