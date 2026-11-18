FROM python:3.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    CAREERFIT_DATABASE_PATH=/data/resume_analyzer.db \
    HF_HOME=/models \
    HF_HUB_CACHE=/models/hub

WORKDIR /app

COPY requirements.txt ./requirements.txt
RUN python -m pip install --no-cache-dir --upgrade pip \
    && python -m pip install --no-cache-dir \
        --index-url https://download.pytorch.org/whl/cpu \
        --extra-index-url https://pypi.org/simple \
        "torch==2.13.0+cpu" \
    && python -m pip install --no-cache-dir -r requirements.txt

COPY app.py ./app.py
COPY src/ ./src/
COPY .streamlit/ ./.streamlit/

RUN groupadd --system careerfit \
    && useradd --system --gid careerfit --create-home --home-dir /home/careerfit careerfit \
    && mkdir -p /data /models \
    && chown -R careerfit:careerfit /app /data /models /home/careerfit

USER careerfit

EXPOSE 8501

CMD ["streamlit", "run", "app.py", "--server.address=0.0.0.0", "--server.port=8501", "--server.headless=true"]
