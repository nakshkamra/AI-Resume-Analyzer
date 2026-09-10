from functools import lru_cache

from sentence_transformers import SentenceTransformer, util


# ============================================================
# LOAD AI MODEL
# ============================================================

@lru_cache(maxsize=1)
def get_model():

    print("Loading AI model...")

    model = SentenceTransformer(
        "all-MiniLM-L6-v2"
    )

    print("AI model loaded successfully.")

    return model


# ============================================================
# MATCH RESUME SKILLS WITH JOB SKILLS
# ============================================================

def match_skills(resume_skills, job_skills):

    if not job_skills:

        return [], [], 0


    model = get_model()


    # --------------------------------------------------------
    # Encode all skills at once
    # --------------------------------------------------------

    resume_embeddings = model.encode(
        resume_skills,
        convert_to_tensor=True
    )

    job_embeddings = model.encode(
        job_skills,
        convert_to_tensor=True
    )


    # --------------------------------------------------------
    # Calculate similarity
    # --------------------------------------------------------

    similarity_matrix = util.cos_sim(
        job_embeddings,
        resume_embeddings
    )


    matched_skills = []
    missing_skills = []


    # --------------------------------------------------------
    # Find best resume match for every job skill
    # --------------------------------------------------------

    for i, job_skill in enumerate(job_skills):

        best_similarity = similarity_matrix[i].max().item()


        if best_similarity >= 0.50:

            matched_skills.append(
                job_skill
            )

        else:

            missing_skills.append(
                job_skill
            )


    # --------------------------------------------------------
    # Calculate score
    # --------------------------------------------------------

    score = (
        len(matched_skills)
        / len(job_skills)
    ) * 100


    return (
        matched_skills,
        missing_skills,
        score
    )