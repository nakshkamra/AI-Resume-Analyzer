"""Reusable CareerFit presentation components for the Streamlit interface."""

from __future__ import annotations

from html import escape

import streamlit as st


CAREERFIT_STYLES = """
<style>
:root { --cf-forest:#172F2A; --cf-ivory:#F6F3EB; --cf-cream:#FFFEFA; --cf-gold:#C49A62; --cf-sage:#DCE8DF; --cf-terracotta:#E9DED1; --cf-charcoal:#282D2A; --cf-muted:#777B73; --cf-border:#E6E1D7; }
.cf-brand { display:flex; align-items:center; gap:.75rem; padding:.45rem .15rem 1.2rem; }
.cf-brand-mark { display:grid; width:2.55rem; height:2.55rem; place-items:center; border:1px solid rgba(196,154,98,.62); border-radius:.75rem; color:#E4C99F; background:#203B35; }
.cf-brand-monogram { font-family:Manrope,sans-serif; font-size:1.35rem; font-weight:800; letter-spacing:-.08em; }
.cf-brand-name { color:#FFFEFA; font-family:Manrope,sans-serif; font-size:1.08rem; font-weight:700; letter-spacing:-.035em; line-height:1.1; }
.cf-brand-tagline { margin-top:.28rem; color:#C4CFC8; font-size:.73rem; }
.cf-side-label { margin:.15rem 0 .7rem .15rem; color:#C4CFC8; font-size:.64rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase; }
.cf-hero { position:relative; overflow:hidden; min-height:20rem; padding:clamp(1.7rem,3.6vw,3.2rem); border:1px solid var(--cf-border); border-radius:1.25rem; background:var(--cf-cream); box-shadow:0 12px 34px rgba(40,45,42,.045); }
.cf-hero::after { position:absolute; right:-5rem; bottom:-11rem; width:21rem; height:21rem; border:1px solid rgba(196,154,98,.28); border-radius:50%; box-shadow:0 0 0 2.2rem rgba(196,154,98,.06),0 0 0 4.5rem rgba(196,154,98,.035); content:""; pointer-events:none; }
.cf-eyebrow { display:inline-flex; align-items:center; gap:.55rem; color:var(--cf-forest); font-size:.68rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; }.cf-eyebrow-dot { width:.42rem; height:.42rem; border-radius:50%; background:var(--cf-gold); }
.cf-hero h1 { position:relative; z-index:1; max-width:40rem; margin:1.2rem 0 .9rem; color:var(--cf-forest); font-family:Manrope,sans-serif; font-size:clamp(2.1rem,4vw,3.3rem); font-weight:700; letter-spacing:-.055em; line-height:1.08; }
.cf-hero p { position:relative; z-index:1; max-width:39rem; margin:0; color:var(--cf-muted); font-size:.98rem; line-height:1.75; }.cf-hero-trust { display:flex; align-items:center; gap:.6rem; margin-top:1.45rem; color:var(--cf-muted); font-size:.75rem; }.cf-hero-trust svg { width:1rem; height:1rem; color:var(--cf-forest); flex:none; }
.cf-intel-visual { position:relative; display:flex; min-height:20rem; height:100%; align-items:center; justify-content:center; overflow:hidden; border-radius:1.25rem; background:var(--cf-forest); }.cf-intel-visual::before,.cf-intel-visual::after { position:absolute; width:14rem; height:14rem; border:1px solid rgba(255,254,250,.12); border-radius:50%; content:""; }.cf-intel-visual::after { width:19rem; height:19rem; border-color:rgba(196,154,98,.28); }
.cf-map-network { position:relative; z-index:1; width:min(78%,17rem); aspect-ratio:1.2; }.cf-map-line { position:absolute; z-index:0; left:50%; top:50%; height:1px; transform-origin:left center; background:linear-gradient(90deg,rgba(255,254,250,.08),rgba(196,154,98,.7)); }.cf-map-line-a { width:45%; transform:rotate(204deg); }.cf-map-line-b { width:45%; transform:rotate(332deg); }.cf-map-line-c { width:43%; transform:rotate(126deg); }.cf-map-line-d { width:45%; transform:rotate(28deg); }
.cf-map-core { position:absolute; z-index:2; left:50%; top:50%; display:grid; width:4.4rem; aspect-ratio:1; place-items:center; transform:translate(-50%,-50%); border:1px solid rgba(196,154,98,.8); border-radius:50%; color:#E4C99F; background:#203B35; font-size:.65rem; font-weight:800; letter-spacing:.12em; }.cf-map-node { position:absolute; z-index:2; display:grid; min-width:2.25rem; height:2.25rem; padding:0 .5rem; place-items:center; border:1px solid rgba(255,254,250,.35); border-radius:999px; color:#FFFEFA; background:#203B35; font-size:.58rem; font-weight:700; }.cf-map-node-a { left:4%; top:8%; }.cf-map-node-b { right:1%; top:19%; border-color:#C49A62; color:#172F2A; background:#C49A62; }.cf-map-node-c { left:12%; bottom:3%; }.cf-map-node-d { right:5%; bottom:8%; }.cf-map-node-e { left:49%; top:0; width:1.15rem; min-width:1.15rem; height:1.15rem; border:0; background:#C49A62; }
.cf-visual-caption { position:absolute; z-index:2; right:1.15rem; bottom:1rem; left:1.15rem; display:flex; justify-content:space-between; gap:.6rem; color:#D6DFD9; font-size:.62rem; letter-spacing:.1em; text-transform:uppercase; }.cf-visual-caption span:last-child { color:#E4C99F; letter-spacing:.02em; text-transform:none; }
.cf-feature-card,.cf-stat-card,.cf-result-panel,.cf-role-panel { border:1px solid var(--cf-border); border-radius:1rem; background:var(--cf-cream); }.cf-feature-card { min-height:10rem; padding:1.2rem; transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease; }.cf-feature-card:hover { transform:translateY(-2px); border-color:#CBB38E; box-shadow:0 10px 25px rgba(40,45,42,.06); }.cf-feature-index { color:#9A7444; font-size:.66rem; font-weight:700; letter-spacing:.14em; }.cf-feature-card h3 { margin:.7rem 0 .45rem; color:var(--cf-forest); font-family:Manrope,sans-serif; font-size:1rem; font-weight:700; }.cf-feature-card p { margin:0; color:var(--cf-muted); font-size:.8rem; line-height:1.65; }
.cf-upload-note { margin:.55rem 0 .8rem; color:var(--cf-muted); font-size:.82rem; }.cf-file-card { display:flex; align-items:center; gap:.85rem; margin:.7rem 0 0; padding:.9rem 1rem; border:1px solid #C8D7CB; border-radius:.85rem; background:#F2F6F1; }.cf-file-icon { display:grid; width:2.5rem; height:2.5rem; place-items:center; border-radius:.7rem; color:var(--cf-forest); background:var(--cf-sage); font-size:.72rem; font-weight:800; flex:none; }.cf-file-name { overflow:hidden; color:var(--cf-charcoal); font-size:.86rem; font-weight:600; text-overflow:ellipsis; white-space:nowrap; }.cf-file-meta { margin-top:.2rem; color:var(--cf-muted); font-size:.72rem; }.cf-file-ready { margin-left:auto; color:var(--cf-forest); font-size:.68rem; font-weight:700; letter-spacing:.07em; text-transform:uppercase; white-space:nowrap; }
.cf-score-hero { display:grid; grid-template-columns:10rem 1fr; align-items:center; gap:1.5rem; padding:1.5rem; border:1px solid var(--cf-border); border-radius:1.15rem; background:var(--cf-cream); }.cf-score-ring { display:grid; width:8.4rem; aspect-ratio:1; place-items:center; border-radius:50%; background:conic-gradient(var(--cf-forest) 0deg,var(--cf-forest) calc(var(--cf-score)*3.6deg),#EAE7DF calc(var(--cf-score)*3.6deg),#EAE7DF 360deg); transform:rotate(-90deg); animation:cf-ring-in .7s ease both; }.cf-score-center { display:flex; width:6.95rem; aspect-ratio:1; flex-direction:column; align-items:center; justify-content:center; border:1px solid var(--cf-border); border-radius:50%; background:var(--cf-cream); transform:rotate(90deg); }.cf-score-value { color:var(--cf-forest); font-family:Manrope,sans-serif; font-size:2rem; font-weight:800; letter-spacing:-.07em; line-height:1; }.cf-score-label { margin-top:.4rem; color:var(--cf-muted); font-size:.6rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; }.cf-result-eyebrow { color:#9A7444; font-size:.65rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; }.cf-score-hero h2 { margin:.45rem 0 .35rem; color:var(--cf-forest); font-family:Manrope,sans-serif; font-size:clamp(1.25rem,2.2vw,1.8rem); font-weight:700; letter-spacing:-.04em; }.cf-score-hero p { margin:0; color:var(--cf-muted); font-size:.84rem; line-height:1.65; }.cf-result-meta { display:flex; flex-wrap:wrap; gap:.45rem; margin-top:.9rem; }.cf-meta-pill { padding:.3rem .6rem; border:1px solid var(--cf-border); border-radius:999px; color:#555B55; background:#F8F6F0; font-size:.68rem; }
.cf-stat-card { height:100%; padding:1rem 1.1rem; }.cf-stat-value { color:var(--cf-forest); font-family:Manrope,sans-serif; font-size:1.6rem; font-weight:750; letter-spacing:-.05em; }.cf-stat-label { margin-top:.2rem; color:var(--cf-muted); font-size:.74rem; }.cf-stat-accent { width:1.45rem; height:.18rem; margin-bottom:.72rem; border-radius:9rem; background:var(--cf-gold); }.cf-section-kicker { margin:1.4rem 0 .55rem; color:#777B73; font-size:.64rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; }
.cf-note-card { padding:1.05rem 1.15rem; border:1px solid var(--cf-border); border-radius:.9rem; background:var(--cf-cream); }.cf-note-card strong { color:var(--cf-forest); font-family:Manrope,sans-serif; font-size:.84rem; }.cf-note-card p { margin:.42rem 0 0; color:var(--cf-muted); font-size:.77rem; line-height:1.6; }.cf-strength { border-left:3px solid #78967F; background:#F3F7F2; }.cf-gap { border-left:3px solid #B98262; background:#FBF6F1; }
.cf-role-panel { padding:1.1rem 1.2rem; margin:.65rem 0; }.cf-role-top { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; }.cf-role-rank { margin-bottom:.34rem; color:var(--cf-muted); font-size:.61rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; }.cf-role-title { color:var(--cf-forest); font-family:Manrope,sans-serif; font-size:.98rem; font-weight:700; }.cf-role-score { color:var(--cf-forest); font-family:Manrope,sans-serif; font-size:1.28rem; font-weight:800; letter-spacing:-.04em; white-space:nowrap; }.cf-role-track { height:.36rem; margin:.85rem 0; overflow:hidden; border-radius:99px; background:#ECE9E1; }.cf-role-fill { width:calc(var(--cf-role-score)*1%); height:100%; border-radius:99px; background:var(--cf-forest); }.cf-role-meta { display:flex; flex-wrap:wrap; gap:1rem; color:var(--cf-muted); font-size:.71rem; }.cf-role-meta b { color:var(--cf-charcoal); font-weight:650; }
.cf-empty { padding:1.35rem; border:1px dashed #CFC9BC; border-radius:1rem; background:var(--cf-cream); }.cf-empty-title { color:var(--cf-forest); font-family:Manrope,sans-serif; font-size:.9rem; font-weight:700; }.cf-empty-copy { margin:.35rem 0 0; color:var(--cf-muted); font-size:.77rem; line-height:1.55; }
.st-key-nav_analyze button,.st-key-nav_compare button,.st-key-nav_history button { width:100%; justify-content:flex-start; border:1px solid transparent; border-radius:.7rem; color:#E5ECE7; background:transparent; transition:background .18s ease,border-color .18s ease; }.st-key-nav_analyze button:hover,.st-key-nav_compare button:hover,.st-key-nav_history button:hover { border-color:rgba(255,254,250,.14); color:#FFFEFA; background:#203B35; }
.st-key-hero_analyze button,.st-key-form_analyze button,.st-key-compare_submit button { min-height:2.9rem; border:1px solid #172F2A; border-radius:.72rem; color:#FFFEFA; background:#172F2A; font-weight:700; transition:background .18s ease,transform .18s ease; }.st-key-hero_analyze button:hover,.st-key-form_analyze button:hover,.st-key-compare_submit button:hover { border-color:#28483F; background:#28483F; transform:translateY(-1px); }.st-key-hero_explore button,.st-key-back_overview button { min-height:2.9rem; border-radius:.72rem; border-color:var(--cf-border); color:var(--cf-forest); background:var(--cf-cream); }
.st-key-analysis_resume_upload,.st-key-comparison_resume_upload { padding:.8rem; border:1px dashed #C7C1B5; border-radius:.9rem; background:#FBF9F4; transition:border-color .2s ease,background .2s ease; }.st-key-analysis_resume_upload:hover,.st-key-comparison_resume_upload:hover { border-color:#9EAD9F; background:#F3F6F0; }
@keyframes cf-ring-in { from { opacity:.5; transform:rotate(-90deg) scale(.94); } to { opacity:1; transform:rotate(-90deg) scale(1); } }
@media(max-width:720px) { .cf-hero { min-height:unset; padding:1.4rem; border-radius:1rem; }.cf-hero h1 { font-size:2.1rem; }.cf-intel-visual { min-height:15rem; border-radius:1rem; }.cf-score-hero { grid-template-columns:1fr; justify-items:start; gap:1rem; }.cf-score-ring { width:7.2rem; }.cf-score-center { width:5.95rem; }.cf-result-meta { gap:.35rem; }.cf-meta-pill { overflow-wrap:anywhere; } }
@media(prefers-reduced-motion:reduce) { *,*::before,*::after { scroll-behavior:auto!important; animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important; } }
</style>
"""


