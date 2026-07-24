# ==============================================================================
# ResearchMind AI — Backend Production Dockerfile (FastAPI + Gunicorn)
# ==============================================================================

FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn uvicorn

# Copy application source code
COPY . .

# Create persistent storage directories
RUN mkdir -p app/uploads chroma_db storage/chat_history

EXPOSE 8000

# Run with Gunicorn using Uvicorn workers for production concurrency
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "-b", "0.0.0.0:8000", "--timeout", "120"]
