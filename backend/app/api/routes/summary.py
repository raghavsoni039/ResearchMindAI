from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.schemas.summary import SummaryRequest, SummaryResponse
from app.services.summary_service import SummaryService
from app.core.security import get_current_user
from app.core.logger import logger

router = APIRouter(prefix="/summary", tags=["Summary"])


@router.post("", response_model=SummaryResponse)
async def generate_summary(
    request: SummaryRequest,
    user_id: str = Depends(get_current_user),
):

    try:

        summary = await SummaryService.generate_summary(
            request.filename,
            user_id=user_id,
        )

        return SummaryResponse(summary=summary)

    except Exception as e:

        logger.error(f"Summary error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"message": "An internal error occurred. Please try again."},
        )