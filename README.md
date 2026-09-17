# CareerAI — AI Career & Resume Intelligence Platform

> **"Analyze. Improve. Prepare. Get Career Ready."**

**CareerAI** is an end-to-end, production-grade AI Career & Resume Intelligence Platform. It guides candidates through the complete career lifecycle — from parsing job postings and auditing ATS compliance to rewriting bullet points with zero hallucination, generating tailored resumes, learning via step-by-step career roadmaps, practicing AI mock interviews, and tracking job applications on a Kanban board.


live at:  ai-resume-analyzer-xi-liard.vercel.app

## 🚀 Key Features

### 1. 📄 Job Description Analyzer
- Paste raw JD text or upload JD documents (`.pdf`, `.docx`, `.doc`, `.txt`).
- Extracts structured requirements: Identified Job Title, Seniority Level, Experience Years, Education, Required Core Skills, Preferred Skills, Tooling/Technologies, Certifications, Key Responsibilities, and High-Priority ATS Keywords.
- One-click **"Save to Library"** and **"Match Against Active Resume"**.

### 2. 🔍 Resume + JD 9-Dimensional Intelligence Matcher
- Deep multi-dimensional alignment across:
  1. *Skill alignment*
  2. *Experience alignment*
  3. *Project alignment*
  4. *Education alignment*
  5. *Keyword alignment*
  6. *Technology alignment*
  7. *Responsibility alignment*
  8. *Certification alignment*
  9. *Seniority alignment*
- Distinct scores: **Overall Match**, **Skill Match**, **Experience Match**, **Project Match**, **Education Match**, **Keyword Match**, and **ATS Score**.

### 3. 🎯 Skill Gap & Skill Evidence Mapping
- **Verified Skill Evidence**: Cites the exact sentence/quote in your resume where each matched skill was detected, along with section origin (`Projects -> CardioAI`, `Experience -> Tech Corp`) and confidence rating.
- **Skill Gap Bridge Advice**: For every missing skill, provides JD importance weighting, recommended learning courses, hands-on portfolio project blueprints, and ethical resume guidelines (*Add only after building!*).
- **Weak / Partial Skills**: Identifies keywords mentioned without sufficient depth or metrics.

### 4. ✍️ Anti-Hallucination AI Resume Rewriter
- Rewrite summaries, experience bullets, project descriptions, or achievements with 6 professional modes:
  - `Improve Impact` — Dynamic action verbs and polished clarity
  - `ATS Optimize` — Injects recruiter keywords naturally
  - `Make Technical` — Highlights systems architecture and engineering patterns
  - `Make Concise` — Removes filler words and sharpens phrasing
  - `Quantify Metrics` — Restructures into XYZ formula with honest placeholders like `[reduced latency by X%]`
  - `Executive Polish` — Senior-level corporate phrasing
- Strict Anti-Hallucination guardrail: Never fabricates companies, degrees, or fake metrics.
- One-click **"Apply to Resume Builder"**.

### 5. ⚡ Job-Specific Tailored Resume Generator
- Combines candidate's existing resume data + target JD.
- Re-orders technical skills by relevance to target job.
- Generates a targeted summary and optimizes project bullet points.
- Directly synchronized with the interactive **Resume Builder**.

### 6. 🛡️ ATS Simulator & Compliance Auditor
- Transparent, explainable ATS parsing simulation:
  - **Keyword Coverage Score**
  - **Section Structure & Standard Headers**
  - **Readability & Action Verbs Check**
  - **JD Alignment Score**
  - **Formatting & Contact Info Check**
- Categorized findings: **Critical Issues** (Red), **Warnings** (Amber), and **Actionable Suggestions** (Blue).

### 7. 🗺️ AI Career Roadmap & Capstone Project
- Step-by-step weekly milestone learning schedule tailored to target gaps.
- Includes difficulty ratings, practice assignments, and portfolio evidence goals.
- Interactive completion checkboxes with persistent progress bar.
- **Capstone Engineering Project Blueprint**: Complete problem statement, architecture flow, tech stack, and portfolio resume bullet.

### 8. 🎙️ AI Interview Prep & Interactive Mock Interview Simulator
- **Question Bank**: Categorized questions (`Technical`, `Behavioral`, `Project`, `HR`, `Situational`, `Skill-Gap`) with expandable *Hints* and *STAR Answer Frameworks*.
- **Interactive Mock Simulator**: Type or speak your answer $\rightarrow$ AI evaluates on *Technical Accuracy, Relevance, Clarity, Structure, and Completeness* $\rightarrow$ Gives scored feedback, strengths, and weaknesses.

### 9. 📋 Job Application Pipeline Tracker
- Full application lifecycle tracker with **Kanban Board** and **Table Views**.
- Pipeline stages: `Wishlist` $\rightarrow$ `Applied` $\rightarrow$ `Assessment` $\rightarrow$ `Interview` $\rightarrow$ `Offer` $\rightarrow$ `Rejected`.
- Track company, role, location, application date, interview date, match score, ATS score, salary, and notes.

### 10. 📑 Resume Version Management & Comparison
- Save multiple targeted resumes (*Data Engineer Resume*, *Fullstack Dev Resume*, *ML Engineer Resume*).
- **V1 vs V2 Side-by-Side Comparison**: Computes ATS score improvement deltas, keyword coverage changes, and newly added skills.

