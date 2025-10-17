import { ZodError } from "zod";

export function formatZodMessage(error: ZodError): string {
  return error.issues
    .map((e) => `${e.path.join(".")}: ${e.message}`)
    .join(", ");
}
