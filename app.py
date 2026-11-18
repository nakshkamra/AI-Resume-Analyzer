from __future__ import annotations

from datetime import datetime
from pathlib import Path
from tempfile import NamedTemporaryFile
from typing import Any

import pandas as pd
import streamlit as st

from src.analyzer import (
    analyze_resume_quality,
    extract_required_skills,
    generate_recommendations,
)
from src.database import DATABASE, create_database, get_analysis_history, save_analysis
from src.matcher import compare_jobs, match_skills
from src.parser import extract_text
from src.skills import extract_skills
from src.ui import (
    inject_styles,
    render_brand,
    render_empty_state,
    render_feature_card,
    render_file_card,
    render_hero_visual,
    render_note_card,
    render_role_card,
    render_score_hero,
    render_stat_card,
)


st.set_page_config(
    page_title="CareerFit · Your career, decoded",
    page_icon=":material/target:",
    layout="wide",
    initial_sidebar_state="expanded",
)
inject_styles()


def open_analysis_form() -> None:
    st.session_state["analysis_form_open"] = True


def close_analysis_form() -> None:
    st.session_state["analysis_form_open"] = False


def toggle_capabilities() -> None:
    st.session_state["capabilities_open"] = not st.session_state.get(
        "capabilities_open", False
    )


def navigate_workspace(page: str) -> None:
    st.session_state["workspace_page"] = page
    if page == "Analyze Resume":
        open_analysis_form()


def read_uploaded_resume(uploaded_file: Any) -> str:
    """Extract a resume from a temporary file and remove it after parsing."""
    suffix = Path(uploaded_file.name).suffix.lower()
    temporary_path: str | None = None
    try:
        with NamedTemporaryFile(delete=False, suffix=suffix) as temporary_file:
            temporary_file.write(uploaded_file.getvalue())
            temporary_path = temporary_file.name
        return extract_text(temporary_path)
    finally:
        if temporary_path:
            Path(temporary_path).unlink(missing_ok=True)


def analyze_resume(
    uploaded_file: Any,
    job_title: str,
    job_description: str,
) -> dict[str, Any]:
    resume_text = read_uploaded_resume(uploaded_file)
    resume_skills = extract_skills(resume_text)
    job_skills = extract_required_skills(job_description)

    matched: list[str] = []
    missing: list[str] = []
    match_score: float | None = None
    match_error: str | None = None

    if job_skills and resume_skills:
        try:
            matched, missing, match_score = match_skills(resume_skills, job_skills)
        except Exception:
            match_error = (
                "Semantic matching could not finish. Check your connection and try again; "
                "your resume was still parsed successfully."
            )
    elif not job_skills:
        match_error = (
            "No supported technical skills were identified in the job description. "
            "Add explicit skills such as Python, SQL, Java, or Git to calculate a match."
        )
    else:
        missing = job_skills.copy()
        match_score = 0.0

    quality_score, quality_suggestions = analyze_resume_quality(resume_text)
    recommendations = generate_recommendations(missing)
    target_role = job_title.strip() or "Target role"
    result = {
        "resume_name": uploaded_file.name,
        "job_title": target_role,
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "matched": matched,
        "missing": missing,
        "match_score": match_score,
        "match_error": match_error,
        "quality_score": quality_score,
        "quality_suggestions": quality_suggestions,
        "recommendations": recommendations,
        "analyzed_at": datetime.now().strftime("%d %b %Y · %I:%M %p"),
    }

    # The resume document and extracted text are not retained in the database.
    try:
        create_database()
        save_analysis(
            uploaded_file.name,
            job_description,
            match_score,
            quality_score,
            matched,
            missing,
            job_title=target_role,
        )
    except Exception:
        result["history_error"] = True
    return result


def render_skill_badges(skills: list[str], color: str, empty_message: str) -> None:
    if not skills:
        st.caption(empty_message)
        return
    with st.container(horizontal=True, wrap=True):
        for skill in skills:
            st.badge(skill, color=color)


