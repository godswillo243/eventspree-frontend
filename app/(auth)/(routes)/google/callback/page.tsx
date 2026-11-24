"use client";

import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("accessToken");

  console.log(token);

  return <div>Page</div>;
};

export default Page;
