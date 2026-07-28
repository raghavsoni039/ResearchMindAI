"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail, Lock, User, Brain } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "signup" && !name.trim()) {
      setError("Please enter your name to create an account.");
      return;
    }

    setLoading("credentials");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        name: mode === "signup" ? name : undefined,
        callbackUrl,
        redirect: false,
      });
      setLoading(null);
      if (result?.error) {
        setError(
          mode === "signup"
            ? "Unable to create account. Password must be at least 3 characters."
            : "Invalid email or password. Check credentials or click Create Account."
        );
      } else {
        toast.success(mode === "signup" ? "Account created! Welcome to ResearchMind AI." : "Signed in successfully!");
        const target = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
        window.location.href = target;
      }
    } catch {
      setLoading(null);
      setError("An unexpected error occurred.");
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    setError("");
    setLoading(provider);
    try {
      const result = await signIn(provider, { callbackUrl, redirect: false });
      if (result?.url) {
        window.location.href = result.url;
      } else if (result?.error) {
        const name = provider === "google" ? "Google" : "GitHub";
        toast.error(`${name} OAuth error: ${result.error}`);
        setError(`Failed to sign in with ${name}.`);
        setLoading(null);
      }
    } catch {
      try {
        await signIn(provider, { callbackUrl });
      } catch {
        setLoading(null);
        toast.error("Failed to initiate OAuth login.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
              <Brain className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white">ResearchMind AI</h1>
            <p className="text-slate-400 text-sm mt-1">
              {mode === "signin" ? "Sign in to your research workspace" : "Create your research account"}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 bg-white/5 p-1 rounded-xl border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => { setMode("signin"); setError(""); }}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === "signin" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(""); }}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === "signup" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              id="btn-google-signin"
              onClick={() => handleOAuth("google")}
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "google" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <FcGoogle size={18} />
              )}
              Continue with Google
            </button>

            <button
              id="btn-github-signin"
              onClick={() => handleOAuth("github")}
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "github" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <FaGithub size={18} />
              )}
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleCredentials} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  id="input-name"
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === "signup"}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                id="input-email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                id="input-password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              id="btn-credentials-signin"
              type="submit"
              disabled={!!loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading === "credentials" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {mode === "signin" ? "Signing in..." : "Creating account..."}
                </>
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Toggle text link */}
          <div className="mt-6 text-center text-sm text-slate-400">
            {mode === "signin" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(""); }}
                  className="text-indigo-400 font-semibold hover:underline"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setError(""); }}
                  className="text-indigo-400 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <Loader2 className="animate-spin" size={32} />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
