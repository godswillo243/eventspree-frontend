import { cn } from "@/lib/utils";

type SpinnerProps = { size?: "sm" | "md" | "lg" };

const Spinner = ({ size = "md" }: SpinnerProps) => {
  return (
    <div
      className={cn(
        "spinner",
        size === "sm" && "spinner-sm",
        size === "md" && "spinner-md",
        size === "lg" && "spinner-lg",
      )}
    />
  );
};

export default Spinner;
