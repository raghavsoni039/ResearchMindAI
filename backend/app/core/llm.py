from app.core.config import settings
from app.core.logger import logger
from langchain_google_genai import ChatGoogleGenerativeAI


def create_llm():
    try:
        logger.info(f"Initializing Gemini Model: {settings.MODEL_NAME}")

        llm = ChatGoogleGenerativeAI(
            model=settings.MODEL_NAME,
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=settings.TEMPERATURE,
            max_output_tokens=settings.MAX_OUTPUT_TOKENS,
        )

        logger.info("Gemini initialized successfully.")

        return llm

    except Exception as e:
        logger.exception(f"Gemini initialization failed: {e}")
        raise


llm = create_llm()