def render_landing_page() -> None:
    hero_copy, hero_visual = st.columns([1.15, 0.85], gap="large", vertical_alignment="center")
    with hero_copy:
        st.html(
            """
            <section class="cf-hero">
              <div class="cf-eyebrow"><span class="cf-eyebrow-dot"></span>Career intelligence, made clear</div>
              <h1>Make your next career move with confidence.</h1>
              <p>Understand your strengths, uncover skill gaps, and discover how well your experience aligns with your next opportunity.</p>
              <div class="cf-hero-trust">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2.5 4 5v4.2c0 3.8 2.6 6.8 6 8.3 3.4-1.5 6-4.5 6-8.3V5l-6-2.5Z" stroke="currentColor" stroke-width="1.5"/><path d="m7.2 9.8 1.8 1.8 3.8-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Resume files are processed temporarily and removed after extraction.
              </div>
            </section>
            """
        )
    with hero_visual:
        render_hero_visual()

    primary_cta, secondary_cta = st.columns([1, 1], gap="small")
    with primary_cta:
        st.button(
            "Analyze my resume",
            key="hero_analyze",
            type="primary",
            icon=":material/arrow_forward:",
            width="stretch",
            on_click=open_analysis_form,
        )
    with secondary_cta:
        explore_label = "Hide capabilities" if st.session_state.get("capabilities_open") else "Explore capabilities"
        st.button(
            explore_label,
            key="hero_explore",
            icon=":material/keyboard_arrow_down:",
            width="stretch",
            on_click=toggle_capabilities,
        )

    if st.session_state.get("capabilities_open"):
        st.html('<div class="cf-section-kicker">A clearer view of your next move</div>')
        feature_columns = st.columns(3, gap="medium")
        features = [
            ("01 / ALIGNMENT", "Understand role fit", "Compare supported resume skills with the requirements in a target job description."),
            ("02 / SIGNALS", "See what stands out", "Review detected strengths and a lightweight structure check based on the resume text."),
            ("03 / DIRECTION", "Plan your next step", "Compare up to three roles, surface skill gaps, and get focused recommendations."),
        ]
        for column, feature in zip(feature_columns, features):
            with column:
                render_feature_card(*feature)
        st.caption(
            "CareerFit uses a supported skill vocabulary and semantic similarity. "
            "Its scores are guidance, not an ATS or hiring guarantee."
        )


def render_analysis_result(result: dict[str, Any]) -> None:
    st.html('<div class="cf-section-kicker">Your career intelligence report</div>')
    render_score_hero(
        result["match_score"],
        result["job_title"],
        result["resume_name"],
        result["analyzed_at"],
    )

    if result.get("match_error"):
        st.info(result["match_error"], icon=":material/info:")
    if result.get("history_error"):
        st.warning("Your report is ready, but the analysis could not be saved to history.")

    stat_columns = st.columns(3, gap="medium")
    with stat_columns[0]:
        render_stat_card(str(len(result["resume_skills"])), "Supported skills found", "In your resume")
    with stat_columns[1]:
        render_stat_card(str(len(result["matched"])), "Relevant strengths", "Matched to this role")
    with stat_columns[2]:
        render_stat_card(str(len(result["missing"])), "Growth opportunities", "Skills to strengthen")

    skills_tab, quality_tab, action_tab = st.tabs(
        ["Skill fit", "Resume signals", "Action plan"]
    )

    with skills_tab:
        st.html('<div class="cf-section-kicker">Where your experience connects</div>')
        strengths_column, gaps_column = st.columns(2, gap="medium")
        with strengths_column:
            with st.container(border=True):
                st.markdown(f"#### Relevant strengths · {len(result['matched'])}")
                render_skill_badges(
                    result["matched"],
                    "green",
                    "No supported skills matched this job description yet.",
                )
                if result["matched"]:
                    render_note_card(
                        "Your existing signal",
                        "These skills appeared in your resume and aligned with supported requirements in this role.",
                        "strength",
                    )
        with gaps_column:
            with st.container(border=True):
                st.markdown(f"#### Skills to develop · {len(result['missing'])}")
                render_skill_badges(
                    result["missing"],
                    "orange",
                    "No skill gaps were found in the supported skill list.",
                )
                if result["missing"]:
                    render_note_card(
                        "A focused next step",
                        "Prioritize these requirements when choosing a project, course, or resume example to strengthen.",
                        "gap",
                    )
        st.caption(
            "Only skills in CareerFit's current supported vocabulary are included in this comparison."
        )

    with quality_tab:
        st.html('<div class="cf-section-kicker">Resume structure signals</div>')
        quality_score = float(result["quality_score"])
        quality_columns = st.columns([1, 1.5], gap="medium")
        with quality_columns[0]:
            st.metric("Structure score", f"{quality_score:.0f}%")
            st.progress(quality_score / 100)
            render_note_card(
                "What this checks",
                "Resume length, contact details, common section headings, and action-oriented wording.",
            )
        with quality_columns[1]:
            st.markdown("#### Improvement signals")
            if result["quality_suggestions"]:
                for suggestion in result["quality_suggestions"]:
                    st.markdown(f"- {suggestion}")
            else:
                st.success("No structural suggestions were identified by the current checks.")
        st.caption("This is a lightweight structure review, not a full ATS parser or formatting scan.")

    with action_tab:
        st.html('<div class="cf-section-kicker">Turn insight into action</div>')
        st.markdown("#### Recommended next steps")
        if result["recommendations"]:
            for index, recommendation in enumerate(result["recommendations"], start=1):
                st.markdown(f"**{index:02d}** · {recommendation}")
        else:
            st.success("Your resume covers the supported skills detected for this role.")

        if result["quality_suggestions"]:
            st.markdown("#### Resume edits to consider")
            for suggestion in result["quality_suggestions"]:
                st.markdown(f"- {suggestion}")

    report_lines = [
        "# CareerFit analysis",
        f"- Resume: {result['resume_name']}",
        f"- Target role: {result['job_title']}",
        f"- Analyzed: {result['analyzed_at']}",
        f"- Role match: {result['match_score']:.1f}%" if result["match_score"] is not None else "- Role match: unavailable",
        f"- Resume structure: {result['quality_score']:.1f}%",
        f"- Relevant strengths: {', '.join(result['matched']) or 'None'}",
        f"- Skills to develop: {', '.join(result['missing']) or 'None'}",
        "",
        "## Recommendations",
        *[f"- {item}" for item in result["recommendations"]],
        "",
        "## Resume structure signals",
        *[f"- {item}" for item in result["quality_suggestions"]],
    ]
    st.download_button(
        "Download report",
        data="\n".join(report_lines),
        file_name="careerfit-analysis.md",
        mime="text/markdown",
        key="download_analysis",
        icon=":material/download:",
    )


