// Demo data for GitHub Pages deployment when backend is not available
export const demoAnalysisData = {
  job_role: "Data Scientist",
  match_score: 75,
  resume_score: 82,
  matched_skills: ["python", "sql", "pandas", "machine learning", "statistics"],
  missing_skills: ["docker", "spark", "mlflow", "kubernetes"],
  extra_skills: ["react", "node.js", "git"],
  core_matched: ["python", "sql", "pandas"],
  core_missing: [],
  total_required: 35,
  total_matched: 18,
  suggestions: [
    "Add Docker and Kubernetes to your DevOps skills",
    "Include more machine learning project details",
    "Highlight your experience with big data technologies",
    "Add specific metrics and achievements to your experience section"
  ],
  courses: [
    { skill: "docker", title: "Docker for Developers", platform: "Udemy", url: "https://udemy.com/docker", level: "Beginner" },
    { skill: "spark", title: "Apache Spark with Python", platform: "Coursera", url: "https://coursera.org/spark", level: "Intermediate" },
    { skill: "mlflow", title: "MLFlow for Machine Learning", platform: "edX", url: "https://edx.org/mlflow", level: "Intermediate" }
  ],
  ats_tips: [
    "Use standard section headers (Experience, Education, Skills)",
    "Include keywords from the job description naturally",
    "Avoid tables, columns, and graphics in your resume",
    "Use bullet points with action verbs"
  ],
  word_count: 412
};

export const demoRoles = [
  "Data Scientist",
  "Software Engineer", 
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Product Manager",
  "Cybersecurity Analyst"
];

export const demoCompareData = demoRoles.map(role => ({
  job_role: role,
  match_score: Math.floor(Math.random() * 30) + 60,
  resume_score: Math.floor(Math.random() * 20) + 75
})).sort((a, b) => b.match_score - a.match_score);
