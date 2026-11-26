"use client";
import { ArrowRight, SearchIcon } from "lucide-react";
import Link from "next/link";

const Heading = () => {
  return (
    <section className=" relative layout-container w-full h-auto aspect-12/4 min-h-128 flex items-center justify-center ">
      <div className="z-10 relative w-full flex flex-col items-center justify-center gap-6">
        <h1 className="heading-1 text-center">Plan Your Event, End to End.</h1>
        <p className="prose-body font-medium text-center">
          Find vendors and venues for your next event.
        </p>
        <div className="rounded-full bg-neutral-0 border border-neutral-200 h-14 pl-4 flex items-center gap-2 w-full max-w-lg">
          <input
            className="outline-0 bg-transparent flex-1 text-body placeholder:text-neutral-400"
            placeholder="Search by city or category."
          />
          <button className="button-ghost [&_svg]:size-6 rounded-full flex items-center justify-center size-12 p-0 h-auto aspect-square  ">
            <SearchIcon className="text-neutral-600" />
          </button>
        </div>
        <div className="w-full flex items-center justify-center gap-2">
          <Link href="/signup" className="button-primary">
            Start Planning <ArrowRight />
          </Link>
          <Link href="/list-your-business" className="button-secondary">
            List Your Business
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Heading;
