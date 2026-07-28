/**
 * Central API configuration & Authenticated Fetch helper.
 *
 * Usage:
 *   import { apiFetch } from "@/lib/api";
 *   const res = await apiFetch("/documents");
 *
 * apiFetch automatically attaches the user identity (X-User-Id) from NextAuth
 * to every request so FastAPI can isolate data per user.
 */

import { getSession } from "next-auth/react";

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }

  return "";
}

export const API_BASE_URL = getApiBaseUrl();

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const session = await getSession();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Extract a unique user identifier (user.id or user.email)
  const userId = session?.user?.id || session?.user?.email;

  if (userId) {
    headers["X-User-Id"] = userId;
    if (session?.user?.email) headers["X-User-Email"] = session.user.email;
    if (session?.user?.name) headers["X-User-Name"] = session.user.name;
  }

  const baseUrl = getApiBaseUrl();
  const url = path.startsWith("http://") || path.startsWith("https://")
    ? path
    : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  return fetch(url, {
    ...options,
    headers,
  });
}

