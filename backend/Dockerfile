# ==============================================================================
# ResearchMind AI — Fast Backend Production Dockerfile (FastAPI + Gunicorn)
# ==============================================================================

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Cache pip layer — pre-compiled wheels for ultra-fast installs
COPY requirements.txt .
RUN pip install --no-cache-dir --prefer-binary -r requirements.txt gunicorn uvicorn

# Copy app code (takes ~1 sec)
COPY . .

RUN mkdir -p app/uploads chroma_db storage/chat_history

EXPOSE 8000

CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "-b", "0.0.0.0:8000", "--timeout", "120"]
