from app.rag.vector_store import collection
from app.services.gemini_service import GeminiService


class CitationService:

    @staticmethod
    async def generate(
        filename: str,
        user_id: str = "guest",
    ):

        # Fetch metadatas scoped to this user
        results = collection.get(
            include=[
                "documents",
                "metadatas",
            ],
            where={"user_id": user_id},
        )

        paper_chunks = []

        for text, meta in zip(
            results.get("documents", []),
            results.get("metadatas", []),
        ):

            if meta.get("filename") == filename:

                paper_chunks.append(
                    (
                        meta.get("page", 1),
                        text,
                    )
                )

        if len(paper_chunks) == 0:

            return {
                "apa": "",
                "ieee": "",
                "mla": "",
                "chicago": "",
                "harvard": "",
                "bibtex": "",
            }

        paper_chunks.sort(
            key=lambda x: x[0]
        )

        full_text = "\n\n".join(
            chunk
            for _, chunk in paper_chunks
        )

        full_text = full_text[:25000]

        citations = await GeminiService.generate_citations(
            full_text
        )

        return citations