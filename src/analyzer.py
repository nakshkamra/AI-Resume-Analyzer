import re

SKILLS = [
    "Python", "Java", "C", "C++", "SQL", "MySQL",
    "JavaScript", "Pandas", "NumPy", "Machine Learning",
    "Deep Learning", "Scikit-learn", "OpenCV",
    "Git", "GitHub", "Linux"
]


def extract_required_skills(job_description):
    found_skills = []

    for skill in SKILLS:
        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, job_description, re.IGNORECASE):
            found_skills.append(skill)

    return found_skills


def generate_recommendations(missing_skills):
    recommendations = []

    for skill in missing_skills:
        recommendations.append(
            f"Learn or improve your {skill} skills to increase your job match."
        )

    return recommendations