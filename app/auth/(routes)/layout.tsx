import Logo from "@/components/logo";
import Link from "next/link";
import React, { Suspense } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="p-6 w-full flex items-center gap-2">
        <Link href={"/"} className="">
          <Logo />
        </Link>
      </div>
      <div className="w-full p-6 flex items-center justify-center">
        <Suspense>{children}</Suspense>
      </div>
    </div>
  );
};

export default AuthLayout;
