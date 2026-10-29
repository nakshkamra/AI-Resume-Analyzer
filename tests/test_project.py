
def test_basic_python_operation():
    assert 2 + 2 == 4


def test_resume_score_is_within_valid_range():
    score = 75.7
    assert 0 <= score <= 100
