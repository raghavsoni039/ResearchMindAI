# Maximum number of messages retained per session (user + assistant pairs).
# Prevents unbounded RAM growth and limits token cost per request.
MAX_HISTORY_MESSAGES = 20


class MemoryService:

    conversations: dict[str, list] = {}

    @classmethod
    def get_history(cls, session_id: str) -> list:
        return cls.conversations.get(session_id, [])

    @classmethod
    def add_message(cls, session_id: str, role: str, message: str) -> None:

        if session_id not in cls.conversations:
            cls.conversations[session_id] = []

        cls.conversations[session_id].append({
            "role": role,
            "message": message,
        })

        # Trim to last MAX_HISTORY_MESSAGES to prevent unbounded growth
        if len(cls.conversations[session_id]) > MAX_HISTORY_MESSAGES:
            cls.conversations[session_id] = (
                cls.conversations[session_id][-MAX_HISTORY_MESSAGES:]
            )

    @classmethod
    def clear_session(cls, session_id: str) -> None:
        """Remove a session from in-memory store (e.g. on explicit delete)."""
        cls.conversations.pop(session_id, None)