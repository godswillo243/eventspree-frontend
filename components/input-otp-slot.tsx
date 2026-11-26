import * as React from "react";
import type { SlotProps } from "input-otp";

import { cn } from "@/lib/utils";

/**
 * The slot: one visible cell of the field.
 *
 * `input-otp` never renders this — it hands you `char`, `placeholderChar`,
 * `isActive` and `hasFakeCaret` and gets out of the way. Everything below is
 * plain markup you own.
 */
export function Slot({
  char,
  placeholderChar,
  isActive,
  hasFakeCaret,
  className,
}: SlotProps & { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex size-12! p-0! items-center justify-center",
        "input  text-xl",
        // The group-* hooks come from `containerClassName="group …"`.
        isActive && "z-10 border-neutral-600 border-2 shadow-sm",
        className,
      )}
    >
      {/* Placeholder characters are dimmed via a data attribute the library
          sets on the real input while the value is empty — no JS needed. */}
      <div className="group-has-[input[data-input-otp-placeholder-shown]]:text-muted-foreground/40">
        {char ?? placeholderChar}
      </div>

      {hasFakeCaret && <FakeCaret />}
    </div>
  );
}

/** The blinking bar. The real caret is transparent, so we draw our own. */
export function FakeCaret() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="h-5 w-px bg-neutral-800 animate-caret-blink" />
    </div>
  );
}

/** Stripe-style dash between two groups of slots. */
export function FakeDash() {
  return (
    <div aria-hidden className="flex w-10 items-center justify-center">
      <div className="h-1 w-3 rounded-full bg-border" />
    </div>
  );
}

export function SlotGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex", className)}>{children}</div>;
}
