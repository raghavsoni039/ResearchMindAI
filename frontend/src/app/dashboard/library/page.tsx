"use client";

import { useEffect, useState } from "react";

import LibraryHeader from "@/components/library/LibraryHeader";
import SearchBar from "@/components/library/SearchBar";
import LibraryFilters from "@/components/library/LibraryFilters";
import DocumentCard from "@/components/library/DocumentCard";
import EmptyLibrary from "@/components/library/EmptyLibrary";
import DeleteDialog from "@/components/library/DeleteDialog";
import { API_BASE_URL, apiFetch } from "@/lib/api";

interface DocumentItem {
  filename: string;
  pages: number;
  chunks: number;
  stored_name?: string;
  score?: number;
  preview?: string;
}

export default function LibraryPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [deleteFile, setDeleteFile] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      searchDocuments();
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  async function loadDocuments() {
    try {
      setLoading(true);

      const response = await apiFetch(
        `${API_BASE_URL}/documents`
      );

      const data = await response.json();

      setDocuments(data.documents ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function searchDocuments() {
    if (!search.trim()) {
      loadDocuments();
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch(
        `${API_BASE_URL}/documents/semantic-search/${encodeURIComponent(
          search
        )}`
      );

      const data = await response.json();

      setDocuments(data.documents ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteDocument() {
    if (!deleteFile) return;

    try {
      await apiFetch(
        `${API_BASE_URL}/documents/${encodeURIComponent(deleteFile)}`,
        {
          method: "DELETE",
        }
      );

      if (search.trim()) {
        searchDocuments();
      } else {
        loadDocuments();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteFile(null);
    }
  }

  return (
    <div className="space-y-10">

      <LibraryHeader />

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      <LibraryFilters />

      {loading ? (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {[1, 2, 3, 4, 5, 6].map((item) => (

            <div
              key={item}
              className="h-72 rounded-3xl border bg-card animate-pulse"
            />

          ))}

        </div>

      ) : documents.length === 0 ? (

        <EmptyLibrary />

      ) : (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {documents.map((doc) => (

            <DocumentCard
              key={doc.filename}
              filename={doc.filename}
              pages={doc.pages}
              chunks={doc.chunks}
              score={doc.score}
              preview={doc.preview}
              onDelete={() => setDeleteFile(doc.filename)}
            />

          ))}

        </div>

      )}

      <DeleteDialog
        open={deleteFile !== null}
        onClose={() => setDeleteFile(null)}
        onConfirm={deleteDocument}
      />

    </div>
  );
}