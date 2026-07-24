from collections import defaultdict

from app.rag.vector_store import collection
from app.services.embedding_service import EmbeddingService


class SemanticSearchService:

    @staticmethod
    def search(query: str, n_results: int = 10, user_id: str = "guest"):

        # Generate embedding for user query
        query_embedding = EmbeddingService.embeddings.embed_query(query)

        # Search ChromaDB — scoped to this user only
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where={"user_id": user_id},
            include=["metadatas", "documents", "distances"],
        )

        grouped = defaultdict(
            lambda: {
                "filename": "",
                "pages": set(),
                "chunks": 0,
                "score": 0,
                "preview": "",
            }
        )

        metadatas = results.get("metadatas", [[]])[0]
        documents = results.get("documents", [[]])[0]
        distances = results.get("distances", [[]])[0]

        for meta, text, distance in zip(
            metadatas,
            documents,
            distances,
        ):

            filename = meta.get("filename", "Unknown")

            grouped[filename]["filename"] = filename
            grouped[filename]["pages"].add(meta.get("page", 1))
            grouped[filename]["chunks"] += 1

            if grouped[filename]["preview"] == "":
                grouped[filename]["preview"] = text[:250]

            similarity = round((1 - distance) * 100, 2)

            if similarity > grouped[filename]["score"]:
                grouped[filename]["score"] = similarity

        response = []

        for doc in grouped.values():

            response.append(
                {
                    "filename": doc["filename"],
                    "pages": len(doc["pages"]),
                    "chunks": doc["chunks"],
                    "score": doc["score"],
                    "preview": doc["preview"],
                }
            )

        response.sort(
            key=lambda x: x["score"],
            reverse=True,
        )

        return response