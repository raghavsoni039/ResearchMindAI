"use client";

import { useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL, apiFetch } from "@/lib/api";

import UploadHero from "@/components/upload/UploadHero";
import UploadStats from "@/components/upload/UploadStats";
import UploadDropzone from "@/components/upload/UploadDropzone";
import UploadProgress from "@/components/upload/UploadProgress";
import UploadSuccess from "@/components/upload/UploadSuccess";
import RecentUploads from "@/components/upload/RecentUploads";

export default function UploadPage() {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [uploaded, setUploaded] = useState(false);

  async function uploadFile() {

    if (!selectedFile) {

      toast.error("Please select a PDF first.");

      return;

    }

    setUploading(true);

    setUploaded(false);

    setProgress(0);

    const timer = setInterval(() => {

      setProgress((old) => {

        if (old >= 90) return old;

        return old + 10;

      });

    }, 200);

    const formData = new FormData();

    formData.append("file", selectedFile);

    try {

      const response = await apiFetch(
        `${API_BASE_URL}/documents/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      clearInterval(timer);

      setProgress(100);

      const data = await response.json();

      if (response.ok) {

        setUploaded(true);

        toast.success("Research paper uploaded successfully!");

      } else {

        toast.error(
          data.detail || "Upload failed."
        );

      }

    } catch {

      clearInterval(timer);

      toast.error(
        "Could not connect to backend."
      );

    } finally {

      setUploading(false);

    }

  }

  return (

    <div className="space-y-12">

      {/* Hero */}

      <UploadHero />

      {/* Statistics */}

      <UploadStats />

      {/* Dropzone */}

      <UploadDropzone
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />

      {/* Upload Button */}

      <div className="flex justify-center">

        <button
          onClick={uploadFile}
          disabled={uploading}
          className="
            rounded-2xl
            bg-primary
            text-primary-foreground
            px-10
            py-4
            text-lg
            font-semibold
            shadow-lg
            hover:shadow-xl
            hover:scale-105
            transition-all
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >

          {uploading
            ? `Uploading... ${progress}%`
            : "🚀 Upload Research Paper"}

        </button>

      </div>

      {/* Progress */}

      <UploadProgress
        uploading={uploading}
        progress={progress}
      />

      {/* Success Card */}

      <UploadSuccess
        uploaded={uploaded}
        filename={selectedFile?.name ?? ""}
      />

      {/* Recent Uploads */}

      <RecentUploads />

    </div>

  );

}