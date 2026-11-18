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