### 11. 🛠️ Interactive Resume Builder
- 6 customizable templates: *Modern*, *Minimal*, *Creative*, *Professional*, *ATS Friendly*, and *Executive*.
- Real-time live preview with profile completion gauge.
- High-fidelity PDF export via `html2pdf.js` and ReportLab backend.

---

## 🏗️ Architecture & Technology Stack

### Backend
- **FastAPI**: Asynchronous Python API framework
- **Google Gemini API**: Centralized AI service (`gemini-2.5-flash`) via `google-genai` SDK
- **SQLite Database (`career_ai.db`)**: Persistent repository layer with user isolation
- **Local NLP & TF-IDF**: spaCy (`en_core_web_sm`) + scikit-learn cosine similarity for robust offline fallback
- **Document Extractors**: `pdfplumber`, `pypdf`, `python-docx`
- **ReportLab**: Executive PDF report generation

### Frontend
- **React 18 & Vite**: Fast modular frontend
- **Tailwind CSS**: Modern design system
- **Framer Motion**: Smooth micro-animations
- **Recharts**: Radar charts, breakdown bars, and pipeline metrics
- **Axios**: Centralized API service with Bearer token interceptor
- **React Dropzone & Hot Toast**: Seamless drag-and-drop and alert notifications

---

## 📁 Project Structure

```
Ai-resume-Analyzer/
├── backend/
│   ├── main.py              # FastAPI REST endpoints & Pydantic models
│   ├── gemini_service.py    # Centralized Google Gemini AI service
│   ├── database.py          # SQLite persistence repository layer
│   ├── ats_checker.py       # Deterministic + AI ATS simulation engine
│   ├── nlp_engine.py        # spaCy + TF-IDF offline parser & evidence locator
│   ├── report_gen.py        # ReportLab PDF executive report generator
│   ├── auth.py              # JWT authentication module
│   ├── skill_db.py          # Predefined role databases & ATS keywords
│   ├── test_backend.py      # Automated backend API test suite
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Server & GEMINI_API_KEY configuration
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js       # Centralized Axios API service client
│   │   ├── context/
│   │   │   ├── CareerContext.jsx # Global Career intelligence state
│   │   │   ├── AuthContext.jsx   # Authentication context
│   │   │   └── ResumeContext.jsx # Resume builder state
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         # Career Command Center
│   │   │   ├── JDAnalyzerPage.jsx    # Job Description Analyzer
│   │   │   ├── AnalysisPage.jsx      # Resume Intelligence Analysis
│   │   │   ├── SkillGapPage.jsx      # Skill Gap & Evidence Mapping
│   │   │   ├── RewriterPage.jsx      # Anti-Hallucination AI Rewriter
│   │   │   ├── TailoredResumePage.jsx# Tailored Resume Generator
│   │   │   ├── ATSSimulatorPage.jsx  # ATS Simulation & Auditor
│   │   │   ├── CareerRoadmapPage.jsx # Career Roadmap & Capstone
│   │   │   ├── InterviewPrepPage.jsx # AI Mock Interview Simulator
│   │   │   ├── ApplicationsPage.jsx  # Job Application Tracker
│   │   │   ├── ResumeVersionsPage.jsx# Version Management & Comparison
│   │   │   ├── ResumeBuilder.jsx     # Multi-template Resume Builder
│   │   │   └── ProfilePage.jsx       # Profile & AI Engine Status
│   │   ├── components/      # Reusable UI components
│   │   └── App.jsx          # Root routing & provider tree
│   ├── package.json
│   └── vite.config.js
├── start-all.bat            # One-click fullstack launcher
└── README.md
```

---

## ⚡ Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Configure Backend Environment
Create or edit `backend/.env`:
```env
# Google Gemini API Key (Get from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
HOST=127.0.0.1
PORT=8000
SECRET_KEY=career-ai-jwt-secret-2026
```

### 3. Install & Start Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*Backend runs at: `http://localhost:8000` (API Docs: `http://localhost:8000/docs`)*

### 4. Install & Start Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

### 5. Quick Windows Launcher
Double-click `start-all.bat` to launch both servers simultaneously.

---

## 📡 API Reference Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/jd/analyze` | Parse job description from text or document |
| `POST` | `/api/match` | Multi-dimensional 9D resume + JD match |
| `POST` | `/api/skill-gap` | Matched evidence quotes & missing gap advice |
| `POST` | `/api/rewrite` | AI Resume Rewriter with 6 transformation modes |
| `POST` | `/api/tailored-resume` | Generate job-tailored resume |
| `POST` | `/api/ats/analyze` | Deterministic & semantic ATS simulation |
| `POST` | `/api/roadmap` | Generate weekly career transition roadmap |
| `POST` | `/api/interview/generate` | Generate categorized interview questions |
| `POST` | `/api/interview/evaluate` | Evaluate candidate mock interview answer |
| `GET/POST` | `/api/applications` | CRUD operations for Job Application Tracker |
| `GET/POST` | `/api/resumes/versions` | Manage & compare resume iterations |

---

## 📄 License
This project is licensed under the MIT License.
