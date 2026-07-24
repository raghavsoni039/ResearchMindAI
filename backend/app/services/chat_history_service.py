import json
import uuid
from pathlib import Path

from app.core.logger import logger

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Chat history is now stored per-user:  storage/chat_history/{user_id}/{session_id}.json
CHAT_BASE = BASE_DIR / "storage" / "chat_history"
CHAT_BASE.mkdir(parents=True, exist_ok=True)


def _user_folder(user_id: str) -> Path:
    """Return (and create if needed) the per-user chat folder."""
    folder = CHAT_BASE / user_id
    folder.mkdir(parents=True, exist_ok=True)
    return folder


class ChatHistoryService:

    @staticmethod
    def get_sessions(user_id: str = "guest"):

        folder = _user_folder(user_id)
        sessions = []

        for file in folder.glob("*.json"):

            try:
                with open(file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    sessions.append({
                        "id": data["id"],
                        "title": data["title"],
                    })
            except Exception as e:
                logger.warning(f"Skipping corrupt session file {file}: {e}")

        return sessions

    @staticmethod
    def create_session(user_id: str = "guest"):

        session_id = str(uuid.uuid4())

        data = {
            "id": session_id,
            "title": "New Chat",
            "messages": [],
        }

        path = _user_folder(user_id) / f"{session_id}.json"

        logger.info(f"Creating session {session_id} for user={user_id}")

        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        return data

    @staticmethod
    def get_session(session_id: str, user_id: str = "guest"):

        path = _user_folder(user_id) / f"{session_id}.json"

        if not path.exists():
            raise Exception("Chat session not found.")

        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    @staticmethod
    def save_message(
        session_id: str,
        role: str,
        message: str,
        sources=None,
        user_id: str = "guest",
    ):

        if sources is None:
            sources = []

        path = _user_folder(user_id) / f"{session_id}.json"

        if not path.exists():
            raise Exception(f"Chat session not found. ({path})")

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        data["messages"].append({
            "role": role,
            "message": message,
            "sources": sources,
        })

        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

    @staticmethod
    def rename_session(session_id: str, title: str, user_id: str = "guest"):

        path = _user_folder(user_id) / f"{session_id}.json"

        if not path.exists():
            raise Exception("Chat session not found.")

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        data["title"] = title

        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

    @staticmethod
    def delete_session(session_id: str, user_id: str = "guest"):

        path = _user_folder(user_id) / f"{session_id}.json"

        if path.exists():
            path.unlink()
            return {"success": True}

        return {"success": False}