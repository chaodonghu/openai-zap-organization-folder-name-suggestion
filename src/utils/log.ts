import { env } from "@/env.mjs";

export function log(...args: unknown[]) {
  if (env.NODE_ENV !== "test") console.log(...args);
}
