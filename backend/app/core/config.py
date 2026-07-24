from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application configuration loaded from .env
    """

    # =========================
    # Google Gemini
    # =========================
    GOOGLE_API_KEY: str
    MODEL_NAME: str = "gemini-3.5-flash"

    # =========================
    # LLM Configuration
    # =========================
    TEMPERATURE: float = 0.2
    MAX_OUTPUT_TOKENS: int = 4096

    # =========================
    # File Upload Configuration
    # =========================
    UPLOAD_DIR: str = "app/uploads"
    MAX_FILE_SIZE: int = 50

    # =========================
    # Vector Database
    # =========================
    CHROMA_DB_PATH: str = "./chroma_db"

    # =========================
    # Application
    # =========================
    APP_NAME: str = "ResearchMind AI"
    APP_VERSION: str = "1.0.0"

    # =========================
    # Security
    # =========================
    # Set to a strong random string in production (openssl rand -hex 32).
    # Leave empty string to disable auth in local development.
    API_SECRET_KEY: str = ""

    # Comma-separated allowed origins for CORS in production.
    # Example: "https://researchmind.ai,https://www.researchmind.ai"
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # Auth.js / NextAuth JWT secret — must match AUTH_SECRET in frontend .env.local
    # Used to verify JWTs issued by the Next.js Auth.js session.
    AUTH_SECRET: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()