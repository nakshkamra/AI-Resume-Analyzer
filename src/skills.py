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

    document = fitz.open(file_path)

    text = ""

    for page in document:
        text += page.get_text()

    document.close()

    return text


def extract_skills(text):

    found_skills = []

    for skill in SKILLS:

        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, text, re.IGNORECASE):
            found_skills.append(skill)

    return found_skills


# Read resume
text = extract_text_from_pdf("resumes/sample_resume.pdf")

# Extract skills
skills = extract_skills(text)

# Display skills
print("Skills found:")

for skill in skills:
    print("-", skill)