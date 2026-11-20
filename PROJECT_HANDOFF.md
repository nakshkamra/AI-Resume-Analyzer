# CareerFit Project Handoff

Updated: 2026-11-19

## What this project is

CareerFit Pro is a resume review and role matching app. The current app is a **React + Vite frontend** connected to a **FastAPI Python backend**, with SQLite used for analysis history. There is also a legacy Streamlit application in the same repository, which is why starting `app.py` with Streamlit shows an older interface.

The current backend uses deterministic resume quality scoring and keyword/skill matching. It does not call an LLM or require an AI API key.

## Repository layout

- `frontend/`: React 18, TypeScript, Vite, Tailwind and React Router UI. Its actual dependency lockfile is `frontend/package-lock.json`.
- `backend/app/main.py`: FastAPI application, upload endpoints, health endpoints, history API, and production serving for built React assets.
- `backend/requirements.txt`: API and backend test dependencies.
- `src/parser.py`: PDF/DOCX text extraction.
- `src/analyzer.py`: skill extraction, resume quality scoring, and job matching helpers.
- `src/database.py`: SQLite schema, saved analysis records, and history queries. `CAREERFIT_DATABASE_PATH` can override the default database path.
- `app.py`, `src/ui.py`, `.streamlit/`: older Streamlit interface. `python3 -m streamlit run app.py` deliberately still launches that legacy UI.
- `Dockerfile`, `docker-compose.yml`: intended production container; frontend assets are built and served by FastAPI on port 8501.
- `tests/`: legacy Python tests. `backend/tests/`: FastAPI endpoint tests.
- `.github/workflows/ci.yml`: Python syntax/tests, frontend build, and Docker image build/publish workflow.

## Current frontend routes

- `/`: landing page
- `/dashboard`: app dashboard and navigation
- `/resume-analyzer`: upload a PDF/DOCX and review its skills, quality score, and suggestions
- `/job-matcher`: compare a PDF/DOCX resume with one job description
- `/analysis-history`: saved resume analyses and role matches
- `/resume-builder`: resume builder
- `/video-academy`, `/interview-coach`, `/career-roadmap`, `/settings`: routes exist, but several are placeholder pages marked “Feature coming soon.”

## Correct local startup

Run from the repository root. Use two terminal windows.

### Terminal 1: FastAPI

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

### Terminal 2: Vite frontend

```bash
cd frontend
npm ci
npm run dev
```

Open **http://localhost:3000**. Vite proxies `/api/*` to FastAPI at port 8000. The backend health endpoints are `/health` and `/api/health`; API docs are at `http://localhost:8000/docs`.

Do not use `python3 -m streamlit run app.py` when you want the current React UI. For the production-style Docker setup, use `docker compose up --build` from the root and open **http://localhost:8501**.

## API endpoints

- `GET /health`, `GET /api/health`: service status
- `POST /api/resume/analyze`: multipart field `file`; accepts PDF/DOCX; returns skills, sections, quality score, and suggestions; saves a history row
- `POST /api/jobs/match`: multipart fields `resume_file` and `job_description`; accepts PDF/DOCX; returns match percentage, matched/missing skills, and recommendations; saves a history row
- `GET /api/history`: saved analysis and job-match records

Uploads are copied to a temporary file for parsing, then removed. History is local SQLite data.

## Recent local integration changes

The following changes were made to resolve the old-UI/startup confusion and connect the current UI to its backend:

- Updated `README.md` with the two-terminal React/FastAPI launch and Docker instructions; documented Streamlit as legacy.
- Updated `Dockerfile` and Compose health check for FastAPI serving the built React app.
- Connected the Dashboard health check by adding the `/api/health` alias.
- Added safe temporary-file handling for uploaded resumes, SQLite history writes from both analysis endpoints, and `GET /api/history`.
- Added the React Analysis History route/page and dashboard navigation link.
- Changed React upload pickers/messages to accept PDF and DOCX, matching backend support.
- Fixed invalid syntax in `backend/list_routes.py` so backend Python compilation succeeds.
- Removed duplicate dependency keys from `frontend/package.json`. Deleted the empty root `package-lock.json`; the real lockfile is under `frontend/`.
- Updated CI to run legacy tests, backend API tests, Python compilation, and the frontend build before building the Docker image.

