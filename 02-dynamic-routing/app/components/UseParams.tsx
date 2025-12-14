"use client";
import { useParams } from "next/navigation";

const UseParams = () => {
  const param = useParams<{ id: string }>();
  return <h1>Todo: {param.id}</h1>;
};
export default UseParams;