def inject_styles() -> None:
    st.html(CAREERFIT_STYLES)


def render_brand() -> None:
    st.html(
        """
        <div class="cf-brand">
          <div class="cf-brand-mark" aria-hidden="true"><span class="cf-brand-monogram">C</span></div>
          <div><div class="cf-brand-name">CareerFit</div><div class="cf-brand-tagline">Your career, decoded.</div></div>
        </div>
        <div class="cf-side-label">Workspace</div>
        """
    )


def render_hero_visual() -> None:
    st.html(
        """
        <div class="cf-intel-visual" role="img" aria-label="Abstract career intelligence map connecting skills, role fit, and growth">
          <div class="cf-map-network" aria-hidden="true">
            <span class="cf-map-line cf-map-line-a"></span><span class="cf-map-line cf-map-line-b"></span>
            <span class="cf-map-line cf-map-line-c"></span><span class="cf-map-line cf-map-line-d"></span>
            <span class="cf-map-core">FIT</span>
            <span class="cf-map-node cf-map-node-a">SQL</span><span class="cf-map-node cf-map-node-b">ML</span>
            <span class="cf-map-node cf-map-node-c">CV</span><span class="cf-map-node cf-map-node-d">PY</span>
            <span class="cf-map-node cf-map-node-e"></span>
          </div>
          <div class="cf-visual-caption"><span>Career signal map</span><span>Skills · fit · direction</span></div>
        </div>
        """
    )


