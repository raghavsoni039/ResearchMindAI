"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL, apiFetch } from "@/lib/api";

interface Document {
  filename: string;
  pages: number;
  chunks: number;
}

interface CitationResponse {
  apa: string;
  ieee: string;
  mla: string;
  chicago: string;
  harvard: string;
  bibtex: string;
}

export default function CitationPage() {

  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedFile, setSelectedFile] = useState("");

  const [loading, setLoading] = useState(false);

  const [citation, setCitation] = useState<CitationResponse>({
    apa: "",
    ieee: "",
    mla: "",
    chicago: "",
    harvard: "",
    bibtex: "",
  });

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

  async function generateCitation() {

    if (!selectedFile) {

      alert("Please select a research paper.");

      return;

    }

    setLoading(true);

    try {

      const response = await apiFetch(

        `${API_BASE_URL}/citation`,

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify({

            filename: selectedFile,

          }),

        }

      );

      const data = await response.json();

      if (response.ok) {

        setCitation({

          apa: data.apa || "",

          ieee: data.ieee || "",

          mla: data.mla || "",

          chicago: data.chicago || "",

          harvard: data.harvard || "",

          bibtex: data.bibtex || "",

        });

      }

      else {

        alert(data.detail || "Failed to generate citation.");

      }

    }

    catch (error) {

      console.error(error);

      alert("Backend connection failed.");

    }

    setLoading(false);

  }

  function copy(text: string) {

    navigator.clipboard.writeText(text);

    alert("Citation Copied!");

  }

  const citationFormats = [

    { title: "APA", value: citation.apa },

    { title: "IEEE", value: citation.ieee },

    { title: "MLA", value: citation.mla },

    { title: "Chicago", value: citation.chicago },

    { title: "Harvard", value: citation.harvard },

    { title: "BibTeX", value: citation.bibtex },

  ];

  return (

    <div className="max-w-6xl mx-auto space-y-8">

      <h1 className="text-3xl font-bold">

        📚 Citation Generator

      </h1>

      {documents.length === 0 ? (

        <div className="rounded-xl border bg-card p-10 text-center">

          No research papers found.

          <br />

          Upload a PDF first.

        </div>

      ) : (

        <div className="rounded-xl border bg-card shadow p-6">

          <label className="font-semibold">

            Select Research Paper

          </label>

          <select

            className="w-full mt-3 rounded-lg border p-3"

            value={selectedFile}

            disabled={loading}

            onChange={(e)=>setSelectedFile(e.target.value)}

          >

            <option value="">

              Choose Research Paper

            </option>

            {documents.map((doc)=>(

              <option

                key={doc.filename}

                value={doc.filename}

              >

                {doc.filename} ({doc.pages} Pages)

              </option>

            ))}

          </select>

          <button

            onClick={generateCitation}

            disabled={loading}

            className="mt-5 rounded-lg bg-primary text-primary-foreground px-6 py-3 disabled:opacity-60"

          >

            {loading

              ? "Generating..."

              : "Generate Citation"}

          </button>

        </div>

      )}

      {(citation.apa ||
        citation.ieee ||
        citation.mla ||
        citation.chicago ||
        citation.harvard ||
        citation.bibtex) && (

        <div className="space-y-6">

          {citationFormats.map((item)=>(

            <div

              key={item.title}

              className="rounded-xl border bg-card shadow p-5"

            >

              <div className="flex justify-between items-center">

                <h2 className="text-xl font-bold">

                  {item.title}

                </h2>

                <button

                  onClick={()=>copy(item.value)}

                  className="rounded-lg bg-primary text-primary-foreground px-4 py-2"

                >

                  Copy

                </button>

              </div>

              <pre className="mt-4 whitespace-pre-wrap break-words text-muted-foreground">

                {item.value || "Not Available"}

              </pre>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}