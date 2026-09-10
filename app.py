import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

from src.parser import extract_text
from src.skills import extract_skills

from src.analyzer import (
    extract_required_skills,
    generate_recommendations,
    analyze_resume_quality
)

from src.matcher import match_skills


# ============================================================
# PAGE SETTINGS
# ============================================================

st.set_page_config(
    page_title="AI Resume Analyzer",
    page_icon="📄",
    layout="wide"
)


# ============================================================
# TITLE
# ============================================================

st.title("📄 AI Resume Analyzer")

st.write(
    "Analyze your resume, compare it with a job description "
    "and receive AI-powered recommendations."
)

st.divider()


# ============================================================
# SIDEBAR
# ============================================================

st.sidebar.title("⚙️ Resume Analyzer")

st.sidebar.info(
    "Upload a resume and provide a job description "
    "to analyze your compatibility."
)


# ============================================================
# RESUME UPLOAD
# ============================================================

resume_file = st.file_uploader(
    "📤 Upload Your Resume",
    type=["pdf", "docx"]
)


# ============================================================
# JOB DESCRIPTION
# ============================================================

job_description = st.text_area(
    "💼 Enter Job Description",
    height=220,
    placeholder="Paste the complete job description here..."
)


# ============================================================
# ANALYZE BUTTON
# ============================================================

if st.button(
    "🔍 Analyze Resume",
    type="primary"
):

    # --------------------------------------------------------
    # VALIDATION
    # --------------------------------------------------------

    if resume_file is None:

        st.warning(
            "Please upload a resume PDF or DOCX."
        )

    elif not job_description.strip():

        st.warning(
            "Please enter a job description."
        )

    else:

        # ----------------------------------------------------
        # SAVE UPLOADED RESUME
        # ----------------------------------------------------

        file_extension = (
            resume_file.name
            .split(".")[-1]
            .lower()
        )

        uploaded_file_path = (
            f"resumes/uploaded_resume.{file_extension}"
        )

        with open(
            uploaded_file_path,
            "wb"
        ) as file:

            file.write(
                resume_file.getbuffer()
            )


        # ----------------------------------------------------
        # EXTRACT RESUME TEXT
        # ----------------------------------------------------

        with st.spinner(
            "📄 Reading your resume..."
        ):

            resume_text = extract_text(
                uploaded_file_path
            )


        # ----------------------------------------------------
        # EXTRACT RESUME SKILLS
        # ----------------------------------------------------

        resume_skills = extract_skills(
            resume_text
        )


        # ----------------------------------------------------
        # EXTRACT JOB SKILLS
        # ----------------------------------------------------

        job_skills = extract_required_skills(
            job_description
        )


        # ----------------------------------------------------
        # AI MATCHING
        # ----------------------------------------------------

        with st.spinner(
            "🤖 Performing AI skill matching..."
        ):

            matched, missing, match_score = match_skills(
                resume_skills,
                job_skills
            )


        # ----------------------------------------------------
        # RECOMMENDATIONS
        # ----------------------------------------------------

        recommendations = generate_recommendations(
            missing
        )


        # ----------------------------------------------------
        # RESUME QUALITY
        # ----------------------------------------------------

        quality_score, quality_suggestions = (
            analyze_resume_quality(
                resume_text
            )
        )


        # ====================================================
        # DASHBOARD
        # ====================================================

        st.divider()

        st.header("📊 Resume Analysis Dashboard")


        # ====================================================
        # SCORE CARDS
        # ====================================================

        col1, col2, col3, col4 = st.columns(4)


        with col1:

            st.metric(
                "🤖 Job Match",
                f"{match_score:.1f}%"
            )


        with col2:

            st.metric(
                "📄 Resume Quality",
                f"{quality_score:.1f}%"
            )


        with col3:

            st.metric(
                "✅ Matched Skills",
                len(matched)
            )


        with col4:

            st.metric(
                "❌ Missing Skills",
                len(missing)
            )


        st.divider()


        # ====================================================
        # SKILL DISTRIBUTION CHART
        # ====================================================

        st.subheader(
            "📈 Skill Matching Overview"
        )


        chart_data = pd.DataFrame(
            {
                "Category": [
                    "Matched",
                    "Missing"
                ],

                "Skills": [
                    len(matched),
                    len(missing)
                ]
            }
        )


        fig, ax = plt.subplots()

        ax.bar(
            chart_data["Category"],
            chart_data["Skills"]
        )

        ax.set_ylabel(
            "Number of Skills"
        )

        ax.set_title(
            "Resume vs Job Skills"
        )

        st.pyplot(
            fig
        )


        # ====================================================
        # SKILL DETAILS
        # ====================================================

        st.divider()

        col1, col2 = st.columns(2)


        # ----------------------------------------------------
        # MATCHED
        # ----------------------------------------------------

        with col1:

            st.subheader(
                "✅ Matched Skills"
            )

            if matched:

                for skill in matched:

                    st.success(
                        skill
                    )

            else:

                st.write(
                    "No matching skills found."
                )


        # ----------------------------------------------------
        # MISSING
        # ----------------------------------------------------

        with col2:

            st.subheader(
                "❌ Missing Skills"
            )

            if missing:

                for skill in missing:

                    st.error(
                        skill
                    )

            else:

                st.success(
                    "No missing skills! 🎉"
                )


        # ====================================================
        # ALL RESUME SKILLS
        # ====================================================

        st.divider()

        st.subheader(
            "🧑‍💻 Skills Detected in Resume"
        )


        if resume_skills:

            skill_columns = st.columns(4)

            for index, skill in enumerate(
                resume_skills
            ):

                with skill_columns[
                    index % 4
                ]:

                    st.write(
                        f"• {skill}"
                    )

        else:

            st.warning(
                "No recognized skills found."
            )


        # ====================================================
        # JOB RECOMMENDATIONS
        # ====================================================

        st.divider()

        st.subheader(
            "💡 Job Match Recommendations"
        )


        if recommendations:

            for recommendation in recommendations:

                st.info(
                    recommendation
                )

        else:

            st.success(
                "Your resume covers all detected job skills! 🎉"
            )


        # ====================================================
        # RESUME QUALITY
        # ====================================================

        st.divider()

        st.subheader(
            "📄 Resume Quality Analysis"
        )


        if quality_score >= 80:

            st.success(
                "Excellent resume structure! 🎉"
            )

        elif quality_score >= 60:

            st.info(
                "Your resume is good, but there is room for improvement."
            )

        else:

            st.warning(
                "Your resume needs improvement."
            )


        # ====================================================
        # QUALITY SUGGESTIONS
        # ====================================================

        if quality_suggestions:

            st.write(
                "### 🔧 Resume Improvement Suggestions"
            )

            for suggestion in quality_suggestions:

                st.write(
                    f"• {suggestion}"
                )

        else:

            st.success(
                "No major resume quality issues detected!"
            )


        # ====================================================
        # ANALYSIS SUMMARY
        # ====================================================

        st.divider()

        st.subheader(
            "📋 Analysis Summary"
        )


        summary_data = pd.DataFrame(
            {
                "Metric": [
                    "Resume Skills",
                    "Required Job Skills",
                    "Matched Skills",
                    "Missing Skills",
                    "AI Job Match",
                    "Resume Quality"
                ],

                "Value": [
                    len(resume_skills),
                    len(job_skills),
                    len(matched),
                    len(missing),
                    f"{match_score:.1f}%",
                    f"{quality_score:.1f}%"
                ]
            }
        )


        st.dataframe(
            summary_data,
            use_container_width=True,
            hide_index=True
        )