def render_analysis_form() -> None:
    st.title("Make your next career move with confidence.", icon=":material/analytics:")
    st.caption("Understand your strengths, uncover skill gaps, and discover how well your experience aligns with your next opportunity.")

    st.button(
        "Back to overview",
        key="back_overview",
        icon=":material/arrow_back:",
        on_click=close_analysis_form,
    )

    with st.container(border=True):
        st.markdown("#### Resume document")
        st.html(
            '<p class="cf-upload-note">Choose a PDF or DOCX resume to begin. Files are parsed temporarily and are not saved as documents.</p>'
        )
        resume_file = st.file_uploader(
            "Choose a PDF or DOCX resume",
            type=["pdf", "docx"],
            key="analysis_resume_upload",
            label_visibility="collapsed",
            help="PDF and DOCX files are supported. Use the remove control on the selected file to replace it.",
        )
        if resume_file is not None:
            render_file_card(resume_file.name, resume_file.size)

    with st.form("resume_analysis_form", border=False):
        st.markdown("#### Target role")
        job_title = st.text_input(
            "Role title",
            placeholder="e.g. Data analyst, product designer, or Python developer",
        )
        job_description = st.text_area(
            "Job description",
            height=190,
            placeholder="Paste the role responsibilities, qualifications, and skills you want to compare against.",
        )
        submitted = st.form_submit_button(
            "Analyze my resume",
            key="form_analyze",
            type="primary",
            icon=":material/auto_awesome:",
            width="stretch",
        )

    if submitted:
        if resume_file is None:
            st.warning("Choose a PDF or DOCX resume to continue.", icon=":material/upload_file:")
        elif not job_description.strip():
            st.warning("Add a job description so CareerFit can assess role alignment.")
        else:
            try:
                with st.status("Reading your career signal", expanded=True) as status:
                    st.write("Extracting text from the uploaded resume")
                    st.write("Identifying skills and resume structure signals")
                    st.write("Comparing your profile with the target role")
                    result = analyze_resume(resume_file, job_title, job_description)
                    status.update(label="Your assessment is ready", state="complete", expanded=False)
                st.session_state["analysis_result"] = result
                st.toast("CareerFit assessment complete", icon=":material/check_circle:")
            except Exception:
                st.error(
                    "We couldn't read this document. Try a text-based PDF or a valid DOCX file.",
                    icon=":material/error:",
                )

    result = st.session_state.get("analysis_result")
    if result:
        render_analysis_result(result)


