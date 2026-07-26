"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-8 py-6">

        <div className="text-3xl font-bold text-blue-700">
          🧠 ResearchMind AI
        </div>

        <div className="flex gap-4">

          <Link
            href="/dashboard"
            className="px-5 py-2 rounded-lg text-blue-700 hover:bg-blue-100 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/upload"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Upload Paper
          </Link>

        </div>

      </nav>

      {/* Hero */}

      <section className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">

        <div>

          <h1 className="text-6xl font-extrabold leading-tight">

            Your Intelligent

            <span className="text-blue-600">

              {" "}Research Assistant

            </span>

          </h1>

          <p className="text-xl text-gray-600 mt-8 leading-8">

            Upload research papers, chat with them using AI,
            compare multiple papers, generate summaries,
            create citations, and convert documents —
            all in one powerful platform.

          </p>

          <div className="mt-10 flex gap-6">

            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
            >
              🚀 Get Started
            </Link>

            <Link
              href="/dashboard/upload"
              className="border border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition"
            >
              📄 Upload Paper
            </Link>

          </div>

        </div>

        <div className="flex justify-center">

          <img
            src="/hero-ai.svg"
            alt="Research AI"
            className="w-full max-w-lg"
          />

        </div>

      </section>

    </main>
  );
}