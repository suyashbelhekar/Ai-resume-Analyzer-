# AI Resume Skill Gap Analyzer

A full-stack, NLP-powered web application that analyzes resumes against job roles, identifies skill gaps, and helps users build professional resumes — all in one place.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works — Workflow](#how-it-works--workflow)
- [NLP Pipeline](#nlp-pipeline)
- [Resume Builder](#resume-builder)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Screenshots](#screenshots)

---

## Overview

Upload your resume (PDF or DOCX), select a target job role, and instantly get:

- A **match score** showing how well your resume fits the role
- A list of **matched** and **missing skills**
- **AI-generated suggestions** to improve your resume
- **Course recommendations** for skill gaps
- **ATS optimization tips** to pass applicant tracking systems
- A **downloadable PDF report**
- A full **Resume Builder** to create a new resume from scratch

---

## Features

### Skill Gap Analyzer
- Upload resume as PDF or DOCX (up to 10MB)
- Drag-and-drop file upload with instant preview
- Select from 8 target job roles
- NLP-based skill extraction using spaCy NER + TF-IDF cosine similarity
- Weighted match scoring (core skills carry 2x weight)
- Circular progress rings for Match Score and Resume Score
- Skill radar chart and bar chart visualization
- Color-coded skill tags — green (matched), red (missing), blue (bonus)
- AI-generated personalized improvement suggestions
- Course recommendations linked to Coursera, Udemy, and more
- ATS keyword optimization tips per job role
- Downloadable PDF analysis report

### Multi-Role Comparison
- Upload once, compare against all 8 job roles simultaneously
- Ranked results with match percentages
- Bar chart showing scores across all roles
- Best match highlighted with a trophy badge
- Animated progress bars per role card

### Resume Builder
- 6 professional resume templates: Modern, Minimal, Creative, Professional, ATS Friendly, Executive
- Live split-screen preview — changes reflect instantly
- Dynamic form with collapsible sections
- Add/remove entries for Experience, Education, Projects, Certifications
- Skill tag editor with inline add/remove
- Accent color picker (8 colors) applied across the selected template
- Profile completion progress bar (0–100%)
- Auto-save to localStorage — data persists on refresh
- Auto-fill skills from Skill Gap Analyzer results
- One-click PDF download using html2pdf.js
- ATS-friendly export option

### UI/UX
- Clean white/light theme with subtle gradient backgrounds
- Glassmorphism cards with soft shadows
- Smooth animations powered by Framer Motion
- Responsive sidebar navigation with active state indicators
- Step-by-step animated loading overlay during analysis
- Toast notifications for success and error states
- Custom scrollbar styling

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion | Animations and transitions |
| Recharts | Radar chart and bar chart visualizations |
| Axios | HTTP client for API calls |
| React Dropzone | Drag-and-drop file upload |
| React Hot Toast | Notification toasts |
| Lucide React | Icon library |
| html2pdf.js | Client-side PDF generation |
| Vite | Build tool and dev server |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| Uvicorn | ASGI server with hot reload |
| spaCy (en_core_web_sm) | Named Entity Recognition for skill extraction |
| scikit-learn (TF-IDF) | Cosine similarity for fuzzy skill matching |
| NumPy | Numerical operations |
| pdfplumber | PDF text extraction |
| python-docx | DOCX text extraction |
| ReportLab | Server-side PDF report generation |
| python-multipart | Multipart form data handling |

### State Management
- React Context API (`ResumeContext`) for Resume Builder state
- `useState` / `useEffect` for analyzer state in App.jsx
- `localStorage` for Resume Builder auto-save

---

## Project Structure

```
ai-resume-analyzer/
├── backend/
│   ├── main.py              # FastAPI app, routes, CORS
│   ├── nlp_engine.py        # NLP pipeline: extraction, matching, scoring
│   ├── skill_db.py          # Job roles, skill database, course recommendations
│   ├── report_gen.py        # PDF report generation with ReportLab
│   └── requirements.txt
│
└── frontend/
    ├── index.html
    ├── vite.config.js        # Vite config with /api proxy to :8000
    ├── tailwind.config.js
    └── src/
        ├── App.jsx            # Root component, page routing
        ├── index.css          # Global styles, Tailwind layers, utility classes
        ├── main.jsx
        ├── context/
        │   └── ResumeContext.jsx   # Resume Builder global state
        ├── components/
        │   ├── Sidebar.jsx         # Navigation sidebar
        │   ├── UploadZone.jsx      # Drag-and-drop file upload
        │   ├── CircularScore.jsx   # Animated SVG circular progress ring
        │   ├── SkillCharts.jsx     # Radar + bar charts
        │   ├── SkillTags.jsx       # Matched / missing / bonus skill tags
        │   └── LoadingOverlay.jsx  # Animated analysis loading screen
        └── pages/
            ├── Dashboard.jsx       # Upload + role selection + analyze
            ├── AnalysisPage.jsx    # Full analysis results view
            ├── ComparePage.jsx     # Multi-role comparison
            ├── ResumeBuilder.jsx   # Resume Builder main page
            └── builder/
                ├── ResumeForm.jsx       # Dynamic multi-section form
                ├── ResumePreview.jsx    # Scaled live preview wrapper
                ├── TemplateSelector.jsx # Template + color picker
                └── templates/
                    ├── ModernTemplate.jsx       # Header bar + two-column layout
                    ├── MinimalTemplate.jsx      # Clean single-column
                    ├── CreativeTemplate.jsx     # Bold header + pill skills
                    ├── ProfessionalTemplate.jsx # Serif corporate style
                    ├── ATSTemplate.jsx          # Plain text, ATS-optimized
                    └── ExecutiveTemplate.jsx    # Dark header + accent bar
```

---

## How It Works — Workflow

```
User uploads resume (PDF / DOCX)
        │
        ▼
Text extraction
  ├── PDF  → pdfplumber
  └── DOCX → python-docx
        │
        ▼
Text preprocessing
  └── Lowercase, strip punctuation, normalize whitespace
        │
        ▼
Skill extraction (3-layer approach)
  ├── 1. Direct keyword matching (regex word boundaries)
  ├── 2. spaCy NER (ORG, PRODUCT entities mapped to skills)
  └── 3. TF-IDF cosine similarity (fuzzy / semantic matching)
        │
        ▼
Match scoring against selected job role
  ├── Core skills → 2x weight
  ├── Non-core skills → 1x weight
  ├── Bonus skills (extra, not required) → up to +5 points
  └── Final score clamped to 0–100
        │
        ▼
Output generation
  ├── Matched skills list
  ├── Missing skills list (skill gaps)
  ├── Extra/bonus skills
  ├── AI improvement suggestions
  ├── Course recommendations (per missing skill)
  ├── ATS keyword tips
  └── Resume quality score
        │
        ▼
Frontend renders results
  ├── Circular score rings (animated SVG)
  ├── Radar chart + bar chart
  ├── Color-coded skill tags
  └── Cards for suggestions, courses, ATS tips
        │
        ▼
Optional: Download PDF report (ReportLab, server-side)
```

---

## NLP Pipeline

### Skill Extraction

Three complementary methods run in sequence and results are merged:

**1. Keyword Matching**
Every skill in the database is matched against the resume text using regex word boundaries (`\bskill\b`). This catches exact matches reliably.

**2. spaCy NER**
The resume text is passed through spaCy's `en_core_web_sm` model. Entities labeled `ORG`, `PRODUCT`, or `GPE` are cross-referenced against the skill database for partial matches (e.g., "TensorFlow" recognized as an organization entity).

**3. TF-IDF Cosine Similarity**
The full resume text and each skill string are vectorized using `TfidfVectorizer` with 1–2 ngrams. Skills with cosine similarity > 0.15 against the resume vector are included. This catches paraphrased or contextually similar mentions.

### Match Scoring

```
total_weight = len(core_skills) × 2 + len(non_core_skills)
achieved_weight = len(core_matched) × 2 + len(non_core_matched)
score = (achieved_weight / total_weight) × 100
score += min(5, len(extra_skills) // 3)   # bonus
score = min(100, score)
```

### Supported Job Roles

| Role | Core Skills |
|---|---|
| Data Scientist | Python, Machine Learning, Statistics, SQL, Pandas |
| Software Engineer | Python, JavaScript, Git, Data Structures, Algorithms |
| Frontend Developer | HTML, CSS, JavaScript, React, Git |
| Backend Developer | Python, SQL, REST API, Docker, Git |
| DevOps Engineer | Docker, Kubernetes, AWS, CI/CD, Linux |
| Machine Learning Engineer | Python, Machine Learning, TensorFlow, Docker, MLOps |
| Product Manager | Product Strategy, Agile, Data Analysis, Communication, User Research |
| Cybersecurity Analyst | Network Security, Penetration Testing, Linux, Python, Incident Response |

---

## Resume Builder

### Templates

| Template | Layout | Best For |
|---|---|---|
| Modern | Colored header bar + main/sidebar split | Tech, design roles |
| Minimal | Clean single-column, centered header | Any role, ATS-safe |
| Creative | Bold gradient header + pill skill tags | Design, marketing |
| Professional | Serif font, double-ruled sections | Finance, law, consulting |
| ATS Friendly | Plain text, no colors or columns | Maximizing ATS pass rate |
| Executive | Dark header + accent left-border entries | Senior / leadership roles |

### Form Sections
- Personal Information (name, email, phone, LinkedIn, GitHub, location, website)
- Summary / Objective (with character counter)
- Skills (inline tag editor, add/remove individually)
- Experience (multiple entries, current job toggle, bullet-point descriptions)
- Education (multiple entries with GPA)
- Projects (name, tech stack, description, link)
- Certifications (name, issuer, date, credential link)

### PDF Export
The live preview `div` is captured by `html2pdf.js` at 2× scale using `html2canvas`, then converted to a letter-size PDF via jsPDF. The filename is auto-generated as `{name}_{template}.pdf`.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/api/roles` | List all available job roles |
| POST | `/api/analyze` | Analyze resume against a job role |
| POST | `/api/compare` | Compare resume against all roles |
| POST | `/api/report` | Generate and download PDF report |

### POST /api/analyze

**Request:** `multipart/form-data`
- `file` — PDF or DOCX resume file
- `job_role` — Target role string (e.g., `"Data Scientist"`)

**Response:**
```json
{
  "job_role": "Data Scientist",
  "match_score": 72,
  "resume_score": 78,
  "matched_skills": ["python", "sql", "pandas"],
  "missing_skills": ["docker", "spark", "mlflow"],
  "extra_skills": ["react", "node.js"],
  "core_matched": ["python", "sql"],
  "core_missing": [],
  "total_required": 35,
  "total_matched": 18,
  "suggestions": ["..."],
  "courses": [{ "skill": "docker", "title": "...", "platform": "...", "url": "...", "level": "..." }],
  "ats_tips": ["..."],
  "word_count": 412
}
```

---

## Deployment

### Docker Deployment (Recommended)

1. **Clone and navigate to the project:**
```bash
git clone https://github.com/suyashbelhekar/ai-resume-analyzer.git
cd ai-resume-analyzer
```

2. **Build and run with Docker Compose:**
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:80
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Manual Deployment

#### Backend Deployment
```bash
cd backend
pip install -r requirements.txt
pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.1/en_core_web_sm-3.7.1-py3-none-any.whl
python main.py
```

#### Frontend Deployment
```bash
cd frontend
npm install
npm run build
# Serve the dist folder with your preferred web server (nginx, apache, etc.)
```

### Environment Variables

Copy the example environment files:
```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

Edit the `.env` files with your configuration.

### GitHub Actions (CI/CD)

The project includes GitHub Actions workflow for automatic deployment. Configure your deployment secrets in GitHub repository settings.

---

## Getting Started (Development)

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup

```bash
cd ai-resume-analyzer/backend
pip install -r requirements.txt
pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.1/en_core_web_sm-3.7.1-py3-none-any.whl
python main.py
```

Backend runs at: **http://localhost:8000**
API docs at: **http://localhost:8000/docs**

### 2. Frontend Setup

```bash
cd ai-resume-analyzer/frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173** (or next available port)

### 3. Open the App

Navigate to the URL shown in the Vite output (e.g., `http://localhost:5173`).

---

## Screenshots

| Page | Description |
|---|---|
| Dashboard | Upload resume + select job role |
| Analysis | Match score, charts, skill tags, suggestions |
| Compare Roles | Bar chart + ranked role cards |
| Resume Builder | Split-screen form + live template preview |

---

## License

MIT
