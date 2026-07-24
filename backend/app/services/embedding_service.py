import uuid

from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.core.config import settings
from app.core.logger import logger
from app.rag.vector_store import collection


class EmbeddingService:

    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=settings.GOOGLE_API_KEY,
    )

    @classmethod
    def store_document(
        cls,
        page_chunks: list,
        filename: str,
        stored_name: str,
        user_id: str = "guest",
    ):

        logger.info(f"Embedding {len(page_chunks)} chunks for '{filename}' (user={user_id})")

        ids = []

        # Extract text from each chunk
        texts = [item["text"] for item in page_chunks]

        # Generate embeddings via Gemini
        vectors = cls.embeddings.embed_documents(texts)

        # Store each chunk in ChromaDB with user_id in metadata
        for item, vector in zip(page_chunks, vectors):

            chunk_id = str(uuid.uuid4())

            metadata = {
                "filename": filename,
                "stored_name": stored_name,
                "page": item["page"],
                "document": filename,
                "user_id": user_id,         # ← per-user isolation
            }

            collection.add(
                ids=[chunk_id],
                embeddings=[vector],
                documents=[item["text"]],
                metadatas=[metadata],
            )

            ids.append(chunk_id)

        logger.info(f"Stored {len(ids)} vectors for user={user_id}")
        return ids