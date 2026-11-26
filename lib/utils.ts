export { cn } from "cn";

export const getAvaterFromInitials = (initials: string) =>
  `https://api.dicebear.com/11.x/initials/png?seed=${initials}`;
