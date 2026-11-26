import { useState } from "react";

type TStatus = "idle" | "pending" | "done" | "error";

export const useStatus = (status: TStatus = "idle") => {
  return useState<TStatus>(status);
};
