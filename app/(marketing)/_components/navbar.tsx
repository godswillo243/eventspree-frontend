"use client";

import Logo from "@/components/logo";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { MARKETING_NAVBAR_HEIGHT, MOBILE_BREAKPOINT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

const navItems = [
  {
    label: "Browse",
    href: "/browse",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const Navbar = () => {
  const scrolled = useScrollTop(10);

  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const close = () => setIsOpen(false);
    if (!isMobile) close();
  }, [isMobile]);

  useEffect(() => {
    const handleClick = () => {
      if (!isOpen) return;

      setIsOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.addEventListener("click", handleClick);
  }, []);

  return (
    <>
      <nav
        style={{
          height: MARKETING_NAVBAR_HEIGHT,
        }}
        className={cn(
          "fixed inset-x-0 w-full top-0 flex items-center justify-between z-50 bg-white p-6",
          scrolled && "border-b border-neutral-200 shadow-sm",
        )}
      >
        <Link href={"/"}>
          <Logo />
        </Link>
        <div className="sm:flex items-center gap-2 hidden">
          {navItems.map(({ href, label }) => (
            <Link href={href} key={label} className="link-muted button-ghost">
              {label}
            </Link>
          ))}
        </div>
        <div className="hidden sm:flex items-center gap-2">
          {!isAuthenticated ? (
            <Link href={"/auth/signin"} className="button-secondary">
              Sign in
            </Link>
          ) : (
            <div className="avatar">
              <Image
                alt={"avatar"}
                src={user!.avatarUrl ?? "https://placehold.net/avatar.png"}
                width={32}
                height={32}
              />
            </div>
          )}
        </div>
        <div className="flex sm:hidden">
          <button
            className="button-secondary size-10 [&_svg]:size-5 p-0"
            onClick={() => setIsOpen((open) => !open)}
          >
            <MenuIcon />
          </button>
        </div>
      </nav>
      <div
        className={cn(
          "fixed left-1/2 -translate-x-1/2 card h-fit w-[calc(100%-64px)] -z-20 transition-all ease-in duration-300 opacity-0",
          isOpen && "opacity-100 z-51",
        )}
        style={{
          top: MARKETING_NAVBAR_HEIGHT + 8 + "px",
        }}
      >
        <div className="flex flex-col gap-2">
          {navItems.map(({ href, label }) => (
            <Link href={href} key={label} className="link-muted button-ghost">
              {label}
            </Link>
          ))}
          <Link href={"/auth/signin"} className="button-secondary mt-4">
            Sign in
          </Link>
          <Link href={"/auth/signup"} className="button-primary">
            Sign up
          </Link>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed w-full h-full z-50"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
