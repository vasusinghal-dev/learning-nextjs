const page = async ({ params }: { params: Promise<{ id: string[] }> }) => {
  const { id } = await params;
  return (
    <div>
      <h1>Hey this is an example</h1>
      <div>{id.join(", ")}</div>
    </div>
  );
};
export default page;