def render_comparison_results(results: list[dict[str, Any]], resume_name: str) -> None:
    st.html('<div class="cf-section-kicker">Role landscape</div>')
    st.caption(f"Compared against supported skills found in {resume_name}.")

    if not results:
        render_empty_state("No comparable roles", "Add at least one role with recognizable skills.")
        return

    best_job = results[0]
    st.html(
        f"""
        <div class="cf-result-eyebrow">Closest current fit</div>
        <h2 style="margin:.25rem 0 .2rem;color:#172F2A;letter-spacing:-.04em">{best_job['job_title']}</h2>
        <p style="margin:0 0 .7rem;color:#777B73;font-size:.85rem">Roles are ranked by semantic similarity across supported skills.</p>
        """
    )
    for rank, result in enumerate(results, start=1):
        render_role_card(
            rank,
            result["job_title"],
            result["match_score"],
            len(result["matched_skills"]),
            len(result["missing_skills"]),
        )

    st.html('<div class="cf-section-kicker">Role-by-role signal</div>')
    for result in results:
        with st.expander(f"{result['job_title']} · {result['match_score']:.0f}% match"):
            matched_column, missing_column = st.columns(2, gap="medium")
            with matched_column:
                st.markdown("#### Relevant strengths")
                render_skill_badges(
                    result["matched_skills"],
                    "green",
                    "No supported skills matched this role.",
                )
            with missing_column:
                st.markdown("#### Skills to develop")
                render_skill_badges(
                    result["missing_skills"],
                    "orange",
                    "No skill gaps were found in the supported list.",
                )


def render_compare_page() -> None:
    st.title("Compare roles", icon=":material/compare_arrows:")
    st.write(
        "See where your current skills align across up to three opportunities, "
        "then focus on the differences that matter."
    )

    with st.form("role_comparison_form", border=True):
        st.markdown("#### Resume to compare")
        resume_file = st.file_uploader(
            "Choose a PDF or DOCX resume",
            type=["pdf", "docx"],
            key="comparison_resume_upload",
            help="PDF and DOCX formats are supported.",
        )
        if resume_file is not None:
            st.caption(f"{resume_file.name} · {resume_file.size / 1024:.0f} KB")

        st.markdown("#### Opportunities")
        role_inputs: list[tuple[str, str]] = []
        role_tabs = st.tabs(["Role 1", "Role 2", "Role 3"])
        for index, role_tab in enumerate(role_tabs, start=1):
            with role_tab:
                title = st.text_input(
                    "Role title",
                    placeholder="e.g. Product analyst",
                    key=f"comparison_title_{index}",
                )
                description = st.text_area(
                    "Job description",
                    height=170,
                    placeholder="Paste the skills and requirements for this role.",
                    key=f"comparison_description_{index}",
                )
                role_inputs.append((title, description))

        submitted = st.form_submit_button(
            "Compare roles",
            key="compare_submit",
            type="primary",
            icon=":material/compare_arrows:",
            width="stretch",
        )

    if submitted:
        if resume_file is None:
            st.warning("Choose a resume before comparing roles.", icon=":material/upload_file:")
        else:
            try:
                resume_text = read_uploaded_resume(resume_file)
                resume_skills = extract_skills(resume_text)
                if not resume_skills:
                    st.warning("No supported technical skills were found in this resume.")
                else:
                    jobs: list[dict[str, Any]] = []
                    incomplete_roles: list[str] = []
                    unsupported_roles: list[str] = []

                    for index, (title, description) in enumerate(role_inputs, start=1):
                        if not title.strip() and not description.strip():
                            continue
                        if not title.strip() or not description.strip():
                            incomplete_roles.append(f"Role {index}")
                            continue
                        role_skills = extract_required_skills(description)
                        if not role_skills:
                            unsupported_roles.append(title.strip())
                            continue
                        jobs.append({"title": title.strip(), "skills": role_skills})

                    if incomplete_roles:
                        st.warning(
                            f"Complete both title and description for {', '.join(incomplete_roles)}."
                        )
                    if unsupported_roles:
                        st.warning(
                            "No supported skills were recognized for: "
                            f"{', '.join(unsupported_roles)}. Add explicit technical skills."
                        )

                    if not jobs:
                        st.warning("Add at least one complete role with recognizable skills.")
                    else:
                        with st.spinner("Comparing role requirements…"):
                            comparison_results = compare_jobs(resume_skills, jobs)
                        st.session_state["comparison_result"] = {
                            "results": comparison_results,
                            "resume_name": resume_file.name,
                        }
            except Exception:
                st.error(
                    "We couldn't read this resume or compare the roles. Check the file and try again.",
                    icon=":material/error:",
                )

    comparison = st.session_state.get("comparison_result")
    if comparison:
        render_comparison_results(comparison["results"], comparison["resume_name"])
    else:
        st.html('<div class="cf-section-kicker">How comparison works</div>')
        render_note_card(
            "One resume · up to three roles",
            "CareerFit ranks roles using semantic similarity between supported skills found in your resume and each job description.",
        )


