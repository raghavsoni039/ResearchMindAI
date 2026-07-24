from app.rag.vector_store import collection
from app.services.gemini_service import GeminiService


class CompareService:

    @staticmethod
    async def compare(filenames: list[str], user_id: str = "guest"):

        # Fetch only this user's documents
        results = collection.get(
            include=[
                "documents",
                "metadatas",
            ],
            where={"user_id": user_id},
        )

        docs = []

        for filename in filenames:

            chunks = []

            for text, meta in zip(
                results["documents"],
                results["metadatas"],
            ):

                if meta["filename"] == filename:

                    chunks.append(
                        (
                            meta["page"],
                            text,
                        )
                    )

            chunks.sort(key=lambda x: x[0])

            full_text = "\n\n".join(text for _, text in chunks)
            full_text = full_text[:12000]

            docs.append(
                {
                    "filename": filename,
                    "text": full_text,
                }
            )

        return await GeminiService.compare_documents(docs)