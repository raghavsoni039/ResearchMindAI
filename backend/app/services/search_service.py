from app.rag.vector_store import collection


class SearchService:

    @staticmethod
    def search_documents(query: str, user_id: str = "guest"):

        # Fetch metadatas scoped to this user
        results = collection.get(
            include=["metadatas"],
            where={"user_id": user_id},
        )

        metadatas = results.get("metadatas", [])

        documents = {}

        for meta in metadatas:

            filename = meta.get("filename", "")

            if query.lower() in filename.lower():

                if filename not in documents:

                    documents[filename] = {
                        "filename": filename,
                        "pages": set(),
                        "chunks": 0,
                    }

                documents[filename]["chunks"] += 1
                documents[filename]["pages"].add(meta.get("page", 1))

        response = []

        for doc in documents.values():

            response.append(
                {
                    "filename": doc["filename"],
                    "pages": len(doc["pages"]),
                    "chunks": doc["chunks"],
                }
            )

        return response