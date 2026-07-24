from pathlib import Path

from app.rag.vector_store import collection

UPLOAD_DIR = Path("app/uploads")


class DashboardService:

    @staticmethod
    def get_statistics(user_id: str = "guest"):

        # Fetch only metadatas belonging to this user
        results = collection.get(
            include=["metadatas"],
            where={"user_id": user_id},
        )

        metadatas = results.get("metadatas", [])

        documents = {}
        total_chunks = len(metadatas)
        total_pages = 0

        for meta in metadatas:

            filename = meta.get("filename", "Unknown")

            if filename not in documents:
                documents[filename] = {
                    "stored_name": meta.get("stored_name"),
                    "pages": set(),
                }

            documents[filename]["pages"].add(meta.get("page", 1))

        for doc in documents.values():
            total_pages += len(doc["pages"])

        # Calculate storage size ONLY for files belonging to this user
        total_size = 0
        if UPLOAD_DIR.exists():
            for doc in documents.values():
                stored = doc.get("stored_name")
                if stored:
                    pdf_path = UPLOAD_DIR / stored
                    if pdf_path.exists():
                        total_size += pdf_path.stat().st_size

        recent_documents = []

        for filename, data in documents.items():
            recent_documents.append({
                "filename": filename,
                "pages": len(data["pages"]),
            })

        recent_documents.sort(
            key=lambda x: x["filename"].lower(),
            reverse=True,
        )

        return {
            "papers": len(documents),
            "pages": total_pages,
            "chunks": total_chunks,
            "storage_mb": round(total_size / (1024 * 1024), 2),
            "recent_documents": recent_documents[:5],
        }