def render_feature_card(index: str, title: str, copy: str) -> None:
    st.html(
        f"""
        <article class="cf-feature-card">
          <div class="cf-feature-index">{escape(index)}</div>
          <h3>{escape(title)}</h3>
          <p>{escape(copy)}</p>
        </article>
        """
    )


def render_file_card(name: str, size_bytes: int) -> None:
    size_label = f"{size_bytes / 1024:.0f} KB" if size_bytes < 1024 * 1024 else f"{size_bytes / (1024 * 1024):.1f} MB"
    extension = escape(name.rsplit(".", 1)[-1].upper() if "." in name else "FILE")
    st.html(
        f"""
        <div class="cf-file-card">
          <div class="cf-file-icon">{extension}</div>
          <div style="min-width:0"><div class="cf-file-name">{escape(name)}</div><div class="cf-file-meta">{size_label} · Ready for analysis</div></div>
          <div class="cf-file-ready">Ready</div>
        </div>
        """
    )


def render_score_hero(
    score: float | None,
    job_title: str,
    resume_name: str,
    analyzed_at: str,
) -> None:
    if score is None:
        score_value = 0.0
        score_text = "—"
        headline = "Your match needs a little more signal"
        explanation = "Add supported technical skills to both documents to calculate a semantic skill match."
    else:
        score_value = max(0.0, min(100.0, float(score)))
        score_text = f"{score_value:.0f}%"
        if score_value >= 75:
            headline = "A strong starting point for this role"
        elif score_value >= 50:
            headline = "A promising fit with room to grow"
        else:
            headline = "A clear map of what to build next"
        explanation = (
            "A semantic comparison of the supported skills identified in your resume and the job description. "
            "Use it as guidance, not as a hiring or ATS guarantee."
        )

    st.html(
        f"""
        <section class="cf-score-hero" aria-label="Resume role match score">
          <div class="cf-score-ring" style="--cf-score:{score_value:.2f}">
            <div class="cf-score-center"><span class="cf-score-value">{score_text}</span><span class="cf-score-label">role match</span></div>
          </div>
          <div>
            <div class="cf-result-eyebrow">CareerFit assessment</div>
            <h2>{escape(headline)}</h2>
            <p>{escape(explanation)}</p>
            <div class="cf-result-meta">
              <span class="cf-meta-pill">{escape(job_title)}</span>
              <span class="cf-meta-pill">{escape(resume_name)}</span>
              <span class="cf-meta-pill">{escape(analyzed_at)}</span>
            </div>
          </div>
        </section>
        """
    )


