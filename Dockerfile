FROM node:22-bookworm-slim AS frontend-build
WORKDIR /build/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim-bookworm AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    CAREERFIT_DATABASE_PATH=/data/resume_analyzer.db

WORKDIR /app
COPY backend/requirements.txt ./backend/requirements.txt
RUN python -m pip install --no-cache-dir --upgrade pip \
    && python -m pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ ./backend/
COPY src/ ./src/
COPY --from=frontend-build /build/frontend/dist ./frontend/dist

RUN groupadd --system careerfit \
    && useradd --system --gid careerfit --create-home --home-dir /home/careerfit careerfit \
    && mkdir -p /data \
    && chown -R careerfit:careerfit /app /data /home/careerfit

USER careerfit

EXPOSE 8501
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8501"]
