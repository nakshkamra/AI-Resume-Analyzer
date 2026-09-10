import spacy

# Load English NLP model
nlp = spacy.load("en_core_web_sm")


def calculate_similarity(resume_skill, job_skill):
    resume_doc = nlp(resume_skill)
    job_doc = nlp(job_skill)

    return resume_doc.similarity(job_doc)


def match_skills(resume_skills, job_skills):

    matched_skills = []
    missing_skills = []

    for job_skill in job_skills:

        best_similarity = 0

        for resume_skill in resume_skills:
            similarity = calculate_similarity(
                resume_skill,
                job_skill
            )

            if similarity > best_similarity:
                best_similarity = similarity

        # Similarity threshold
        if best_similarity >= 0.70:
            matched_skills.append(job_skill)
        else:
            missing_skills.append(job_skill)

    if len(job_skills) > 0:
        score = (len(matched_skills) / len(job_skills)) * 100
    else:
        score = 0

    return matched_skills, missing_skills, score


# Test
resume_skills = [
    "Python",
    "Java",
    "OpenCV",
    "Linux"
]

job_skills = [
    "Python",
    "Java",
    "SQL",
    "Pandas",
    "Machine Learning"
]

matched, missing, score = match_skills(
    resume_skills,
    job_skills
)

print("Matched skills:")
for skill in matched:
    print("-", skill)

print("\nMissing skills:")
for skill in missing:
    print("-", skill)

print("\nMatch Score:", round(score, 2), "%")