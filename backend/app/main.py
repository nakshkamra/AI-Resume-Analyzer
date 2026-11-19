import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# Local imports
from src.parser import extract_text
from src.analyzer import SKILLS, extract_required_skills, generate_recommendations, analyze_resume_quality

app = FastAPI(title="CareerFit Pro API")

# Allow only the Vite dev server origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Simple health endpoint used by the frontend and CI."""
    return {"status": "ok"}

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

# ------------------- Endpoints -------------------

@app.post("/api/resume/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(file: UploadFile = File(...)):
    # Validate file type
    if not (file.filename.lower().endswith('.pdf') or file.filename.lower().endswith('.docx')):
        raise HTTPException(status_code=400, detail="Unsupported file type. Only PDF and DOCX are accepted.")
    # Save temporarily
    temp_path = os.path.join(os.getenv('TMP', '/tmp'), file.filename)
    with open(temp_path, 'wb') as out:
        out.write(await file.read())
    try:
        text = extract_text(temp_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        try:
            os.remove(temp_path)
        except Exception:
            pass
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
    temp_path = os.path.join(os.getenv('TMP', '/tmp'), resume_file.filename)
    with open(temp_path, 'wb') as out:
        out.write(await resume_file.read())
    try:
        resume_text = extract_text(temp_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        try:
            os.remove(temp_path)
        except Exception:
            pass
    
    resume_skills = set(extract_skills_from_text(resume_text))
    required_skills = set(extract_required_skills(job_description))

    # Check whether job description contains supported skills
    if not required_skills:
        raise HTTPException(
            status_code=400,
            detail="No supported skills found in the job description. Please include skills such as Python, Java, or SQL."
        )

    # Compare resume skills with required skills
    matched = list(resume_skills.intersection(required_skills))
    missing = list(required_skills.difference(resume_skills))

    # Calculate match percentage
    match_percentage = round(
        len(matched) / len(required_skills) * 100, 2
    )
    
    recommendations = generate_recommendations(missing)
    explanation = f"Your resume contains {len(matched)} of {len(required_skills)} required skills."
    return JobMatchResponse(
        match_percentage=match_percentage,
        matched_skills=matched,
        missing_skills=missing,
        recommendations=recommendations,
        explanation=explanation,
    )
