"""
NLP Engine for resume parsing and skill extraction.
Uses spaCy for NER and TF-IDF + cosine similarity for skill matching.
"""

import re
import io
import spacy
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from skill_db import JOB_ROLES, COURSE_RECOMMENDATIONS, ATS_KEYWORDS

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF bytes."""
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    except Exception as e:
        raise ValueError(f"Failed to extract PDF text: {str(e)}")


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from DOCX bytes."""
    try:
        from docx import Document
        doc = Document(io.BytesIO(file_bytes))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        raise ValueError(f"Failed to extract DOCX text: {str(e)}")


def preprocess_text(text: str) -> str:
    """Clean and normalize text."""
    text = text.lower()
    text = re.sub(r'[^\w\s\+\#\./]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_skills_from_text(text: str, all_skills: list) -> list:
    """
    Extract skills using NER + keyword matching + TF-IDF.
    """
    text_lower = preprocess_text(text)
    found_skills = set()

    # 1. Direct keyword matching
    for skill in all_skills:
        skill_lower = skill.lower()
        # Use word boundary matching for short skills
        pattern = r'\b' + re.escape(skill_lower) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.add(skill.lower())

    # 2. spaCy NER for additional tech entities
    doc = nlp(text[:100000])  # limit for performance
    for ent in doc.ents:
        ent_text = ent.text.lower().strip()
        if ent.label_ in ["ORG", "PRODUCT", "GPE"] and len(ent_text) > 2:
            for skill in all_skills:
                if ent_text in skill.lower() or skill.lower() in ent_text:
                    found_skills.add(skill.lower())

    # 3. TF-IDF similarity for fuzzy matching
    if len(text_lower.split()) > 10:
        try:
            skill_docs = [skill.lower() for skill in all_skills]
            corpus = [text_lower] + skill_docs
            vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
            tfidf_matrix = vectorizer.fit_transform(corpus)
            resume_vec = tfidf_matrix[0]
            skill_vecs = tfidf_matrix[1:]
            similarities = cosine_similarity(resume_vec, skill_vecs)[0]
            for idx, sim in enumerate(similarities):
                if sim > 0.15:
                    found_skills.add(all_skills[idx].lower())
        except Exception:
            pass

    return list(found_skills)


def calculate_match_score(extracted_skills: list, required_skills: list, core_skills: list) -> dict:
    """
    Calculate match percentage using weighted scoring.
    Core skills have higher weight.
    """
    extracted_set = set(s.lower() for s in extracted_skills)
    required_set = set(s.lower() for s in required_skills)
    core_set = set(s.lower() for s in core_skills)

    matched = extracted_set.intersection(required_set)
    missing = required_set - extracted_set

    # Weighted score: core skills = 2x weight
    core_matched = matched.intersection(core_set)
    non_core_matched = matched - core_set
    core_missing = missing.intersection(core_set)

    total_weight = len(core_set) * 2 + (len(required_set) - len(core_set))
    achieved_weight = len(core_matched) * 2 + len(non_core_matched)

    score = min(100, round((achieved_weight / max(total_weight, 1)) * 100))

    # Bonus for extra relevant skills
    extra_skills = extracted_set - required_set
    bonus = min(5, len(extra_skills) // 3)
    score = min(100, score + bonus)

    return {
        "score": score,
        "matched_skills": sorted(list(matched)),
        "missing_skills": sorted(list(missing)),
        "extra_skills": sorted(list(extra_skills)),
        "core_matched": sorted(list(core_matched)),
        "core_missing": sorted(list(core_missing)),
        "total_required": len(required_set),
        "total_matched": len(matched)
    }


def get_course_recommendations(missing_skills: list) -> list:
    """Get course recommendations for missing skills."""
    recommendations = []
    seen_titles = set()

    for skill in missing_skills[:8]:  # top 8 missing skills
        skill_lower = skill.lower()
        courses = COURSE_RECOMMENDATIONS.get(skill_lower, COURSE_RECOMMENDATIONS["default"])
        for course in courses[:1]:  # 1 course per skill
            if course["title"] not in seen_titles:
                recommendations.append({
                    "skill": skill,
                    "title": course["title"],
                    "platform": course["platform"],
                    "url": course["url"],
                    "level": course["level"]
                })
                seen_titles.add(course["title"])

    return recommendations


def generate_ai_suggestions(score: int, missing_skills: list, matched_skills: list, job_role: str) -> list:
    """Generate personalized improvement suggestions."""
    suggestions = []

    if score < 40:
        suggestions.append(f"Your profile needs significant development for {job_role}. Focus on building core technical skills first.")
    elif score < 60:
        suggestions.append(f"You have a foundation for {job_role}. Prioritize learning the missing core skills to become competitive.")
    elif score < 80:
        suggestions.append(f"Good match for {job_role}! Fill the skill gaps to stand out from other candidates.")
    else:
        suggestions.append(f"Excellent match for {job_role}! Polish your resume and highlight your strongest skills.")

    if missing_skills:
        top_missing = missing_skills[:3]
        suggestions.append(f"Priority skills to learn: {', '.join(top_missing)}. These are highly valued by employers.")

    if len(matched_skills) > 5:
        suggestions.append("Quantify your achievements — add metrics like 'improved performance by 30%' or 'reduced load time by 2s'.")

    suggestions.append("Use action verbs: 'Developed', 'Architected', 'Optimized', 'Led', 'Implemented' to strengthen impact.")
    suggestions.append("Tailor your resume summary to mention the specific job role and your top 3 matching skills.")

    if score >= 60:
        suggestions.append("Consider adding a portfolio or GitHub link showcasing projects that use your key skills.")

    return suggestions


def get_ats_tips(job_role: str, missing_skills: list) -> list:
    """Get ATS keyword optimization tips."""
    tips = []
    keywords = ATS_KEYWORDS.get(job_role, [])

    tips.append(f"Include these ATS-friendly phrases: {', '.join(keywords[:3])}")
    tips.append("Use standard section headers: 'Work Experience', 'Education', 'Skills', 'Projects'")
    tips.append("Avoid tables, columns, and graphics — ATS systems often can't parse them")
    tips.append("Save your resume as a .docx or simple PDF for best ATS compatibility")

    if missing_skills:
        tips.append(f"Add a dedicated 'Technical Skills' section listing: {', '.join(missing_skills[:4])}")

    return tips


def analyze_resume(file_bytes: bytes, filename: str, job_role: str) -> dict:
    """
    Main analysis pipeline.
    """
    # Extract text
    if filename.lower().endswith(".pdf"):
        text = extract_text_from_pdf(file_bytes)
    elif filename.lower().endswith((".docx", ".doc")):
        text = extract_text_from_docx(file_bytes)
    else:
        raise ValueError("Unsupported file format. Please upload PDF or DOCX.")

    if not text or len(text.strip()) < 50:
        raise ValueError("Could not extract meaningful text from the resume.")

    # Get job role data
    if job_role not in JOB_ROLES:
        raise ValueError(f"Unknown job role: {job_role}")

    role_data = JOB_ROLES[job_role]
    all_skills = list(set(
        skill for role in JOB_ROLES.values()
        for skill in role["required_skills"]
    ))

    # Extract skills
    extracted_skills = extract_skills_from_text(text, all_skills)

    # Calculate match
    match_data = calculate_match_score(
        extracted_skills,
        role_data["required_skills"],
        role_data["core_skills"]
    )

    # Get recommendations
    courses = get_course_recommendations(match_data["missing_skills"])
    suggestions = generate_ai_suggestions(
        match_data["score"],
        match_data["missing_skills"],
        match_data["matched_skills"],
        job_role
    )
    ats_tips = get_ats_tips(job_role, match_data["missing_skills"])

    # Resume quality score (separate from match score)
    word_count = len(text.split())
    resume_score = min(100, max(20,
        match_data["score"] * 0.6 +
        min(20, word_count / 25) +
        min(10, len(extracted_skills) * 0.5) +
        (10 if len(text) > 500 else 0)
    ))

    return {
        "job_role": job_role,
        "role_description": role_data["description"],
        "extracted_skills": sorted(extracted_skills),
        "matched_skills": match_data["matched_skills"],
        "missing_skills": match_data["missing_skills"],
        "extra_skills": match_data["extra_skills"],
        "core_matched": match_data["core_matched"],
        "core_missing": match_data["core_missing"],
        "match_score": match_data["score"],
        "resume_score": round(resume_score),
        "total_required": match_data["total_required"],
        "total_matched": match_data["total_matched"],
        "word_count": word_count,
        "courses": courses,
        "suggestions": suggestions,
        "ats_tips": ats_tips,
        "text_preview": text[:500]
    }


def compare_roles(file_bytes: bytes, filename: str) -> list:
    """Compare resume against all job roles."""
    results = []
    for role in JOB_ROLES.keys():
        try:
            result = analyze_resume(file_bytes, filename, role)
            results.append({
                "role": role,
                "score": result["match_score"],
                "matched": result["total_matched"],
                "total": result["total_required"]
            })
        except Exception:
            pass
    return sorted(results, key=lambda x: x["score"], reverse=True)
