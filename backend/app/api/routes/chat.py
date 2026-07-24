from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService
from app.services.chat_history_service import ChatHistoryService
from app.core.security import get_current_user, validate_question
from app.core.logger import logger

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    user_id: str = Depends(get_current_user),
):

    try:

        safe_question = validate_question(request.question)

        logger.info(f"Chat request | session={request.session_id} | user={user_id}")

        result = await ChatService.chat(
            request.session_id,
            safe_question,
            user_id=user_id,
        )

        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"],
        )

    except Exception as e:

        logger.error(f"Chat error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "An internal error occurred. Please try again.",
            },
        )


@router.post("/new")
async def create_chat(user_id: str = Depends(get_current_user)):

    try:

        session = ChatHistoryService.create_session(user_id=user_id)

        logger.info(f"Created session: {session['id']} for user={user_id}")

        return {
            "success": True,
            "session": session,
        }

    except Exception as e:

        logger.error(f"Create chat error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "An internal error occurred."},
        )


@router.get("/sessions")
async def get_chat_sessions(user_id: str = Depends(get_current_user)):

    try:

        return {
            "success": True,
            "sessions": ChatHistoryService.get_sessions(user_id=user_id),
        }

    except Exception as e:

        logger.error(f"Get sessions error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "An internal error occurred."},
        )


@router.get("/{session_id}")
async def get_chat(
    session_id: str,
    user_id: str = Depends(get_current_user),
):

    try:

        return {
            "success": True,
            "session": ChatHistoryService.get_session(session_id, user_id=user_id),
        }

    except Exception as e:

        logger.error(f"Load chat error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "An internal error occurred."},
        )


@router.delete("/{session_id}")
async def delete_chat(
    session_id: str,
    user_id: str = Depends(get_current_user),
):

    try:

        ChatHistoryService.delete_session(session_id, user_id=user_id)

        return {"success": True}

    except Exception as e:

        logger.error(f"Delete chat error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "An internal error occurred."},
        )


@router.put("/{session_id}/rename")
async def rename_chat(
    session_id: str,
    title: str,
    user_id: str = Depends(get_current_user),
):

    try:

        ChatHistoryService.rename_session(session_id, title, user_id=user_id)

        return {"success": True}

    except Exception as e:

        logger.error(f"Rename chat error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "An internal error occurred."},
        )