# 📄 AI Resume Analyzer

An AI-powered Streamlit web application that analyzes resumes, matches skills against job descriptions, and compares your resume across multiple roles.

## 🚀 Features
* **Resume Parsing:** Extracts text and skills from PDF and DOCX files.
* **Smart Skill Matching:** Compares your extracted skills with required job skills.
* **Multiple Job Comparison:** Compare your resume against up to 3 different job descriptions at once to find the best fit.
* **AI Recommendations:** Provides actionable suggestions for missing skills.
* **Analysis History:** Automatically saves your past resume reviews in a local SQLite database.

## 🛠️ Tech Stack
* Python
* Streamlit (Frontend Interface)
* SQLite (Database)
* Pandas & Matplotlib (Data Visualization)
* Natural Language Processing (NLP)

## 🏃‍♂️ How to Run Locally
1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Run the app: `streamlit run app.py`

## CI and Continuous Deployment

### Continuous integration

GitHub Actions runs `.github/workflows/ci.yml` on pull requests targeting `main`, pushes to `main`, and manual dispatch. It installs the project dependencies, checks Python syntax, and runs the pytest suite. The current required check is the `build` job.

### Deployment to Streamlit Community Cloud

The live app is hosted on Streamlit Community Cloud. Community Cloud deploys from a connected GitHub repository and automatically updates the app after commits are pushed to its configured branch. For this project, the intended deployment coordinates are `nakshkamra/AI-Resume-Analyzer`, branch `main`, entrypoint `app.py`. Confirm those coordinates in the app settings at [share.streamlit.io](https://share.streamlit.io/) because deployment settings are stored by Streamlit, not in this repository.

The release flow is: open a pull request to `main`, wait for the `build` check to pass, then merge it. The merge updates `main`; Streamlit Community Cloud then detects the commit and redeploys the app. GitHub Actions does not directly deploy to Streamlit Community Cloud, and Community Cloud's automatic update is not gated by the Actions result on its own. To enforce the check before release, configure GitHub branch protection for `main` and require the `build` status check before merging.

For deployment failures, inspect the app's build and runtime logs in the Streamlit Community Cloud workspace.

## Run with Docker

### Prerequisites

- Docker Desktop, or Docker Engine with the Compose plugin.
- Outbound internet access the first time semantic resume matching runs. The app downloads the public `all-MiniLM-L6-v2` model from Hugging Face and keeps it in a Docker volume for later runs.
- No API keys or third-party credentials are used by the current application.

### Start CareerFit

From the repository root, run:

```bash
docker compose up --build
```

Open [http://localhost:8501](http://localhost:8501). Compose binds the app to the local machine only. To run it in the background, add `-d` to the command.

Optional environment overrides can go in `.env`. Start with the example if needed:

```bash
cp .env.example .env
```

`CAREERFIT_DATABASE_PATH` defaults to `/data/resume_analyzer.db` inside the container. The container runs as a non-root user. It does not need API credentials; the first semantic analysis requires internet access to download the model.

### Manage the container

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose up --build
docker compose down
```

`docker compose up --build` rebuilds the image after code or dependency changes. The Compose health check polls Streamlit's `/_stcore/health` endpoint; `docker compose ps` shows whether the service is healthy.

### Persistent data and uploads

Compose uses the named `careerfit_data` volume for SQLite and `careerfit_model_cache` for downloaded model files. Both survive container restarts, rebuilds, and `docker compose down`. `docker compose down --volumes` removes them, including the Docker analysis history and model cache.

The ignored `resume_analyzer.db` in a local checkout is excluded from the image and is not modified by Docker. Docker starts with its own database in the named volume; this keeps local records safe and prevents personal history from being baked into the image. To bring local records into a **new, unused** Docker volume, start the service once so Compose creates its volume, then stop it and copy the database before recording any Docker analyses:

```bash
docker compose up --build -d
docker compose stop careerfit
docker compose cp resume_analyzer.db careerfit:/data/resume_analyzer.db
docker compose start careerfit
```

Do not copy over a volume that already contains Docker analyses; that would replace its database file. Back up the database before any manual migration.

Resume uploads are extracted from temporary files and removed after processing, matching the app's current privacy behavior. The repository's `resumes/` directory contains local sample files and is excluded from the image; it is not an upload store and is not mounted into the running service. Model files are persisted separately so they do not need to be downloaded after each container recreation.

### Troubleshooting

- **Port 8501 is in use:** stop the other service or change the host side of `ports` in `docker-compose.yml` (for example, `127.0.0.1:8502:8501`), then open the corresponding host port.
- **The service is still starting:** check `docker compose logs -f` and `docker compose ps`. Initial imports can take longer on a cold machine.
- **Semantic matching cannot load the model:** confirm outbound network access to Hugging Face; later runs use the persistent model cache.
- **SQLite cannot write:** keep the named volume mounted at `/data`; do not mount a read-only directory or change the database path to a location outside the writable volume.
- **Reset Docker data intentionally:** `docker compose down --volumes` deletes both named volumes. This is irreversible for data stored only in those volumes.
