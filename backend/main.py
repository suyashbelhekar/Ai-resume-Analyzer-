"""
FastAPI backend for AI Resume Skill Gap Analyzer.
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel
import uvicorn
import os
from pathlib import Path
import tempfile
import shutil
from typing import List, Dict, Any
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from nlp_engine import NLPAnalyzer
from resume_parser import ResumeParser
from course_recommender import CourseRecommender

# Initialize FastAPI app
app = FastAPI(
    title="AI Resume Skill Gap Analyzer API",
    description="NLP-powered resume analysis and skill gap detection",
    version="1.0.0"
)

# Configure CORS for production
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173", 
    "https://ai-resume-analyzer-frontend.onrender.com",
    "https://suyashbelhekar.github.io"
]

# Add Render frontend URL when available
render_frontend_url = os.getenv("RENDER_FRONTEND_URL")
if render_frontend_url:
    allowed_origins.append(render_frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Auth schemas ────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    confirm_password: str

class LoginRequest(BaseModel):
    email: str
    password: str


# ── Auth routes ─────────────────────────────────────────────────────────────

@app.post("/api/auth/register")
def api_register(body: RegisterRequest):
    if not body.full_name.strip():
        raise HTTPException(status_code=400, detail="Full name is required.")
    if "@" not in body.email:
        raise HTTPException(status_code=400, detail="Enter a valid email address.")
    if body.password != body.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")
    try:
        return register_user(body.full_name, body.email, body.password)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@app.post("/api/auth/login")
def api_login(body: LoginRequest):
    if not body.email or not body.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")
    try:
        return login_user(body.email, body.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.get("/api/auth/me")
def api_me(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated.")
    token = authorization.split(" ", 1)[1]
    user = get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")
    return user


@app.get("/")
def root():
    return {"message": "AI Resume Skill Gap Analyzer API", "status": "running"}


@app.get("/api/roles")
def get_roles():
    """Return all available job roles."""
    return {
        "roles": [
            {"id": role, "name": role, "description": data["description"]}
            for role, data in JOB_ROLES.items()
        ]
    }


@app.post("/api/analyze")
async def analyze(
    file: UploadFile = File(...),
    job_role: str = Form(...)
):
    """Analyze resume against a specific job role."""
    # Validate by extension (content_type can be unreliable from browsers)
    if not file.filename.lower().endswith((".pdf", ".docx", ".doc")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

    if job_role not in JOB_ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid job role: {job_role}")

    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit.")

    try:
        result = analyze_resume(file_bytes, file.filename, job_role)
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error("Analysis error: %s\n%s", str(e), traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/api/compare")
async def compare(file: UploadFile = File(...)):
    """Compare resume against all job roles."""
    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit.")

    try:
        results = compare_roles(file_bytes, file.filename)
        return {"comparisons": results}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")


@app.post("/api/report")
async def download_report(
    file: UploadFile = File(...),
    job_role: str = Form(...)
):
    """Generate and download PDF report."""
    file_bytes = await file.read()
    try:
        analysis = analyze_resume(file_bytes, file.filename, job_role)
        pdf_bytes = generate_report(analysis)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=resume_analysis_{job_role.replace(' ', '_')}.pdf"}
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
