"use client";

import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";
import {
  FileText,
  MessageSquare,
  FileSearch,
  ArrowLeftRight,
  Quote,
  Trash2,
  Eye,
  Download,
  Brain,
} from "lucide-react";

interface Props {
  filename: string;
  pages?: number;
  chunks?: number;
  score?: number;
  preview?: string;
  onDelete?: () => void;
}

export default function DocumentCard({
  filename,
  pages = 0,
  chunks,
  score,
  preview,
  onDelete,
}: Props) {
  return (
    <div className="rounded-3xl border bg-card shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 p-6">

      {/* Header */}

      <div className="flex justify-between items-start">

        <div className="flex gap-4 flex-1">

          <div className="rounded-2xl bg-primary/10 p-3 h-fit">

            <FileText className="h-8 w-8 text-primary" />

          </div>

          <div className="flex-1">

            <h3 className="font-semibold text-lg break-all">
              {filename}
            </h3>

            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">

              <span>{pages} Pages</span>

              {chunks !== undefined && (
                <span>• {chunks} Chunks</span>
              )}

            </div>

            {score !== undefined && (

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">

                <Brain className="w-3 h-3" />

                {score.toFixed(1)}% Semantic Match

              </div>

            )}

          </div>

        </div>

      </div>

      {/* Preview */}

      {preview && (

        <div className="mt-5 rounded-xl bg-muted/40 p-4">

          <p className="text-sm text-muted-foreground line-clamp-4">

            {preview}

          </p>

        </div>

      )}

      {/* View + Download */}

      <div className="grid grid-cols-2 gap-3 mt-6">

        <a
          href={`${API_BASE_URL}/documents/view/${encodeURIComponent(filename)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center gap-2 rounded-xl bg-primary text-primary-foreground py-3 hover:opacity-90 transition"
        >
          <Eye className="w-4 h-4" />
          View
        </a>

        <a
          href={`${API_BASE_URL}/documents/download/${encodeURIComponent(filename)}`}
          className="flex justify-center items-center gap-2 rounded-xl border py-3 hover:bg-muted transition"
        >
          <Download className="w-4 h-4" />
          Download
        </a>

      </div>

      {/* AI Features */}

      <div className="grid grid-cols-2 gap-3 mt-4">

        <Link
          href="/chat"
          className="flex justify-center items-center gap-2 rounded-xl border py-3 hover:bg-muted transition"
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </Link>

        <Link
          href="/summary"
          className="flex justify-center items-center gap-2 rounded-xl border py-3 hover:bg-muted transition"
        >
          <FileSearch className="w-4 h-4" />
          Summary
        </Link>

        <Link
          href="/converter"
          className="flex justify-center items-center gap-2 rounded-xl border py-3 hover:bg-muted transition"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Convert
        </Link>

        <Link
          href="/citation"
          className="flex justify-center items-center gap-2 rounded-xl border py-3 hover:bg-muted transition"
        >
          <Quote className="w-4 h-4" />
          Citation
        </Link>

      </div>

      {/* Delete */}

      <button
        onClick={onDelete}
        className="mt-6 w-full rounded-xl bg-red-600 hover:bg-red-700 text-white py-3 flex justify-center items-center gap-2 transition"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>

    </div>
  );
}