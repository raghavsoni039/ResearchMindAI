"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ExportButton from "@/components/upload/ExportButton";
import { API_BASE_URL, apiFetch } from "@/lib/api";

interface Document {
  filename: string;
}

export default function SummaryPage() {

  const [documents, setDocuments] = useState<Document[]>([]);
  const [selected, setSelected] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    loadDocuments();

  }, []);

  async function loadDocuments() {

    try {

      const res = await apiFetch(
        `${API_BASE_URL}/documents`
      );

      const data = await res.json();

      setDocuments(data.documents || []);

      if (data.documents?.length > 0) {

        setSelected(data.documents[0].filename);

      }

    } catch (error) {

      console.error(error);

    }

  }

  async function generateSummary() {

    if (!selected) return;

    setLoading(true);

    setSummary("");

    try {

      const res = await apiFetch(
        `${API_BASE_URL}/summary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: selected,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {

        setSummary(data.summary);

      } else {

        setSummary(data.detail || "Unable to generate summary.");

      }

    } catch (error) {

      console.error(error);

      setSummary("Could not connect to backend.");

    }

    setLoading(false);

  }

  return (

    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">

        📑 AI Research Summary

      </h1>

      {documents.length === 0 ? (

        <div className="border rounded-xl p-12 text-center bg-card shadow-sm">

          <p className="text-muted-foreground text-lg mb-4">No research papers found in your library.</p>

          <Link
            href="/dashboard/upload"
            className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 py-3 font-medium hover:opacity-90 transition"
          >
            Upload a PDF First
          </Link>

        </div>

      ) : (

        <>

          <div className="flex gap-4">

            <select
              className="border rounded p-3 flex-1"
              value={selected}
              onChange={(e)=>setSelected(e.target.value)}
              disabled={loading}
            >

              {documents.map((doc)=>(

                <option
                  key={doc.filename}
                  value={doc.filename}
                >

                  {doc.filename}

                </option>

              ))}

            </select>

            <button
              onClick={generateSummary}
              disabled={loading}
              className="bg-blue-600 text-white px-6 rounded disabled:opacity-60"
            >

              {loading
                ? "Generating..."
                : "Generate Summary"}

            </button>

          </div>

          {loading && (

            <div className="mt-8 text-lg">

              🤖 ResearchMind AI is reading your paper...

            </div>

          )}

          {summary && (

            <>

              <div className="mt-8">

                <ExportButton
                  title="ResearchMind_Summary"
                  content={summary}
                />

              </div>

              <div className="mt-6 bg-white dark:bg-card shadow rounded-xl p-8 whitespace-pre-wrap border">

                {summary}

              </div>

            </>

          )}

        </>

      )}

    </div>

  );

}