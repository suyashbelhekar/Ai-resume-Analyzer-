"""
PDF Report Generator for resume analysis results.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import io
from datetime import datetime


def generate_report(analysis: dict) -> bytes:
    """Generate a PDF report from analysis results."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch
    )

    styles = getSampleStyleSheet()
    story = []

    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=24,
        textColor=colors.HexColor('#6366f1'),
        spaceAfter=6,
        alignment=TA_CENTER
    )
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#94a3b8'),
        alignment=TA_CENTER,
        spaceAfter=20
    )
    section_style = ParagraphStyle(
        'Section',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#6366f1'),
        spaceBefore=16,
        spaceAfter=8
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#334155'),
        spaceAfter=4
    )

    # Header
    story.append(Paragraph("AI Resume Skill Gap Analyzer", title_style))
    story.append(Paragraph(f"Analysis Report — {datetime.now().strftime('%B %d, %Y')}", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e2e8f0')))
    story.append(Spacer(1, 12))

    # Score summary table
    score_data = [
        ["Target Role", "Match Score", "Resume Score", "Skills Matched"],
        [
            analysis.get("job_role", "N/A"),
            f"{analysis.get('match_score', 0)}%",
            f"{analysis.get('resume_score', 0)}/100",
            f"{analysis.get('total_matched', 0)}/{analysis.get('total_required', 0)}"
        ]
    ]
    score_table = Table(score_data, colWidths=[2 * inch, 1.5 * inch, 1.5 * inch, 1.5 * inch])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#6366f1')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ROWHEIGHT', (0, 0), (-1, -1), 28),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#f8fafc')),
        ('FONTSIZE', (0, 1), (-1, 1), 12),
        ('FONTNAME', (0, 1), (-1, 1), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    story.append(score_table)
    story.append(Spacer(1, 16))

    # Matched Skills
    story.append(Paragraph("Matched Skills", section_style))
    matched = analysis.get("matched_skills", [])
    if matched:
        skills_text = " • ".join([s.title() for s in matched])
        story.append(Paragraph(skills_text, body_style))
    else:
        story.append(Paragraph("No matching skills found.", body_style))
    story.append(Spacer(1, 8))

    # Missing Skills
    story.append(Paragraph("Skill Gaps (Missing Skills)", section_style))
    missing = analysis.get("missing_skills", [])
    if missing:
        for skill in missing[:15]:
            story.append(Paragraph(f"  ✗  {skill.title()}", body_style))
    else:
        story.append(Paragraph("No critical skill gaps found.", body_style))
    story.append(Spacer(1, 8))

    # AI Suggestions
    story.append(Paragraph("AI-Powered Suggestions", section_style))
    for i, suggestion in enumerate(analysis.get("suggestions", []), 1):
        story.append(Paragraph(f"{i}. {suggestion}", body_style))
    story.append(Spacer(1, 8))

    # Course Recommendations
    story.append(Paragraph("Recommended Courses", section_style))
    courses = analysis.get("courses", [])
    if courses:
        course_data = [["Skill", "Course", "Platform", "Level"]]
        for c in courses:
            course_data.append([c["skill"].title(), c["title"], c["platform"], c["level"]])
        course_table = Table(course_data, colWidths=[1.2 * inch, 2.8 * inch, 1.2 * inch, 1 * inch])
        course_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ROWHEIGHT', (0, 0), (-1, -1), 22),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#f8fafc'), colors.white]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ]))
        story.append(course_table)
    story.append(Spacer(1, 8))

    # ATS Tips
    story.append(Paragraph("ATS Optimization Tips", section_style))
    for tip in analysis.get("ats_tips", []):
        story.append(Paragraph(f"  →  {tip}", body_style))

    # Footer
    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e2e8f0')))
    story.append(Spacer(1, 8))
    footer_style = ParagraphStyle('Footer', parent=styles['Normal'], fontSize=8,
                                   textColor=colors.HexColor('#94a3b8'), alignment=TA_CENTER)
    story.append(Paragraph("Generated by AI Resume Skill Gap Analyzer", footer_style))

    doc.build(story)
    buffer.seek(0)
    return buffer.read()
