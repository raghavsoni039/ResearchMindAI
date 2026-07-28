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
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const user = DEMO_USERS.find(
        (u) =>
          u.email === credentials.email &&
          u.password === credentials.password
      );

      if (!user) return null;

      return { id: user.id, email: user.email, name: user.name };
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
        if (redirectUrl.hostname === "localhost" || redirectUrl.hostname === "127.0.0.1") {
          return `${base.origin}${redirectUrl.pathname}${redirectUrl.search}`;
        }
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
