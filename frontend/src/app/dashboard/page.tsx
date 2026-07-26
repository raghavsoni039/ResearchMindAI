"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  FileText,
  ArrowRight,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import QuickActions from "@/components/dashboard/QuickActions";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import AIInsights from "@/components/dashboard/AIInsights";
import { API_BASE_URL, apiFetch } from "@/lib/api";

interface DashboardStats {
  papers: number;
  pages: number;
  chunks: number;
  storage_mb: number;

  recent_documents: {
    filename: string;
    pages: number;
  }[];
}

export default function DashboardPage() {

  const [stats, setStats] = useState<DashboardStats>({
    papers: 0,
    pages: 0,
    chunks: 0,
    storage_mb: 0,
    recent_documents: [],
  });

  useEffect(() => {

    async function loadDashboard() {

      try {

        const response = await apiFetch(
          `${API_BASE_URL}/dashboard`
        );

        const data = await response.json();

        setStats(data);

      } catch (error) {

        console.error(error);

      }

    }

    loadDashboard();

  }, []);

  return (

    <div className="space-y-12 animate-in fade-in duration-500">

      {/* Hero */}

      <DashboardHeader />

      {/* Statistics */}

      <StatsCards
        papers={stats.papers}
        pages={stats.pages}
        chunks={stats.chunks}
        storage={stats.storage_mb}
      />

      {/* Quick Actions */}

      <QuickActions />

      {/* Analytics */}

      <AnalyticsCharts />

      {/* Timeline + AI */}

      <section className="grid gap-8 lg:grid-cols-3">

        <div className="lg:col-span-2">

          <ActivityTimeline />

        </div>

        <AIInsights />

      </section>

      {/* Recent Papers */}

      <section>

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-3xl font-bold">

              📚 Recent Papers

            </h2>

            <p className="text-muted-foreground mt-1">

              Your latest uploaded research papers

            </p>

          </div>

          <div className="flex items-center gap-4">

            <span className="rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-semibold">

              {stats.recent_documents.length} Documents

            </span>

            <Link
              href="/dashboard/library"
              className="flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-muted transition"
            >

              View All

              <ArrowRight className="w-4 h-4" />

            </Link>

          </div>

        </div>

        {stats.recent_documents.length === 0 ? (

          <div className="rounded-3xl border bg-card shadow-lg p-16 text-center">

            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">

              <FileText className="w-12 h-12 text-primary" />

            </div>

            <h3 className="mt-6 text-2xl font-bold">

              No Research Papers Yet

            </h3>

            <p className="mt-3 text-muted-foreground">

              Upload your first PDF and start chatting with AI.

            </p>

            <Link
              href="/dashboard/upload"
              className="inline-flex mt-8 rounded-xl bg-primary text-primary-foreground px-6 py-3 hover:opacity-90 transition"
            >

              Upload First Paper

            </Link>

          </div>

        ) : (

          <div className="grid gap-5">

            {stats.recent_documents.map((paper, index) => (

              <div
                key={paper.filename}
                className="rounded-3xl border bg-card p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-5">

                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">

                      <FileText className="w-8 h-8 text-primary" />

                    </div>

                    <div>

                      <h3 className="text-xl font-semibold">

                        {paper.filename}

                      </h3>

                      <p className="text-muted-foreground mt-1">

                        {paper.pages} Pages

                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <span className="rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-semibold">

                      #{index + 1}

                    </span>

                    <Link
                      href="/dashboard/chat"
                      className="rounded-xl border px-4 py-2 hover:bg-muted transition"
                    >

                      Chat

                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>

  );

}