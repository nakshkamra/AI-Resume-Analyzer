import sqlite3
from datetime import datetime


DATABASE = "resume_analyzer.db"


def create_database():

    connection = sqlite3.connect(DATABASE)

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            resume_name TEXT,
            job_description TEXT,
            match_score REAL,
            quality_score REAL,
            matched_skills TEXT,
            missing_skills TEXT,
            analyzed_at TEXT
        )
    """)

    connection.commit()
    connection.close()


def save_analysis(
    resume_name,
    job_description,
    match_score,
    quality_score,
    matched_skills,
    missing_skills
):

    connection = sqlite3.connect(DATABASE)

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO analyses (
            resume_name,
            job_description,
            match_score,
            quality_score,
            matched_skills,
            missing_skills,
            analyzed_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        resume_name,
        job_description,
        match_score,
        quality_score,
        ", ".join(matched_skills),
        ", ".join(missing_skills),
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))

    connection.commit()
    connection.close()


def get_analysis_history():

    connection = sqlite3.connect(DATABASE)

    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            id,
            resume_name,
            match_score,
            quality_score,
            matched_skills,
            missing_skills,
            analyzed_at
        FROM analyses
        ORDER BY id DESC
    """)

    results = cursor.fetchall()

    connection.close()

    return results