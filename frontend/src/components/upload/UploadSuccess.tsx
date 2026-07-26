"use client";

import Link from "next/link";
import {
  CheckCircle2,
  FileText,
  MessageSquare,
  Library,
} from "lucide-react";

interface UploadSuccessProps {
  uploaded: boolean;
  filename: string;
  pages?: number;
  chunks?: number;
}

export default function UploadSuccess({
  uploaded,
  filename,
  pages = 0,
  chunks = 0,
}: UploadSuccessProps) {

  if (!uploaded) return null;

  return (

    <div className="rounded-3xl border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900 shadow-xl p-8">

      <div className="flex items-center gap-4">

        <CheckCircle2 className="h-12 w-12 text-green-600"/>

        <div>

          <h2 className="text-2xl font-bold">

            Upload Successful 🎉

          </h2>

          <p className="text-muted-foreground">

            Your research paper has been processed successfully.

          </p>

        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-8">

        <div className="rounded-2xl bg-background border p-5">

          <FileText className="h-7 w-7 text-primary mb-3"/>

          <p className="text-sm text-muted-foreground">
            File Name
          </p>

          <h3 className="font-semibold mt-1 break-all">
            {filename}
          </h3>

        </div>

        <div className="rounded-2xl bg-background border p-5">

          <p className="text-sm text-muted-foreground">
            Pages
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {pages}
          </h2>

        </div>

        <div className="rounded-2xl bg-background border p-5">

          <p className="text-sm text-muted-foreground">
            AI Chunks
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {chunks}
          </h2>

        </div>

      </div>

      <div className="flex flex-wrap gap-4 mt-8">

        <Link
          href="/dashboard/library"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 hover:opacity-90 transition"
        >
          <Library className="w-5 h-5"/>
          Open Library
        </Link>

        <Link
          href="/dashboard/chat"
          className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 hover:bg-muted transition"
        >
          <MessageSquare className="w-5 h-5"/>
          Chat with Papers
        </Link>

      </div>

    </div>

  );

}