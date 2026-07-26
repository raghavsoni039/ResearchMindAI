"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { API_BASE_URL, apiFetch } from "@/lib/api";

interface Document {
  filename: string;
}

export default function RecentUploads() {

  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {

    async function loadDocuments() {

      try {

        const response = await apiFetch(
          `${API_BASE_URL}/documents`
        );

        const data = await response.json();

        setDocuments(data.documents);

      } catch (error) {

        console.error(error);

      }

    }

    loadDocuments();

  }, []);

  return (

    <section>

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">

          Recent Uploads

        </h2>

        <span className="text-sm text-muted-foreground">

          {documents.length} Documents

        </span>

      </div>

      {documents.length === 0 ? (

        <div className="rounded-3xl border bg-card p-10 text-center">

          <FileText className="mx-auto h-14 w-14 text-muted-foreground mb-4"/>

          <p className="text-muted-foreground">

            No uploaded papers yet.

          </p>

        </div>

      ) : (

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {documents.map((doc, index) => (

            <div
              key={index}
              className="
              rounded-3xl
              border
              bg-card
              p-6
              shadow
              hover:shadow-xl
              transition-all
              hover:-translate-y-1
              "
            >

              <FileText className="h-10 w-10 text-primary mb-5"/>

              <h3 className="font-semibold break-all">

                {doc.filename}

              </h3>

              <div className="mt-6 flex gap-2">

                <Link
                  href="/dashboard/chat"
                  className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-90 transition"
                >

                  Chat

                </Link>

                <Link
                  href="/dashboard/summary"
                  className="rounded-xl border px-4 py-2 text-sm hover:bg-muted transition"
                >

                  Summary

                </Link>

              </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>

  );

}