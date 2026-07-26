"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

import { jsPDF } from "jspdf";

import {
    Document as WordDocument,
    Packer,
    Paragraph,
    HeadingLevel,
} from "docx";

// @ts-ignore
import { saveAs } from "file-saver";
import { API_BASE_URL, apiFetch } from "@/lib/api";
interface ResearchDocument {
  filename: string;
  pages: number;
  chunks: number;
}
export default function ComparePage() {

  const [documents, setDocuments] = useState<ResearchDocument[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [comparison, setComparison] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {

    try {

      const response = await apiFetch(
        `${API_BASE_URL}/documents`
      );

      const data = await response.json();

      setDocuments(data.documents || []);

    }

    catch (error) {

      console.error(error);

    }

  }

  function toggleSelection(filename: string) {

    if (selected.includes(filename)) {

      setSelected(
        selected.filter((f) => f !== filename)
      );

    }

    else {

      setSelected([
        ...selected,
        filename,
      ]);

    }

  }

  async function compare() {

    if (selected.length < 2) {

      alert("Select at least two papers.");

      return;

    }

    setLoading(true);

    setComparison("");

    try {

      const response = await apiFetch(

        `${API_BASE_URL}/compare`,

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify({

            filenames: selected,

          }),

        }

      );

      const data = await response.json();

      if (response.ok) {

        setComparison(data.comparison);

      }

      else {

        setComparison(

          data.detail ||

          "Comparison failed."

        );

      }

    }

    catch (error) {

      console.error(error);

      setComparison(

        "Could not connect to backend."

      );

    }

    setLoading(false);

  }
  // ----------------------------------------------------
// Download TXT
// ----------------------------------------------------

function downloadTXT() {

  const blob = new Blob(

    [comparison],

    {

      type: "text/plain;charset=utf-8",

    }

  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "comparison_report.txt";

  a.click();

  URL.revokeObjectURL(url);

}

// ----------------------------------------------------
// Download Markdown
// ----------------------------------------------------

function downloadMarkdown() {

  const blob = new Blob(

    [comparison],

    {

      type: "text/markdown;charset=utf-8",

    }

  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "comparison_report.md";

  a.click();

  URL.revokeObjectURL(url);

}

// ----------------------------------------------------
// Download PDF
// ----------------------------------------------------

function downloadPDF() {

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("ResearchMind AI", 15, 18);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(15);
  pdf.text("Research Paper Comparison Report", 15, 30);

  pdf.setFontSize(11);

  const pageWidth = 180;
  const lineHeight = 6;

  const lines = pdf.splitTextToSize(
    comparison,
    pageWidth
  );

  let y = 42;

  lines.forEach((line: string) => {

    if (y > 280) {

      pdf.addPage();

      y = 20;

    }

    pdf.text(line, 15, y);

    y += lineHeight;

  });

  pdf.save("ResearchMind_Comparison_Report.pdf");

}
// ----------------------------------------------------
// Download Word
// ----------------------------------------------------

async function downloadWord() {

  const paragraphs = comparison
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map(
      (line) =>
        new Paragraph({
          text: line,
          spacing: {
            after: 160,
          },
        })
    );

  const doc = new WordDocument({

    sections: [

      {

        children: [

          new Paragraph({

            heading: HeadingLevel.TITLE,

            text: "ResearchMind AI",

          }),

          new Paragraph({

            heading: HeadingLevel.HEADING_1,

            text: "Research Paper Comparison Report",

          }),

          ...paragraphs,

        ],

      },

    ],

  });

  const blob = await Packer.toBlob(doc);

  saveAs(
    blob,
    "ResearchMind_Comparison_Report.docx"
  );

}
return (

  <div className="max-w-6xl mx-auto p-8">

    <h1 className="text-3xl font-bold mb-8">

      📊 Compare Research Papers

    </h1>

    {documents.length === 0 ? (

      <div className="border rounded-xl p-12 text-center bg-card shadow-sm">

        <p className="text-muted-foreground text-lg mb-4">No research papers found to compare.</p>

        <Link
          href="/dashboard/upload"
          className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 py-3 font-medium hover:opacity-90 transition"
        >
          Upload Papers First
        </Link>

      </div>

    ) : (

      <>

        <div className="space-y-4">

          {documents.map((doc) => (

            <label

              key={doc.filename}

              className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow cursor-pointer hover:border-primary transition"

            >

              <input

                type="checkbox"

                disabled={loading}

                checked={selected.includes(doc.filename)}

                onChange={() => toggleSelection(doc.filename)}

              />

              <div>

                <h2 className="font-semibold">

                  {doc.filename}

                </h2>

                <p className="text-sm text-muted-foreground">

                  {doc.pages} Pages • {doc.chunks} Chunks

                </p>

              </div>

            </label>

          ))}

        </div>

        <button

          onClick={compare}

          disabled={loading}

          className="mt-8 rounded-xl bg-primary px-8 py-3 text-primary-foreground hover:opacity-90 disabled:opacity-60"

        >

          {loading

            ? "Comparing..."

            : "Compare Papers"}

        </button>

      </>

    )}

    {comparison && (

      <div className="mt-12">

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

          <h2 className="text-2xl font-bold">

            📑 AI Comparison Report

          </h2>

          <div className="flex flex-wrap gap-3">

            <button

              onClick={downloadPDF}

              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"

            >

              <Download className="w-4 h-4"/>

              PDF

            </button>

            <button

              onClick={downloadWord}

              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"

            >

              <Download className="w-4 h-4"/>

              Word

            </button>

            <button

              onClick={downloadMarkdown}

              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"

            >

              <Download className="w-4 h-4"/>

              Markdown

            </button>

            <button

              onClick={downloadTXT}

              className="flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"

            >

              <Download className="w-4 h-4"/>

              TXT

            </button>

          </div>

        </div>

        <div className="rounded-xl border bg-card p-8 shadow whitespace-pre-wrap leading-8">

          {comparison}

        </div>

      </div>

    )}

  </div>

);

}