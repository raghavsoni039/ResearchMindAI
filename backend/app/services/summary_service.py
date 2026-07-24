from app.rag.vector_store import collection
from app.services.gemini_service import GeminiService


class SummaryService:

    @staticmethod
    async def generate_summary(filename: str, user_id: str = "guest"):

        # Retrieve only this user's chunks for this document
        results = collection.get(
            include=["documents", "metadatas"],
            where={"user_id": user_id},
        )

        documents = results.get("documents", [])
        metadatas = results.get("metadatas", [])

        paper_chunks = []

        for text, meta in zip(documents, metadatas):

            if meta.get("filename") == filename:
                paper_chunks.append(
                    (
                        meta.get("page", 1),
                        text,
                    )
                )

        if len(paper_chunks) == 0:
            return "Document not found."

        paper_chunks.sort(key=lambda x: x[0])

        full_text = "\n\n".join(chunk for _, chunk in paper_chunks)
        full_text = full_text[:25000]

        summary = await GeminiService.generate_summary(full_text)

        return summary