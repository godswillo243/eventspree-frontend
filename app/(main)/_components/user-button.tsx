"use client";

import { MAIN_NAVBAR_HEIGHT } from "@/lib/constants";
import SignoutButton from "./signout-button";
import { useUser } from "@/components/providers/auth";
import { useBoolean } from "usehooks-ts";
import { useEffect } from "react";
import Image from "next/image";
import { cn, getAvaterFromInitials } from "@/lib/utils";

const UserButton = () => {
  const user = useUser()!;

  const {
    value: isOpen,
    setFalse: close,
    setTrue: open,
    toggle,
  } = useBoolean();

  useEffect(() => {
    const handleClick = () => {
      console.log("clicked");
      if (!isOpen) return;

      close();
    };
    document.addEventListener("click", handleClick);
    return () => document.addEventListener("click", handleClick);
  }, [close]);

  return (
    <>
      <div role="button" onClick={toggle} className="avatar-md cursor-pointer">
        <Image
          alt={"user image"}
          src={user?.avatarUrl || getAvaterFromInitials(user.name)}
          width={48}
          height={48}
        />
      </div>
      <div
        className={cn(
          "fixed right-4 card h-fit w-60 -z-20 transition-all ease-in duration-10 opacity-0",
          isOpen && "opacity-100 z-51",
        )}
        style={{
          top: MAIN_NAVBAR_HEIGHT + 8 + "px",
        }}
      >
        <div className="flex flex-col gap-2">
          <button className="button-ghost ">Profile</button>
          <SignoutButton />
        </div>
      </div>
    </>
  );
};

export default UserButton;