def render_stat_card(value: str, label: str, detail: str) -> None:
    st.html(
        f"""
        <div class="cf-stat-card">
          <div class="cf-stat-accent"></div>
          <div class="cf-stat-value">{escape(value)}</div>
          <div class="cf-stat-label">{escape(label)}</div>
          <div class="cf-stat-label">{escape(detail)}</div>
        </div>
        """
    )


def render_role_card(
    rank: int,
    title: str,
    score: float,
    matched_count: int,
    missing_count: int,
) -> None:
    safe_score = max(0.0, min(100.0, float(score)))
    st.html(
        f"""
        <article class="cf-role-panel">
          <div class="cf-role-top">
            <div><div class="cf-role-rank">Role {rank} · ranked match</div><div class="cf-role-title">{escape(title)}</div></div>
            <div class="cf-role-score">{safe_score:.0f}%</div>
          </div>
          <div class="cf-role-track" role="img" aria-label="{safe_score:.0f}% skill match"><div class="cf-role-fill" style="--cf-role-score:{safe_score:.2f}"></div></div>
          <div class="cf-role-meta"><span><b>{matched_count}</b> matched skills</span><span><b>{missing_count}</b> skill gaps</span></div>
        </article>
        """
    )


def render_empty_state(title: str, copy: str) -> None:
    st.html(
        f"""
        <div class="cf-empty"><div class="cf-empty-title">{escape(title)}</div><p class="cf-empty-copy">{escape(copy)}</p></div>
        """
    )


def render_note_card(title: str, copy: str, variant: str = "") -> None:
    variant_class = " cf-strength" if variant == "strength" else " cf-gap" if variant == "gap" else ""
    st.html(
        f"""
        <div class="cf-note-card{variant_class}"><strong>{escape(title)}</strong><p>{escape(copy)}</p></div>
        """
    )
