"use client";

import { useState } from "react";
import { API_BASE_URL, apiFetch } from "@/lib/api";

interface ExportButtonProps {
  title: string;
  content: string;
}

export default function ExportButton({
  title,
  content,
}: ExportButtonProps) {
  const [format, setFormat] = useState("pdf");
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    if (!content) {
      alert("Nothing to export.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch(`${API_BASE_URL}/export/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          format,
        }),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      const extension =
        format === "docx"
          ? "docx"
          : format === "md"
          ? "md"
          : format === "txt"
          ? "txt"
          : format === "html"
          ? "html"
          : format === "json"
          ? "json"
          : format === "tex"
          ? "tex"
          : format === "bib"
          ? "bib"
          : "pdf";

      link.download = `${title}.${extension}`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Export failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-3 items-center mt-6">

      <select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="border rounded-lg px-3 py-2"
      >
        <option value="pdf">PDF</option>
        <option value="docx">Word (.docx)</option>
        <option value="txt">Text (.txt)</option>
        <option value="md">Markdown (.md)</option>
        <option value="html">HTML</option>
        <option value="json">JSON</option>
        <option value="tex">LaTeX (.tex)</option>
        <option value="bib">BibTeX (.bib)</option>
      </select>

      <button
        onClick={handleExport}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
      >
        {loading ? "Exporting..." : "⬇ Export"}
      </button>

    </div>
  );
}