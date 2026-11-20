import os, zipfile, httpx, tempfile, json

def write_docx(text, path):
    with zipfile.ZipFile(path, 'w') as docx:
        content = '''<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
</Types>'''
        docx.writestr('[Content_Types].xml', content)
        rels = '''<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>'''
        docx.writestr('_rels/.rels', rels)
        doc_xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        <w:p><w:r><w:t>{text}</w:t></w:r></w:p>
    </w:body>
</w:document>'''
        docx.writestr('word/document.xml', doc_xml)

# create temp docx
fd, tmp_path = tempfile.mkstemp(suffix='.docx')
os.close(fd)
write_docx('John Doe\nPython JavaScript SQL', tmp_path)

url = 'http://127.0.0.1:8000/api/resume/analyze'
files = {'file': ('resume.docx', open(tmp_path, 'rb'), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')}
resp = httpx.post(url, files=files)
print('Status:', resp.status_code)
print('Body:', resp.text)

# Clean up
os.remove(tmp_path)
