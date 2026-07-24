import os

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse, JSONResponse

from app.schemas.export import ExportRequest
from app.services.export_service import ExportService
from app.core.security import require_api_key
from app.core.logger import logger

router = APIRouter(
    prefix="/export",
    tags=["Export"],
    dependencies=[Depends(require_api_key)],
)


@router.post("")
async def export_file(request: ExportRequest):

    try:

        filepath = ExportService.export(
            request.title,
            request.content,
            request.format,
        )

        return FileResponse(
            filepath,
            filename=os.path.basename(filepath),
            media_type="application/octet-stream",
        )

    except Exception as e:

        logger.error(f"Export error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"message": "An internal error occurred. Please try again."},
        )