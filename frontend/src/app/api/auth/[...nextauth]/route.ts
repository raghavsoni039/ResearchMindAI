/**
 * Auth.js catch-all route handler.
 * Handles all /api/auth/* requests automatically.
 */
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
