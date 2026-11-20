# CareerFit Pro

CareerFit Pro is a React/Vite career app backed by a FastAPI service. The React frontend provides resume analysis, job matching, a resume builder, and analysis history. The Python service handles PDF/DOCX parsing, skill matching, quality scoring, and SQLite history.

## Run locally for development

Run these from the repository root in separate terminals.

### 1. Start the API

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

### 2. Start the React app

```bash
cd frontend
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Vite forwards `/api` requests to the FastAPI service on port 8000. The API health endpoint is [http://localhost:8000/health](http://localhost:8000/health).

## Run the production app with Docker

From the repository root:

```bash
docker compose up --build
```

Open [http://localhost:8501](http://localhost:8501). The container builds the React assets and serves them with FastAPI. The SQLite database is stored in the persistent `careerfit_data` volume. Stop the app with `docker compose down`; `docker compose down --volumes` also deletes saved history.

## Legacy Streamlit entry point

`app.py` is retained as the previous Streamlit interface and is not the current React app. Running `python3 -m streamlit run app.py` opens that legacy interface on port 8501. Use the two local development commands above to see the current React/Vite application.

## Tests and CI

GitHub Actions runs the legacy unit tests, backend API tests, Python syntax compilation, React production build, and Docker image build. To run the tests locally:

```bash
python -m pip install -r backend/requirements.txt
python -m pytest -v tests
cd backend && python -m pytest -v tests
cd ../frontend && npm ci && npm run build
```

Uploaded files are processed from temporary files and removed after parsing. Analysis history is local SQLite data; configure `CAREERFIT_DATABASE_PATH` to change its location.
