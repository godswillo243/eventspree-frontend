"use client";

import Spinner from "@/components/spinner";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { setUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    authService.getAuthUser().then(({ user }) => {
      setUser(user);
      router.push("/home");
    });
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
};

export default Page;
