try:
    import fitz
except ImportError:
    fitz = None
import zipfile
import xml.etree.ElementTree as ET

def _extract_text_from_docx_zip(file_path):
    """Very simple DOCX text extractor using only the stdlib.
    It opens the DOCX (a zip file), reads word/document.xml, and extracts text nodes.
    This works for basic documents but does not handle complex formatting.
    """
    try:
        with zipfile.ZipFile(file_path) as docx_zip:
            with docx_zip.open('word/document.xml') as xml_file:
                tree = ET.parse(xml_file)
                root = tree.getroot()
                texts = []
                for node in root.iter():
                    if '}' in node.tag:
                        tag = node.tag.split('}', 1)[1]
                    else:
                        tag = node.tag
                    if tag == 't':
                        texts.append(node.text or '')
                return '\n'.join(texts)
    except Exception as e:
        raise ValueError(f"Failed to extract DOCX text: {e}")

def extract_text_from_pdf(file_path):
    if not fitz:
        raise ValueError("PDF parsing requires PyMuPDF (fitz) which is not installed.")
    document = fitz.open(file_path)
    text = ""
    for page in document:
        text += page.get_text()
    document.close()
    return text

def extract_text_from_docx(file_path):
    # Use the stdlib fallback; no external dependency required.
    return _extract_text_from_docx_zip(file_path)

def extract_text(file_path):
    if file_path.lower().endswith('.pdf'):
        return extract_text_from_pdf(file_path)
    elif file_path.lower().endswith('.docx'):
        return extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file format. Please upload PDF or DOCX.")
