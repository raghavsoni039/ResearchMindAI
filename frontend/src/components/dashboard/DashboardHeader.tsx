"use client";

import Link from "next/link";
import { Upload, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardHeader() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <div className="rounded-3xl border bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 text-white p-10 shadow-xl">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">

          <div>

            <div className="flex items-center gap-3 mb-4">

              <Sparkles className="w-8 h-8"/>

              <h1 className="text-4xl font-bold">
                Welcome to ResearchMind AI
              </h1>

            </div>

            <p className="text-lg opacity-90">
              Your intelligent AI workspace for research papers,
              summaries, citations, comparisons and document analysis.
            </p>

            <p className="mt-5 text-white/80">
              {today}
            </p>

          </div>

          <Link
            href="/dashboard/upload"
            className="flex items-center gap-3 rounded-2xl bg-white text-indigo-700 px-7 py-4 font-semibold shadow-lg hover:scale-105 transition"
          >
            <Upload size={22}/>
            Upload Research Paper
          </Link>

        </div>

      </div>
    </motion.div>
  );
}