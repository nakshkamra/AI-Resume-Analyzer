
import re
import fitz


SKILLS = [
    "Python",
    "Java",
    "C",
    "C++",
    "Perl",
    "PHP",
    "MySQL",
    "JavaScript",
    "VHDL",
    "MIPS32",
    "Matlab",
    "OpenCV",
    "Linux",
    "Windows",
    "SML",
    "Lex",
    "Yacc",
    "Prolog",
    "LaTeX",
    "Doxygen"
]


def extract_text_from_pdf(file_path):
    """Extract text from all pages of a PDF file."""
    document = fitz.open(file_path)

    try:
        text = ""

        for page in document:
            text += page.get_text()

        return text
    finally:
        document.close()


def extract_skills(text):
    """Extract known skills from text, ignoring letter case."""
    found_skills = []

    for skill in SKILLS:
        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, text, re.IGNORECASE):
            found_skills.append(skill)

    return found_skills


if __name__ == "__main__":
    # Read resume
    text = extract_text_from_pdf("resumes/sample_resume.pdf")

    # Extract skills
    skills = extract_skills(text)

    # Display skills
    print("Skills found:")

    for skill in skills:
        print("-", skill)
