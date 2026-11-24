import { cn } from "@/lib/utils";
import { Calendar1Icon } from "lucide-react";
import { cva } from "class-variance-authority";

const variants = cva("");

const Logo = () => {
  return (
    <div className="flex items-center gap-1.5 text-primary-600 w-fit">
      <Calendar1Icon className="font size-5" />
      <p className={cn("font-semibold text-lg")}>Eventspree</p>
    </div>
  );
};

export default Logo;
