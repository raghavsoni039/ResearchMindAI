from datetime import datetime

from app.services.memory_service import MemoryService
from app.services.retrieval_service import RetrievalService
from app.services.gemini_service import GeminiService
from app.services.chat_history_service import ChatHistoryService


class ChatService:

    @staticmethod
    async def chat(session_id: str, question: str, user_id: str = "guest"):

        # -----------------------------
        # Load previous memory
        # -----------------------------

        history = MemoryService.get_history(session_id)

        # -----------------------------
        # Retrieve relevant chunks (scoped to this user)
        # -----------------------------

        chunks = RetrievalService.retrieve(question, user_id=user_id)

        context = "\n\n".join(
            chunk["text"]
            for chunk in chunks
        )

        # -----------------------------
        # Generate AI Response
        # -----------------------------

        answer = await GeminiService.generate_answer(
            question=question,
            context=context,
            history=history,
        )

        # -----------------------------
        # Save to Memory
        # -----------------------------

        MemoryService.add_message(
            session_id=session_id,
            role="user",
            message=question,
        )

        MemoryService.add_message(
            session_id=session_id,
            role="assistant",
            message=answer,
        )

        # -----------------------------
        # Build Source List
        # -----------------------------

        sources = list(
            dict.fromkeys(
                f'{chunk["filename"]} (Page {chunk["page"]})'
                for chunk in chunks
            )
        )

        # -----------------------------
        # Save Conversation Permanently
        # -----------------------------

        ChatHistoryService.save_message(
            session_id=session_id,
            role="user",
            message=question,
            user_id=user_id,
        )

        ChatHistoryService.save_message(
            session_id=session_id,
            role="assistant",
            message=answer,
            sources=sources,
            user_id=user_id,
        )

        # -----------------------------
        # Rename New Chat Automatically
        # -----------------------------

        try:

            session = ChatHistoryService.get_session(session_id, user_id)

            if session["title"] == "New Chat":

                title = question.strip()

                if len(title) > 40:
                    title = title[:40] + "..."

                ChatHistoryService.rename_session(
                    session_id,
                    title,
                    user_id=user_id,
                )

        except Exception:
            pass

        # -----------------------------
        # Return Response
        # -----------------------------

        return {

            "answer": answer,

            "sources": sources,

            "timestamp": datetime.now().isoformat(),

            "session_id": session_id,

        }