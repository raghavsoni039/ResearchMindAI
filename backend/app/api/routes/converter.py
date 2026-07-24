from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse, JSONResponse

from app.schemas.converter import ConvertRequest
from app.services.converter_service import ConverterService
from app.core.security import get_current_user
from app.core.logger import logger

router = APIRouter(
    prefix="/convert",
    tags=["Document Converter"],
)


@router.post("")
async def convert_document(
    request: ConvertRequest,
    user_id: str = Depends(get_current_user),
):

    try:

        filepath = ConverterService.convert(
            filename=request.filename,
            export_format=request.format,
            user_id=user_id,
        )

        return FileResponse(
            path=filepath,
            filename=filepath.split("\\")[-1],
            media_type="application/octet-stream",
        )

    except Exception as e:

        logger.error(f"Converter error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"message": "An internal error occurred. Please try again."},
        )