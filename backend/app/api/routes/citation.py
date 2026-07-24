from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.schemas.citation import CitationRequest, CitationResponse
from app.services.citation_service import CitationService
from app.core.security import get_current_user
from app.core.logger import logger

router = APIRouter(
    prefix="/citation",
    tags=["Citation"],
)


@router.post("", response_model=CitationResponse)
async def generate(
    request: CitationRequest,
    user_id: str = Depends(get_current_user),
):

    try:

        result = await CitationService.generate(request.filename, user_id=user_id)

        return CitationResponse(
            apa=result["apa"],
            ieee=result["ieee"],
            mla=result["mla"],
            chicago=result["chicago"],
            harvard=result["harvard"],
            bibtex=result["bibtex"],
        )

    except Exception as e:

        logger.error(f"Citation error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"message": "An internal error occurred. Please try again."},
        )