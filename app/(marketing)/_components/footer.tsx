import Logo from "@/components/logo";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const year = new Date().getFullYear().toString();

const Footer = () => {
  return (
    <footer className="w-full py-8 px-6 layout-container mx-auto">
      <div className="flex flex-col md:flex-row md:justify-evenly gap-6 w-full">
        <div className="space-y-2 max-w-sm w-full">
          <Logo />
          <p className="prose-body">
            Connecting event organizers with trusted vendors and venues — from
            inquiry to booking, all in one place.
          </p>
        </div>
        <div className="max-w-sm ">
          <h4 className="heading-3">Contact us</h4>
          <div className="flex items-center gap-2 prose-body mt-2">
            <span className="font-semibold text-neutral-800">Email:</span>
            <p>hello@eventspree.ng</p>
          </div>
          <div className="flex items-center gap-2 prose-body">
            <span className="font-semibold text-neutral-800">Tel:</span>
            <p>+234 903 298 0552</p>
          </div>
        </div>
        <div className="max-w-sm">
          <h4 className="heading-3">Socials</h4>
          <div className="flex items-center gap-4 flex-wrap mt-2">
            <Link href={"https://x.com/eventspree_ng"} target="_blank">
              <div className="flex items-center gap-1.5 link-muted hover:font-medium transition-all duration-300">
                <p>X @eventspree_ng</p>
                <ArrowUpRight className="size-4" />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-4 p-6 flex items-center gap-4 border-t border-neutral-200 ">
        <p className="prose-default mr-auto">
          © {year} Eventspree. All rights reserved.
        </p>
        <Link href={"/privacy"} className="prose-default">
          Privacy Policy
        </Link>
        <Link href={"/terms"} className="prose-default">
          Terms of Service
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
