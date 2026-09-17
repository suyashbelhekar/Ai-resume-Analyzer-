// Demo data for offline / preview deployment
export const demoAnalysisData = {
  job_role: "Data Scientist",
  role_description: "Analyzes complex data to help organizations make better decisions.",
  match_score: 78,
  resume_score: 84,
  matched_skills: ["python", "sql", "pandas", "numpy", "machine learning", "statistics", "scikit-learn", "git"],
  missing_skills: ["docker", "spark", "kubernetes", "tensorflow", "pytorch"],
  extra_skills: ["react", "node.js", "tailwind css", "fastapi"],
  core_matched: ["python", "sql", "pandas", "machine learning"],
  core_missing: ["statistics"],
  total_required: 25,
  total_matched: 18,
  suggestions: [
    "Highlight production ML deployment experience (FastAPI/Docker).",
    "Quantify business impact on data pipelines (e.g., reduced query latency by 40%).",
    "Add big data processing experience like PySpark and cloud data warehouses.",
    "Include links to GitHub repositories demonstrating end-to-end ML projects."
  ],
  courses: [
    { skill: "docker", title: "Docker & Kubernetes: The Practical Guide", platform: "Udemy", url: "https://www.udemy.com/course/docker-kubernetes-the-practical-guide/", level: "Beginner" },
    { skill: "spark", title: "Apache Spark with Python", platform: "Coursera", url: "https://www.coursera.org/specializations/spark", level: "Intermediate" },
    { skill: "tensorflow", title: "Deep Learning with TensorFlow", platform: "Coursera", url: "https://www.coursera.org/learn/deep-neural-networks", level: "Advanced" }
  ],
  ats_tips: [
    "Use standard section headers: 'Experience', 'Technical Skills', 'Education', 'Projects'",
    "Incorporate keywords naturally throughout project bullet points",
    "Avoid multi-column tables and complex charts for maximum ATS compatibility",
    "Use strong action verbs such as Engineered, Architected, and Deployed"
  ],
  word_count: 430,
  ai_powered: false
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

export const demoCompareData = [
  { role: "Data Scientist", score: 82, matched: 22, total: 30 },
  { role: "Machine Learning Engineer", score: 76, matched: 19, total: 28 },
  { role: "Backend Developer", score: 68, matched: 16, total: 32 },
  { role: "Software Engineer", score: 65, matched: 18, total: 35 },
  { role: "DevOps Engineer", score: 54, matched: 12, total: 28 },
  { role: "Frontend Developer", score: 48, matched: 10, total: 26 },
  { role: "Product Manager", score: 42, matched: 8, total: 24 },
  { role: "Cybersecurity Analyst", score: 38, matched: 7, total: 25 },
];
