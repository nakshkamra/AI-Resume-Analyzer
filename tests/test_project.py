
from src.skills import extract_skills


def test_extracts_python_and_java():
    result = extract_skills("I know Python and Java")

    assert result == ["Python", "Java"]


def test_skill_matching_is_case_insensitive():
    result = extract_skills("PYTHON and java")

    assert result == ["Python", "Java"]


def test_returns_empty_list_when_no_skills_found():
    result = extract_skills("I enjoy reading books")

    assert result == []


def test_does_not_match_c_inside_other_words():
    result = extract_skills("I like cakes")

    assert "C" not in result
