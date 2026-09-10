import fitz


def extract_text_from_pdf(file_path):
    document = fitz.open(file_path)

    text = ""

    for page in document:
        text += page.get_text()

    document.close()

    return text


def detect_sections(text):

    sections = [
        "Education",
        "Objective",
        "Major Projects",
        "Other Projects",
        "Scholastic Achievements",
        "Relevant Courses",
        "Computer Skills",
        "Extra Curricular Activities",
        "Position Of Responsibility",
        "References"
    ]

    found_sections = {}

    current_section = None

    for line in text.splitlines():

        line = line.strip()

        if line in sections:
            current_section = line
            found_sections[current_section] = ""

        elif current_section:
            found_sections[current_section] += line + "\n"

    return found_sections


# Extract resume text
text = extract_text_from_pdf("resumes/sample_resume.pdf")

# Detect sections
resume_sections = detect_sections(text)

# Display sections
for section, content in resume_sections.items():
    print("\n==============================")
    print(section)
    print("==============================")
    print(content)