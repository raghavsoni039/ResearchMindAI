from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.schemas.compare import CompareRequest, CompareResponse
from app.services.compare_service import CompareService
from app.core.security import get_current_user
from app.core.logger import logger

router = APIRouter(prefix="/compare", tags=["Compare"])


@router.post("", response_model=CompareResponse)
async def compare_papers(
    request: CompareRequest,
    user_id: str = Depends(get_current_user),
):

    try:

        comparison = await CompareService.compare(
            request.filenames,
            user_id=user_id,
        )

        return CompareResponse(comparison=comparison)

    except Exception as e:

        logger.error(f"Compare error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"message": "An internal error occurred. Please try again."},
        )