import os
import sqlite3
from datetime import datetime
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATABASE = os.environ.get(
    "CAREERFIT_DATABASE_PATH",
    str(PROJECT_ROOT / "resume_analyzer.db"),
)


def create_database():
    Path(DATABASE).parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DATABASE) as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                resume_name TEXT,
                job_description TEXT,
                match_score REAL,
                quality_score REAL,
                matched_skills TEXT,
                missing_skills TEXT,
                analyzed_at TEXT,
                job_title TEXT
            )
        """)

        # Additive migration keeps existing analysis rows intact.
        columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(analyses)").fetchall()
        }
        if "job_title" not in columns:
            connection.execute("ALTER TABLE analyses ADD COLUMN job_title TEXT")


def save_analysis(
    resume_name,
    job_description,
    match_score,
    quality_score,
    matched_skills,
    missing_skills,
    job_title=None,
):
    with sqlite3.connect(DATABASE) as connection:
        connection.execute("""
            INSERT INTO analyses (
                resume_name,
                job_description,
                match_score,
                quality_score,
                matched_skills,
                missing_skills,
                analyzed_at,
                job_title
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            resume_name,
            job_description,
            match_score,
            quality_score,
            ", ".join(matched_skills),
            ", ".join(missing_skills),
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            job_title,
        ))


def get_analysis_history():
    with sqlite3.connect(DATABASE) as connection:
        columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(analyses)").fetchall()
        }
        title_column = "job_title" if "job_title" in columns else "NULL AS job_title"
        return connection.execute(f"""
            SELECT
                id,
                resume_name,
                {title_column},
                match_score,
                quality_score,
                matched_skills,
                missing_skills,
                analyzed_at
            FROM analyses
            ORDER BY id DESC
        """).fetchall()