## Feature-page design update (2026-11-20)

The follow-up UI redesign request covered feature pages only and explicitly required the existing Dashboard to stay unchanged. The dashboard component was not edited for this redesign; its earlier local history-navigation changes remain as they were.

- Added shared, feature-scoped UI pieces in `frontend/src/components/FeatureShell.tsx` and `ResumeDropzone.tsx`, plus responsive CareerFit styles in `frontend/src/index.css`.
- Redesigned Resume Analyzer and Job Matcher while retaining their existing `/api/resume/analyze` and `/api/jobs/match` requests and expected response fields. Resume selection supports PDF/DOCX by picker and drag/drop; the app currently has no configured upload size limit.
- Redesigned Analysis History with client-side search/filtering and expandable details using the existing `/api/history` payload.
- Redesigned Resume Builder while retaining its existing localStorage persistence, three templates, section add/remove/reorder controls, live preview, and print/save-as-PDF flow.
- Replaced placeholder UI for Video Academy, Interview Coach, and Career Roadmap with polished, clearly labeled previews. They do not fabricate course data, interview responses, or a personalized roadmap; those functions are still unimplemented.
- Redesigned Settings and connected the appearance choice to the existing shared light/dark theme state. Profile, notification, and account management are explicitly shown as unavailable because no such backend settings exist.
- Feature page changes did not alter API routes or backend behavior.

Verification after the UI update: `npm run build` passed; backend endpoint tests remained 3/3; Python compile, `git diff --check`, and `docker compose config --quiet` passed. FastAPI TestClient served all 10 built app routes and an asset, then accepted a synthetic DOCX analysis and job match and returned the two corresponding history rows. Browser-based visual/responsive inspection was unavailable in the chat environment, so rendered appearance still needs a manual browser pass.

## Verification performed

- `npm ci` and `npm run build` in `frontend/`: passed.
- `python3 -m pytest -q tests` from the repository root: 4 passed.
- `python3 -m pytest -q tests` from `backend/`: 3 passed.
- `python3 -m compileall -q app.py backend src`: passed.
- `git diff --check`: passed.
- `docker compose config --quiet`: passed.
- Browser check at Vite: Dashboard rendered, backend health showed reachable, dashboard-to-history navigation worked, and history displayed saved synthetic analysis/match records.
- API checks with synthetic PDF and DOCX resumes: analysis uploads passed, a role comparison returned a match score, and history returned the saved records.
- Browser console had no errors; it did report React Router future-version notices. Python output included a PyMuPDF `fitz` deprecation notice.

### Verification limits

- A Chrome extension setting prevented the Codex browser automation from selecting a local file through the page's file chooser. API upload requests were tested with synthetic PDF/DOCX files; a normal user can test file selection directly in their browser.
- Docker Compose configuration passed, but the local Docker image build was **not** verified: Docker Buildx could not write its activity metadata in the sandbox, and the escalated Docker environment did not expose the Compose plugin.
- `npm ci` reported 4 npm audit findings (3 moderate, 1 high). They were not auto-fixed.

## Git/worktree status at handoff

- Repository: `https://github.com/nakshkamra/AI-Resume-Analyzer.git`
- Branch: `professional-resume-ui`
- HEAD: `b93ef27` (`Merge pull request #8 from nakshkamra/feature/careerfit-pro`), also `origin/main` at inspection time.
- The integration changes listed above are **local and uncommitted**; they have not been pushed.
- `git status` also showed untracked `.agents/` and `.DS_Store`. Treat these as local files and do not stage them without inspecting/asking.
- Before committing or pushing, review `git status` and the full diff. The root `package-lock.json` deletion is intentional; `frontend/package-lock.json` is the maintained lockfile.

## Suggested next steps for the next chat

1. Recheck `git status`, branch, and remote before editing or committing.
2. Review the local integration diff and decide whether to commit/push it; do not stage `.agents/` or `.DS_Store` blindly.
3. If production container verification is needed, build/run with a Docker environment that has a working Compose/Buildx setup.
4. Consider addressing the npm audit findings and React Router/PyMuPDF deprecations separately.
5. If the goal changes from fixing startup to further product polish, first identify which placeholder routes are in scope; do not assume every dashboard tool is implemented.
