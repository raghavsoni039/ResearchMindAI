"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL, apiFetch } from "@/lib/api";

interface Document {
  filename: string;
}

export default function ConverterPage() {

  const [documents, setDocuments] = useState<Document[]>([]);
  const [selected, setSelected] = useState("");
  const [format, setFormat] = useState("docx");
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

  async function convertDocument() {

    if (!selected) return;

    setLoading(true);

    try {

      const response = await apiFetch(

        `${API_BASE_URL}/convert`,

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify({

            filename: selected,

            format,

          }),

        }

      );

      if (!response.ok) {

        throw new Error();

      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download =

        selected.replace(".pdf", "") +

        "." +

        format;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

    }

    catch (error) {

      console.error(error);

      alert("Conversion failed.");

    }

    setLoading(false);

  }

  return (

    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-4xl font-bold mb-10">

        📄 AI Document Converter

      </h1>

      {documents.length === 0 ? (

        <div className="rounded-xl border bg-card p-10 text-center">

          No research papers found.

          <br />

          Upload a PDF first.

        </div>

      ) : (

        <div className="rounded-xl border bg-card shadow p-8">

          <div className="mb-6">

            <label className="font-semibold">

              Select PDF

            </label>

            <select

              className="w-full rounded-lg border p-3 mt-2"

              value={selected}

              disabled={loading}

              onChange={(e) =>

                setSelected(e.target.value)

              }

            >

              {documents.map((doc) => (

                <option

                  key={doc.filename}

                  value={doc.filename}

                >

                  {doc.filename}

                </option>

              ))}

            </select>

          </div>

          <div className="mb-8">

            <label className="font-semibold">

              Convert To

            </label>

            <select

              className="w-full rounded-lg border p-3 mt-2"

              value={format}

              disabled={loading}

              onChange={(e) =>

                setFormat(e.target.value)

              }

            >

              <option value="docx">

                Word (.docx)

              </option>

              <option value="pdf">

                PDF

              </option>

              <option value="txt">

                Text (.txt)

              </option>

              <option value="md">

                Markdown (.md)

              </option>

              <option value="html">

                HTML

              </option>

              <option value="csv">

                CSV

              </option>

              <option value="json">

                JSON

              </option>

            </select>

          </div>

          <button

            onClick={convertDocument}

            disabled={loading}

            className="rounded-lg bg-primary text-primary-foreground px-8 py-3 disabled:opacity-60"

          >

            {loading

              ? "Converting..."

              : "Convert & Download"}

          </button>

        </div>

      )}

    </div>

  );

}