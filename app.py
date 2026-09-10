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

from src.matcher import (
    match_skills,
    compare_jobs
)

from src.database import (
    create_database,
    save_analysis,
    get_analysis_history
)


# ============================================================
# DATABASE
# ============================================================

create_database()


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
    "Analyze your resume, compare it with job descriptions "
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
# ANALYZE RESUME
# ============================================================

if st.button(
    "🔍 Analyze Resume",
    type="primary"
):

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
        # SAVE RESUME
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
        # RESUME SKILLS
        # ----------------------------------------------------

        resume_skills = extract_skills(
            resume_text
        )


        # ----------------------------------------------------
        # JOB SKILLS
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


        # ----------------------------------------------------
        # SAVE TO DATABASE
        # ----------------------------------------------------

        save_analysis(
            resume_file.name,
            job_description,
            match_score,
            quality_score,
            matched,
            missing
        )


        # ====================================================
        # RESULTS
        # ====================================================

        st.divider()

        st.header(
            "📊 Resume Analysis Dashboard"
        )


        # ----------------------------------------------------
        # METRICS
        # ----------------------------------------------------

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


        # ----------------------------------------------------
        # CHART
        # ----------------------------------------------------

        st.divider()

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


        # ----------------------------------------------------
        # MATCHED / MISSING
        # ----------------------------------------------------

        st.divider()

        col1, col2 = st.columns(2)

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


        # ----------------------------------------------------
        # RESUME SKILLS
        # ----------------------------------------------------

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


        # ----------------------------------------------------
        # RECOMMENDATIONS
        # ----------------------------------------------------

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


        # ----------------------------------------------------
        # RESUME QUALITY
        # ----------------------------------------------------

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


        # ----------------------------------------------------
        # SUMMARY
        # ----------------------------------------------------

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


# ============================================================
# MULTIPLE JOB COMPARISON
# ============================================================

st.divider()

st.header(
    "🏆 Compare Multiple Jobs"
)

st.write(
    "Compare your resume against multiple job descriptions "
    "and find the job with the highest AI match."
)


# ------------------------------------------------------------
# JOB 1
# ------------------------------------------------------------

job1_title = st.text_input(
    "Job 1 Title",
    placeholder="Example: Python Developer"
)

job1_description = st.text_area(
    "Job 1 Description",
    height=150,
    key="job1_description"
)


# ------------------------------------------------------------
# JOB 2
# ------------------------------------------------------------

job2_title = st.text_input(
    "Job 2 Title",
    placeholder="Example: Machine Learning Engineer"
)

job2_description = st.text_area(
    "Job 2 Description",
    height=150,
    key="job2_description"
)


# ------------------------------------------------------------
# JOB 3
# ------------------------------------------------------------

job3_title = st.text_input(
    "Job 3 Title",
    placeholder="Example: Java Developer"
)

job3_description = st.text_area(
    "Job 3 Description",
    height=150,
    key="job3_description"
)


# ------------------------------------------------------------
# COMPARE BUTTON
# ------------------------------------------------------------

