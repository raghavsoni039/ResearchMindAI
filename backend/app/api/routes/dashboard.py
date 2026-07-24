from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.services.dashboard_service import DashboardService
from app.core.security import get_current_user
from app.core.logger import logger

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("")
async def dashboard(user_id: str = Depends(get_current_user)):

    try:

        return DashboardService.get_statistics(user_id=user_id)

    except Exception as e:

        logger.error(f"Dashboard error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"message": "An internal error occurred."},
        )