print("[Backend] MAIN.PY LOADED")
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.logger import logger

from app.api.routes.health import router as health_router
from app.api.routes.test import router as test_router
from app.api.routes.documents import router as document_router
from app.api.routes.chat import router as chat_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.summary import router as summary_router
from app.api.routes.compare import router as compare_router
from app.api.routes.citation import router as citation_router
from app.api.routes.export import router as export_router
from app.api.routes.converter import router as converter_router


# --------------------------
# Rate Limiter
# --------------------------

limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

# --------------------------
# App
# --------------------------

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Agentic AI Research Assistant",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# --------------------------
# CORS
# --------------------------

# Origins are loaded from ALLOWED_ORIGINS env var (comma-separated).
# Default: localhost only. In production set the real domain in .env.
allowed_origins = [
    origin.strip()
    for origin in settings.ALLOWED_ORIGINS.split(",")
    if origin.strip()
]

logger.info(f"CORS allowed origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------
# Routes
# --------------------------

app.include_router(health_router)
app.include_router(test_router)
app.include_router(document_router)
app.include_router(chat_router)
app.include_router(dashboard_router)
app.include_router(summary_router)
app.include_router(compare_router)
app.include_router(citation_router)
app.include_router(export_router)
app.include_router(converter_router)

# --------------------------
# Root
# --------------------------

@app.get("/")
async def root():

    logger.info("Root endpoint accessed.")

    return {
        "message": f"{settings.APP_NAME} Backend Running 🚀"
    }