if st.button(
    "🏆 Compare Jobs",
    type="primary"
):

    if resume_file is None:

        st.warning(
            "Please upload your resume first."
        )

    else:

        # ----------------------------------------------------
        # READ RESUME
        # ----------------------------------------------------

        file_extension = (
            resume_file.name
            .split(".")[-1]
            .lower()
        )

        comparison_file_path = (
            f"resumes/comparison_resume.{file_extension}"
        )

        with open(
            comparison_file_path,
            "wb"
        ) as file:

            file.write(
                resume_file.getbuffer()
            )


        resume_text = extract_text(
            comparison_file_path
        )

        resume_skills = extract_skills(
            resume_text
        )


        # ----------------------------------------------------
        # PREPARE JOBS
        # ----------------------------------------------------

        jobs = []

        if (
            job1_title.strip()
            and job1_description.strip()
        ):

            jobs.append(
                {
                    "title": job1_title,
                    "skills": extract_required_skills(
                        job1_description
                    )
                }
            )


        if (
            job2_title.strip()
            and job2_description.strip()
        ):

            jobs.append(
                {
                    "title": job2_title,
                    "skills": extract_required_skills(
                        job2_description
                    )
                }
            )


        if (
            job3_title.strip()
            and job3_description.strip()
        ):

            jobs.append(
                {
                    "title": job3_title,
                    "skills": extract_required_skills(
                        job3_description
                    )
                }
            )


        if not jobs:

            st.warning(
                "Please enter at least one complete job."
            )

        else:

            # ------------------------------------------------
            # COMPARE
            # ------------------------------------------------

            with st.spinner(
                "🤖 Comparing jobs using AI..."
            ):

                comparison_results = compare_jobs(
                    resume_skills,
                    jobs
                )


            # ------------------------------------------------
            # RESULTS
            # ------------------------------------------------

            st.divider()

            st.subheader(
                "🏆 Job Comparison Results"
            )


            # ------------------------------------------------
            # BEST JOB
            # ------------------------------------------------

            best_job = comparison_results[0]

            st.success(
                f"🏆 Best Match: {best_job['job_title']} "
                f"({best_job['match_score']:.1f}%)"
            )


            # ------------------------------------------------
            # TABLE
            # ------------------------------------------------

            comparison_table = pd.DataFrame(
                [
                    {
                        "Job": result["job_title"],
                        "AI Match Score": (
                            f"{result['match_score']:.1f}%"
                        ),
                        "Matched Skills": len(
                            result["matched_skills"]
                        ),
                        "Missing Skills": len(
                            result["missing_skills"]
                        )
                    }

                    for result in comparison_results
                ]
            )


            st.dataframe(
                comparison_table,
                use_container_width=True,
                hide_index=True
            )


            # ------------------------------------------------
            # COMPARISON CHART
            # ------------------------------------------------

            st.subheader(
                "📊 Job Match Comparison"
            )

            chart_jobs = [
                result["job_title"]
                for result in comparison_results
            ]

            chart_scores = [
                result["match_score"]
                for result in comparison_results
            ]

            fig, ax = plt.subplots()

            ax.bar(
                chart_jobs,
                chart_scores
            )

            ax.set_ylabel(
                "AI Match Score (%)"
            )

            ax.set_xlabel(
                "Job"
            )

            ax.set_title(
                "Resume Match Across Jobs"
            )

            ax.set_ylim(
                0,
                100
            )

            plt.xticks(
                rotation=20
            )

            st.pyplot(
                fig
            )


            # ------------------------------------------------
            # DETAILS
            # ------------------------------------------------

            st.subheader(
                "🔍 Detailed Comparison"
            )

            for result in comparison_results:

                with st.expander(
                    f"{result['job_title']} — "
                    f"{result['match_score']:.1f}%"
                ):

                    st.write(
                        "### ✅ Matched Skills"
                    )

                    if result["matched_skills"]:

                        for skill in result[
                            "matched_skills"
                        ]:

                            st.write(
                                f"✅ {skill}"
                            )

                    else:

                        st.write(
                            "No matched skills."
                        )


                    st.write(
                        "### ❌ Missing Skills"
                    )

                    if result["missing_skills"]:

                        for skill in result[
                            "missing_skills"
                        ]:

                            st.write(
                                f"❌ {skill}"
                            )

                    else:

                        st.write(
                            "No missing skills."
                        )


# ============================================================
# ANALYSIS HISTORY
# ============================================================

st.divider()

st.header(
    "🗂️ Analysis History"
)

history = get_analysis_history()

if history:

    history_data = pd.DataFrame(
        history,
        columns=[
            "ID",
            "Resume",
            "Match Score",
            "Quality Score",
            "Matched Skills",
            "Missing Skills",
            "Analyzed At"
        ]
    )

    st.dataframe(
        history_data,
        use_container_width=True,
        hide_index=True
    )

else:

    st.info(
        "No previous analyses found."
    )