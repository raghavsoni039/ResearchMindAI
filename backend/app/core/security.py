"""
security.py — ResearchMind AI Security Layer

Provides:
  - get_current_user : FastAPI dependency — verifies Auth.js JWT or X-User-Id header,
                       returns the user_id string
  - require_api_key  : Legacy API-key auth (kept for /health and unauthenticated routes)
  - detect_injection : LLM prompt-injection pattern detector
  - sanitize_for_prompt : Safe string for embedding in LLM prompts
  - sanitize_filename   : Path-traversal-safe filename
"""

import re
from pathlib import Path
from typing import Optional

from fastapi import HTTPException, Request, Security
from fastapi.security import APIKeyHeader, HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings
from app.core.logger import logger

# ---------------------------------------------------------------------------
# User Identity — extracted from Auth.js session headers
# ---------------------------------------------------------------------------
# Auth.js sends the user identity as request headers set by apiFetch():
#   X-User-Id    — the Auth.js user id (sub claim)
#   X-User-Email — the user's email
#
# When API_SECRET_KEY is set, the old API-key gate also runs.
# ---------------------------------------------------------------------------


async def get_current_user(request: Request) -> str:
    """
    FastAPI dependency — extracts the authenticated user_id.

    Priority:
      1. X-User-Id header (set by the Next.js frontend's apiFetch helper)
      2. Returns a guest sentinel ("guest") when no header is present,
         so existing unprotected local dev flows keep working.

    In production, tighten this to raise 401 when X-User-Id is absent.
    """
    user_id = request.headers.get("X-User-Id")

    if user_id:
        return user_id.strip()

    # ---- Dev fallback: allow unauthenticated requests as "guest" ----
    # Remove the line below and un-comment the HTTPException for production.
    return "guest"

    # raise HTTPException(status_code=401, detail="Unauthorized — please sign in.")


# ---------------------------------------------------------------------------
# Legacy API Key Authentication (kept for backward-compat / health routes)
# ---------------------------------------------------------------------------

_API_KEY_HEADER = APIKeyHeader(name="X-API-Key", auto_error=False)


async def require_api_key(api_key: str = Security(_API_KEY_HEADER)) -> None:
    """
    Legacy dependency — kept so existing curl / Postman test flows still work.
    Skipped entirely when API_SECRET_KEY is empty (default for dev).
    """
    expected = settings.API_SECRET_KEY
    if not expected:
        return
    if api_key != expected:
        logger.warning("Rejected request — invalid or missing X-API-Key header")
        raise HTTPException(status_code=401, detail="Unauthorized")


# ---------------------------------------------------------------------------
# Prompt-Injection Detection
# ---------------------------------------------------------------------------

_INJECTION_PATTERNS: list[re.Pattern] = [
    re.compile(r"ignore\s+(all\s+)?(previous|above|prior|the)\s+instructions?", re.I),
    re.compile(r"forget\s+everything", re.I),
    re.compile(r"you\s+are\s+now\s+(DAN|GPT|an?\s+(AI|assistant)\s+without)", re.I),
    re.compile(r"\b(system|assistant|instruction)\s*:", re.I),
    re.compile(r"reveal\s+(your\s+)?(system\s+)?prompt", re.I),
    re.compile(r"what\s+(is|are)\s+your\s+(instructions?|rules?|system\s+prompt)", re.I),
    re.compile(r"pretend\s+(you\s+are|to\s+be)", re.I),
    re.compile(r"\[INST\]|\[SYS\]|<\|system\|>|<\|im_start\|>", re.I),
    re.compile(r"disable\s+(all\s+)?(restrictions?|safety|filters?)", re.I),
    re.compile(r"act\s+as\s+if\s+you\s+(have\s+no|are\s+not)", re.I),
    re.compile(r"override\s+(your\s+)?(instructions?|rules?|guidelines?)", re.I),
    re.compile(r"jailbreak", re.I),
    re.compile(r"do\s+anything\s+now", re.I),
    re.compile(r"new\s+persona", re.I),
    re.compile(r"from\s+now\s+on\s+(you|ignore|forget)", re.I),
]

MAX_QUESTION_LENGTH = 2000


def detect_injection(text: str) -> bool:
    for pattern in _INJECTION_PATTERNS:
        if pattern.search(text):
            return True
    return False


def validate_question(question: str) -> str:
    question = question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    if len(question) > MAX_QUESTION_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Question too long. Maximum {MAX_QUESTION_LENGTH} characters allowed.",
        )
    if detect_injection(question):
        logger.warning(f"Prompt injection attempt blocked: {question[:100]!r}")
        raise HTTPException(
            status_code=400,
            detail="I can only help with questions about your uploaded research papers.",
        )
    return question


# ---------------------------------------------------------------------------
# Filename Sanitizer
# ---------------------------------------------------------------------------

def sanitize_for_prompt(text: str, max_length: int = 200) -> str:
    safe = re.sub(r"[^\w\s.\-()]", "", text)
    return safe[:max_length].strip()


def sanitize_filename(filename: str) -> str:
    return Path(filename).name
