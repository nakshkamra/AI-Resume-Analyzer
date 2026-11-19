import io
import zipfile
import xml.etree.ElementTree as ET
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def _write_docx(text: str, file_path):
    # Minimal DOCX structure
    with zipfile.ZipFile(file_path, 'w') as docx_zip:
        content = '''<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
</Types>'''
        docx_zip.writestr('[Content_Types].xml', content)
        rels = '''<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>'''
        docx_zip.writestr('_rels/.rels', rels)
        doc_xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        <w:p><w:r><w:t>{text}</w:t></w:r></w:p>
    </w:body>
</w:document>'''
        docx_zip.writestr('word/document.xml', doc_xml)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_resume_analyze_docx(tmp_path):
    doc_path = tmp_path / "resume.docx"
    _write_docx("John Doe\nPython JavaScript SQL", str(doc_path))
    with open(doc_path, "rb") as f:
        files = {"file": ("resume.docx", f, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
        response = client.post("/api/resume/analyze", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "skills" in data
    assert isinstance(data["skills"], list)
    assert "Python" in data["skills"]
    assert "SQL" in data["skills"]

def test_job_match_docx(tmp_path):
    resume_path = tmp_path / "resume.docx"
    _write_docx("Alice\nPython C++", str(resume_path))
    job_desc = "We need a developer with Python, JavaScript, and SQL skills."
    with open(resume_path, "rb") as f:
        files = {
            "resume_file": ("resume.docx", f, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
            "job_description": (None, job_desc),
        }
        response = client.post("/api/jobs/match", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "match_percentage" in data
    # Expect matching 1 of 3 required skills (~33.33%)
    assert abs(data["match_percentage"] - 33.33) < 0.2
    assert "Python" in data.get("matched_skills", [])
    assert "JavaScript" in data.get("missing_skills", [])
    assert "SQL" in data.get("missing_skills", [])
