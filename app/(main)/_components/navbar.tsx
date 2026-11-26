import Link from "next/link";

import Logo from "@/components/logo";
import { MAIN_NAVBAR_HEIGHT } from "@/lib/constants";
import UserButton from "./user-button";

const Navbar = () => {
  return (
    <nav
      className="flex items-center justify-center gap-4 px-6 fixed inset-x-0 w-full top-0 bg-neutral-0 "
      style={{
        height: `${MAIN_NAVBAR_HEIGHT}px`,
      }}
    >
      <Link href={"/home"} className="mr-auto">
        <Logo />
      </Link>
      <UserButton />
    </nav>
  );
};

export default Navbar;