def render_history_page() -> None:
    st.title("Analysis history", icon=":material/history:")
    st.write("A private activity log of the resume assessments saved by this app.")

    try:
        history = get_analysis_history() if Path(DATABASE).exists() else []
    except Exception:
        st.error("Analysis history is unavailable right now.", icon=":material/error:")
        return

    if not history:
        render_empty_state(
            "Your next step starts here",
            "Complete a resume analysis and your role, scores, and skill signals will be listed here.",
        )
        return

    history_table = pd.DataFrame(
        history,
        columns=[
            "ID",
            "Resume file",
            "Target role",
            "Role match",
            "Resume quality",
            "Relevant strengths",
            "Skills to develop",
            "Analyzed at",
        ],
    )
    history_table["Target role"] = history_table["Target role"].fillna("Role not recorded")
    history_table["Role match"] = pd.to_numeric(history_table["Role match"], errors="coerce")
    history_table["Resume quality"] = pd.to_numeric(
        history_table["Resume quality"], errors="coerce"
    )

    stats_columns = st.columns(3, gap="medium")
    with stats_columns[0]:
        render_stat_card(str(len(history_table)), "Assessments", "Saved in this workspace")
    with stats_columns[1]:
        average_match = history_table["Role match"].mean()
        value = f"{average_match:.0f}%" if pd.notna(average_match) else "—"
        render_stat_card(value, "Average role match", "Across recorded analyses")
    with stats_columns[2]:
        average_quality = history_table["Resume quality"].mean()
        value = f"{average_quality:.0f}%" if pd.notna(average_quality) else "—"
        render_stat_card(value, "Average structure score", "Across recorded analyses")

    filter_column, download_column = st.columns([3, 1], vertical_alignment="bottom")
    with filter_column:
        search = st.text_input(
            "Search history",
            placeholder="Find a resume or target role",
            icon=":material/search:",
        )
    with download_column:
        st.download_button(
            "Download CSV",
            data=history_table.to_csv(index=False).encode("utf-8"),
            file_name="careerfit-analysis-history.csv",
            mime="text/csv",
            icon=":material/download:",
            width="stretch",
        )

    if search.strip():
        search_value = search.strip()
        filtered = history_table[
            history_table["Resume file"].str.contains(search_value, case=False, na=False)
            | history_table["Target role"].str.contains(search_value, case=False, na=False)
        ]
    else:
        filtered = history_table

    st.dataframe(
        filtered.drop(columns=["ID"]),
        hide_index=True,
        column_config={
            "Role match": st.column_config.ProgressColumn(
                "Role match",
                min_value=0,
                max_value=100,
                format="%.0f%%",
            ),
            "Resume quality": st.column_config.ProgressColumn(
                "Resume quality",
                min_value=0,
                max_value=100,
                format="%.0f%%",
            ),
        },
    )
    st.caption(
        "History stores resume file names, target roles, job descriptions, scores, and skill lists. "
        "The uploaded resume document itself is not retained."
    )


def render_sidebar() -> str:
    with st.sidebar:
        render_brand()
        current_page = st.session_state.get("workspace_page", "Analyze Resume")
        navigation = [
            ("Analyze Resume", "nav_analyze", ":material/analytics:"),
            ("Compare Roles", "nav_compare", ":material/compare_arrows:"),
            ("Analysis History", "nav_history", ":material/history:"),
        ]
        for page, key, icon in navigation:
            if current_page == page:
                st.html(
                    f'<style>.st-key-{key} button{{background:#C49A62;color:#172F2A;border-color:#C49A62;font-weight:700}}'
                    f'.st-key-{key} button:hover{{background:#D2AE7D;color:#172F2A}}</style>'
                )
            st.button(
                page,
                key=key,
                type="primary" if current_page == page else "secondary",
                icon=icon,
                width="stretch",
                on_click=navigate_workspace,
                args=(page,),
            )

        st.markdown(" ")
        st.html(
            '<div class="cf-sidebar-note">Your resume is processed in a temporary file. '
            'History keeps the role, job text, scores, and skill signals.</div>'
        )
    return st.session_state.get("workspace_page", "Analyze Resume")


st.session_state.setdefault("workspace_page", "Analyze Resume")
st.session_state.setdefault("analysis_form_open", False)
st.session_state.setdefault("capabilities_open", False)
workspace_page = render_sidebar()

if workspace_page == "Analyze Resume":
    if st.session_state.get("analysis_form_open"):
        render_analysis_form()
    else:
        render_landing_page()
        result = st.session_state.get("analysis_result")
        if result:
            st.html('<div class="cf-section-kicker">Your latest assessment</div>')
            render_analysis_result(result)
elif workspace_page == "Compare Roles":
    render_compare_page()
else:
    render_history_page()
