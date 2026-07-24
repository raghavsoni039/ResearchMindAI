from pathlib import Path

from app.rag.vector_store import collection
from app.core.logger import logger

UPLOAD_DIR = Path("app/uploads")


class LibraryService:

    @staticmethod
    def get_documents(user_id: str = "guest"):
        """Return all documents that belong to this user."""

        results = collection.get(
            include=["metadatas"],
            where={"user_id": user_id},
        )

        metadatas = results.get("metadatas", [])

        documents = {}

        for meta in metadatas:

            filename = meta.get("filename", "Unknown")

            if filename not in documents:

                documents[filename] = {
                    "filename": filename,
                    "stored_name": meta.get("stored_name"),
                    "chunks": 0,
                    "pages": set(),
                }

            documents[filename]["chunks"] += 1
            documents[filename]["pages"].add(meta.get("page", 1))

        response = []

        for doc in documents.values():

            response.append(
                {
                    "filename": doc["filename"],
                    "stored_name": doc["stored_name"],
                    "pages": len(doc["pages"]),
                    "chunks": doc["chunks"],
                }
            )

        response.sort(key=lambda x: x["filename"].lower())

        return response

    @staticmethod
    def delete_document(filename: str, user_id: str = "guest"):
        """Delete all chunks and the PDF for this user's document."""

        results = collection.get(
            include=["metadatas"],
            where={"user_id": user_id},
        )

        ids = results["ids"]
        metadatas = results["metadatas"]

        ids_to_delete = []
        stored_name = None

        for doc_id, meta in zip(ids, metadatas):

            if meta.get("filename") == filename:
                ids_to_delete.append(doc_id)
                stored_name = meta.get("stored_name")

        if ids_to_delete:
            collection.delete(ids=ids_to_delete)
            logger.info(f"Deleted {len(ids_to_delete)} chunks for '{filename}' (user={user_id})")

        if stored_name:

            pdf_path = UPLOAD_DIR / stored_name

            if pdf_path.exists():
                pdf_path.unlink()

        return {
            "success": True,
            "deleted": filename,
        }

    @staticmethod
    def get_stored_filename(filename: str, user_id: str = "guest"):

        results = collection.get(
            include=["metadatas"],
            where={"user_id": user_id},
        )

        metadatas = results.get("metadatas", [])

        for meta in metadatas:

            if meta.get("filename") == filename:
                return meta.get("stored_name")

        return None

    @staticmethod
    def get_pdf_path(filename: str, user_id: str = "guest"):

        stored_name = LibraryService.get_stored_filename(filename, user_id)

        if not stored_name:
            return None

        pdf_path = UPLOAD_DIR / stored_name

        if pdf_path.exists():
            return pdf_path

        return None