import Link from "next/link";
import React from "react";

const Banner = () => {
  return (
    <div className="bg-primary-600 flex items-center justify-center flex-col gap-2 p-6 py-8 ">
      <h1 className="heading-1 text-neutral-0">
        Are you a vendor or venue owner?
      </h1>
      <p className="prose-body text-neutral-50">
        Join as a service provider to list your business, receive inquiries, and
        get booked for events.
      </p>
      <Link href={"/signup?for=business"} className="button-secondary mt-4">
        List your business
      </Link>
    </div>
  );
};

export default Banner;
