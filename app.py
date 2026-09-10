import streamlit as st

from src.parser import extract_text_from_pdf
from src.skills import extract_skills
from src.analyzer import extract_required_skills
from src.matcher import match_skills


st.title("AI Resume Analyzer")

st.write("Upload your resume and compare it with a job description.")


# Resume upload
resume_file = st.file_uploader(
    "Upload Resume",
    type=["pdf"]
)


# Job description
job_description = st.text_area(
    "Enter Job Description"
)


# Analyze button
if st.button("Analyze Resume"):

    if resume_file is None:
        st.error("Please upload a resume.")

    elif job_description.strip() == "":
        st.error("Please enter a job description.")

    else:

        # Save uploaded resume temporarily
        with open("resumes/uploaded_resume.pdf", "wb") as file:
            file.write(resume_file.getbuffer())

        # Extract resume text
        resume_text = extract_text_from_pdf(
            "resumes/uploaded_resume.pdf"
        )

        # Extract resume skills
        resume_skills = extract_skills(resume_text)

        # Extract job skills
        job_skills = extract_required_skills(
            job_description
        )

        # Match skills
        matched, missing, score = match_skills(
            resume_skills,
            job_skills
        )

        # Display results
        st.subheader("Resume Skills")

        for skill in resume_skills:
            st.write("•", skill)

        st.subheader("Matched Skills")

        for skill in matched:
            st.write("✅", skill)

        st.subheader("Missing Skills")

        for skill in missing:
            st.write("❌", skill)

        st.subheader("Match Score")

        st.metric(
            "Resume Match",
            f"{score:.2f}%"
        )