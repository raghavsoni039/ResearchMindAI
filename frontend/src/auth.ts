/**
 * Auth.js v5 — central configuration
 *
 * Providers supported:
 *   - Google OAuth  (set AUTH_GOOGLE_ID + AUTH_GOOGLE_SECRET in .env.local)
 *   - GitHub OAuth  (set AUTH_GITHUB_ID + AUTH_GITHUB_SECRET in .env.local)
 *   - Credentials   (email + password — no external service needed)
 *
 * Session strategy: JWT (stateless, no database adapter required)
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

const DEMO_USERS = [
  { id: "local-1", email: "admin@researchmind.ai", name: "Admin", password: "admin123" },
];

const providers: NextAuthConfig["providers"] = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  );
}

providers.push(
  Credentials({
    name: "Email & Password",
    credentials: {
      email: { label: "Email", type: "email", placeholder: "you@example.com" },
      password: { label: "Password", type: "password" },
      name: { label: "Name", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const rawEmail = String(credentials.email).trim().toLowerCase();
      const rawPassword = String(credentials.password).trim();
      const rawName = credentials.name ? String(credentials.name).trim() : "";

      if (rawPassword.length < 3) return null;

      // Check admin account
      if (rawEmail === "admin@researchmind.ai" && rawPassword === "admin123") {
        return { id: "admin-1", email: "admin@researchmind.ai", name: rawName || "Admin User" };
      }

      // Allow any user to sign up / sign in dynamically
      const displayName = rawName || rawEmail.split("@")[0] || "Research User";
      const userId = `user-${rawEmail.replace(/[^a-z0-9]/g, "-")}`;

      return {
        id: userId,
        email: rawEmail,
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      };
    },
  })
);

export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const redirectUrl = new URL(url);
        const base = new URL(baseUrl);
        if (redirectUrl.origin === base.origin) return url;
      } catch {
        // Ignore invalid URL
      }
      return baseUrl;
    },

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id ?? token.sub;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
