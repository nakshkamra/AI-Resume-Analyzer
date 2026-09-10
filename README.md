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