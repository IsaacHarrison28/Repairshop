import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import type { NeonDbError } from "@neondatabase/serverless";

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },

  handleServerError(e, utils) {
    const { clientInput, metadata } = utils;

    // Capture full error context in Sentry
    Sentry.captureException(e, (scope) => {
      scope.clear();
      scope.setContext("serverError", {
        message: e.message,
        name: e.name,
        cause: e.cause ?? String(e.cause ?? "N/A"),
      });
      scope.setContext("metadata", metadata);
      if (clientInput && typeof clientInput === "object") {
        scope.setContext("clientInput", clientInput as Record<string, any>);
      } else {
        scope.setContext("clientInput", { value: String(clientInput) });
      }

      return scope;
    });

    // --- Detect Drizzle-wrapped Neon errors ---
    if (e.constructor.name === "DrizzleQueryError" && e.cause) {
      const raw = String(e.cause);

      // Example: "NeonDbError: duplicate key value violates unique constraint "customers_email_unique""
      const cleaned = cleanDatabaseErrorMessage(raw);

      return cleaned || "A database error occurred. Please try again.";
    }

    // Fallback: Generic error
    return (
      cleanDatabaseErrorMessage(e.message) || "An unexpected error occurred."
    );
  },
});

/**
 * Removes technical prefixes like "NeonDbError:" or "Error:"
 * and trims unnecessary whitespace or stack info.
 */
function cleanDatabaseErrorMessage(message: string): string {
  if (!message) return "";
  return message
    .replace(/^.*NeonDbError:\s*/i, "") // Remove "NeonDbError:" prefix
    .replace(/^.*Error:\s*/i, "") // Remove any generic "Error:" prefix
    .replace(/\s+at\s[\s\S]+$/, "") // Remove any stack trace lines
    .trim();
}
