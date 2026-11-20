import sys
import os
from pathlib import Path
from tempfile import NamedTemporaryFile
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List

# Local imports
from src.parser import extract_text
from src.analyzer import SKILLS, extract_required_skills, generate_recommendations, analyze_resume_quality
from src.database import create_database, get_analysis_history, save_analysis
from interview import generate_questions, evaluate_answers

app = FastAPI(title="CareerFit Pro API")

# Allow only the Vite dev server origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
@app.get("/api/health")
async def health_check():
    """Simple health endpoint used by the frontend and CI."""
    return {"status": "ok"}


def _save_analysis_history(
    resume_name: str,
    job_title: str,
    job_description: str,
    match_score: float | None,
    quality_score: float,
    matched_skills: List[str],
    missing_skills: List[str],
) -> None:
    create_database()
    save_analysis(
        resume_name,
        job_description,
        match_score,
        quality_score,
        matched_skills,
        missing_skills,
        job_title=job_title,
    )


async def _extract_uploaded_text(file: UploadFile) -> str:
    suffix = Path(file.filename or "resume").suffix.lower()
    temporary_path = None
    try:
        with NamedTemporaryFile(delete=False, suffix=suffix) as temporary_file:
            temporary_file.write(await file.read())
            temporary_path = temporary_file.name
        return extract_text(temporary_path)
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    finally:
        if temporary_path:
            Path(temporary_path).unlink(missing_ok=True)

# Helper to extract skills from text using simple keyword matching

def extract_skills_from_text(text: str) -> List[str]:
    lowered = text.lower()
    found = [skill for skill in SKILLS if skill.lower() in lowered]
    return list(set(found))

# Response models
class ResumeAnalysisResponse(BaseModel):
    skills: List[str]
    sections_found: List[str]
    score: int
    suggestions: List[str]

class JobMatchResponse(BaseModel):
    match_percentage: float
    matched_skills: List[str]
    missing_skills: List[str]
    recommendations: List[str]
    explanation: str

class InterviewStartRequest(BaseModel):
    role: str
    difficulty: str
    interview_type: str
    num_questions: int

class InterviewStartResponse(BaseModel):
    questions: List[dict[str, str]]

class InterviewEvaluateRequest(BaseModel):
    answers: List[dict[str, str]]

class InterviewEvaluateResponse(BaseModel):
    results: List[dict[str, object]]

# ------------------- Endpoints -------------------

@app.post("/api/resume/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(file: UploadFile = File(...)):
    # Validate file type
    if not (file.filename.lower().endswith('.pdf') or file.filename.lower().endswith('.docx')):
        raise HTTPException(status_code=400, detail="Unsupported file type. Only PDF and DOCX are accepted.")
    text = await _extract_uploaded_text(file)
    # Analyze
    skills = extract_skills_from_text(text)
    # Detect sections (simple keyword search)
    sections = []
    for sec in ["education", "experience", "projects", "skills"]:
        if sec in text.lower():
            sections.append(sec.title())
    # Use existing resume quality analyzer (returns score and suggestions)
    analysis_result = analyze_resume_quality(text)
    score = analysis_result[0] if isinstance(analysis_result, tuple) else 0
    suggestions = analysis_result[1] if isinstance(analysis_result, tuple) else []
    _save_analysis_history(
        file.filename,
        "Resume analysis",
        "",
        None,
        score,
        skills,
        [],
    )
    return ResumeAnalysisResponse(
        skills=skills,
        sections_found=sections,
        score=score,
        suggestions=suggestions,
    )

@app.post("/api/jobs/match", response_model=JobMatchResponse)
async def match_job(resume_file: UploadFile = File(...), job_description: str = Form(...)):
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")
    if not (resume_file.filename.lower().endswith('.pdf') or resume_file.filename.lower().endswith('.docx')):
        raise HTTPException(status_code=400, detail="Unsupported resume file type.")
    resume_text = await _extract_uploaded_text(resume_file)
    resume_skills = set(extract_skills_from_text(resume_text))
    required_skills = set(extract_required_skills(job_description))
    if not required_skills:
        raise HTTPException(
            status_code=400,
            detail="No supported skills found in the job description. Please include skills such as Python, Java, or SQL.",
        )
    matched = list(resume_skills.intersection(required_skills))
    missing = list(required_skills.difference(resume_skills))
    match_percentage = round(len(matched) / len(required_skills) * 100, 2) if required_skills else 100.0
    recommendations = generate_recommendations(missing)
    explanation = f"Your resume contains {len(matched)} of {len(required_skills)} required skills."
    quality_score, _ = analyze_resume_quality(resume_text)
    _save_analysis_history(
        resume_file.filename,
        "Job match",
        job_description,
        match_percentage,
        quality_score,
        matched,
        missing,
    )
    return JobMatchResponse(
        match_percentage=match_percentage,
        matched_skills=matched,
        missing_skills=missing,
        recommendations=recommendations,
        explanation=explanation,
    )

@app.post("/api/interview/start", response_model=InterviewStartResponse)
async def start_interview(request: InterviewStartRequest):
    questions = generate_questions(
        request.role,
        request.difficulty,
        request.interview_type,
        max(1, min(request.num_questions, 10)),
    )
    if not questions:
        raise HTTPException(status_code=400, detail="No questions are available for that role and interview setup.")
    return {"questions": questions}

@app.post("/api/interview/evaluate", response_model=InterviewEvaluateResponse)
async def evaluate_interview(request: InterviewEvaluateRequest):
    return {"results": evaluate_answers(request.answers)}


@app.get("/api/history")
async def analysis_history():
    create_database()
    return [
        {
            "id": row[0],
            "resume_name": row[1] or "Resume",
            "job_title": row[2] or "Resume analysis",
            "match_score": row[3],
            "quality_score": row[4],
            "matched_skills": [item for item in (row[5] or "").split(", ") if item],
            "missing_skills": [item for item in (row[6] or "").split(", ") if item],
            "analyzed_at": row[7],
        }
        for row in get_analysis_history()
    ]


FRONTEND_DIST = Path(__file__).resolve().parents[2] / "frontend" / "dist"
if FRONTEND_DIST.is_dir():
    assets_path = FRONTEND_DIST / "assets"
    if assets_path.is_dir():
        app.mount("/assets", StaticFiles(directory=assets_path), name="frontend-assets")

    @app.get("/{frontend_path:path}", include_in_schema=False)
    async def serve_frontend(frontend_path: str):
        if frontend_path.startswith("api/") or frontend_path in {"health", "docs", "openapi.json"}:
            raise HTTPException(status_code=404, detail="Not found")
        requested_file = (FRONTEND_DIST / frontend_path).resolve()
        if requested_file.is_relative_to(FRONTEND_DIST.resolve()) and requested_file.is_file():
            return FileResponse(requested_file)
        return FileResponse(FRONTEND_DIST / "index.html")

    @app.get("/", include_in_schema=False)
    async def serve_frontend_root():
        return FileResponse(FRONTEND_DIST / "index.html")
