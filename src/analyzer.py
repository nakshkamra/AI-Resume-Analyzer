import re


# ============================================================
# SKILL DATABASE
# ============================================================

SKILLS = [
    "Python",
    "Java",
    "C",
    "C++",
    "SQL",
    "MySQL",
    "JavaScript",
    "Pandas",
    "NumPy",
    "Machine Learning",
    "Deep Learning",
    "Scikit-learn",
    "OpenCV",
    "Git",
    "GitHub",
    "Linux"
]


# ============================================================
# EXTRACT REQUIRED SKILLS FROM JOB DESCRIPTION
# ============================================================

def extract_required_skills(job_description):

    found_skills = []

    for skill in SKILLS:

        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(
            pattern,
            job_description,
            re.IGNORECASE
        ):
            found_skills.append(skill)

    return found_skills


# ============================================================
# JOB RECOMMENDATIONS
# ============================================================

def generate_recommendations(missing_skills):

    recommendations = []

    for skill in missing_skills:

        recommendations.append(
            f"Learn or improve your {skill} skills "
            f"to increase your job match."
        )

    return recommendations


# ============================================================
# RESUME QUALITY ANALYZER
# ============================================================

def analyze_resume_quality(text):

    score = 0

    suggestions = []

    text_lower = text.lower()

    # --------------------------------------------------------
    # 1. Resume length
    # --------------------------------------------------------

    word_count = len(text.split())

    if word_count >= 300:

        score += 20

    else:

        suggestions.append(
            "Your resume appears too short. "
            "Add more relevant experience, projects or achievements."
        )


    # --------------------------------------------------------
    # 2. Email check
    # --------------------------------------------------------

    email_pattern = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"

    if re.search(email_pattern, text):

        score += 15

    else:

        suggestions.append(
            "Add a professional email address to your resume."
        )


    # --------------------------------------------------------
    # 3. Phone number check
    # --------------------------------------------------------

    phone_pattern = r"\b\d{10}\b"

    if re.search(phone_pattern, text):

        score += 15

    else:

        suggestions.append(
            "Add a valid phone number to your resume."
        )


    # --------------------------------------------------------
    # 4. Important resume sections
    # --------------------------------------------------------

    sections = {
        "Education": [
            "education",
            "academic"
        ],

        "Experience": [
            "experience",
            "work experience",
            "employment"
        ],

        "Projects": [
            "project",
            "projects"
        ],

        "Skills": [
            "skills",
            "technical skills",
            "computer skills"
        ]
    }


    section_count = 0

    for section, keywords in sections.items():

        found = False

        for keyword in keywords:

            if keyword in text_lower:

                found = True
                break

        if found:

            section_count += 1

        else:

            suggestions.append(
                f"Consider adding a clear '{section}' section."
            )


    score += section_count * 7.5


    # --------------------------------------------------------
    # 5. Action words
    # --------------------------------------------------------

    action_words = [
        "developed",
        "created",
        "implemented",
        "designed",
        "built",
        "managed",
        "analyzed",
        "optimized",
        "developed",
        "led"
    ]


    action_word_found = False

    for word in action_words:

        if word in text_lower:

            action_word_found = True
            break


    if action_word_found:

        score += 15

    else:

        suggestions.append(
            "Use strong action words such as "
            "Developed, Implemented, Designed or Optimized."
        )


    # --------------------------------------------------------
    # Limit score
    # --------------------------------------------------------

    score = min(score, 100)


    return round(score, 2), suggestions