import random
from typing import List, Tuple, Dict

# Simple deterministic question bank for rule‑based practice mode
# Keys: (role, difficulty, interview_type)
QUESTION_BANK: Dict[Tuple[str, str, str], List[str]] = {
    ("Software Engineer", "Beginner", "Technical"): [
        "What is a variable?",
        "Explain the difference between a list and a tuple in Python.",
        "What does a for‑loop do?",
    ],
    ("Software Engineer", "Intermediate", "Technical"): [
        "Describe how a hash table works.",
        "Explain the concept of closures in JavaScript.",
        "What is the time complexity of quicksort on average?",
    ],
    ("Software Engineer", "Advanced", "Technical"): [
        "Explain the CAP theorem and its implications for distributed systems.",
        "How would you design a scalable micro‑service architecture for a social media platform?",
        "What are the differences between optimistic and pessimistic concurrency control?",
    ],
    ("Software Engineer", "Beginner", "HR"): [
        "Tell me about yourself.",
        "Why do you want to work at our company?",
        "What are your greatest strengths?",
    ],
    ("Software Engineer", "Intermediate", "HR"): [
        "Describe a challenging project you worked on and how you overcame difficulties.",
        "How do you handle conflict within a team?",
        "Where do you see yourself in 5 years?",
    ],
    ("Software Engineer", "Advanced", "HR"): [
        "Give an example of a time you led a team to achieve a difficult goal.",
        "How do you stay current with technology trends?",
        "What is your approach to mentoring junior engineers?",
    ],
    ("Software Engineer", "Beginner", "Behavioral"): [
        "Describe a time you had to learn a new skill quickly.",
        "Tell me about a time you made a mistake at work and how you handled it.",
        "Give an example of a situation where you had to work under pressure.",
    ],
    # Add more as needed
}

# Simple expected keywords per question for evaluation (rule‑based)
EVALUATION_KEYWORDS: Dict[str, List[str]] = {
    "What is a variable?": ["store", "value", "named"],
    "Explain the difference between a list and a tuple in Python.": ["mutable", "immutable", "list", "tuple"],
    "What does a for‑loop do?": ["iterate", "repeat", "collection"],
    "Describe how a hash table works.": ["key", "value", "bucket", "hash"],
    "Explain the concept of closures in JavaScript.": ["function", "enclose", "scope"],
    "What is the time complexity of quicksort on average?": ["n log n", "log n", "average"],
    "Explain the CAP theorem and its implications for distributed systems.": ["consistency", "availability", "partition", "tradeoff"],
    "How would you design a scalable micro‑service architecture for a social media platform?": ["api", "gateway", "load balancer", "database"],
    "What are the differences between optimistic and pessimistic concurrency control?": ["lock", "version", "conflict", "optimistic", "pessimistic"],
    # HR & Behavioral generic keywords – simple presence check
    "Tell me about yourself.": ["experience", "background"],
    "Why do you want to work at our company?": ["mission", "values", "interest"],
    "What are your greatest strengths?": ["strength", "skill"],
    "Describe a challenging project you worked on and how you overcame difficulties.": ["challenge", "solution", "result"],
    "How do you handle conflict within a team?": ["communication", "listen", "resolve"],
    "Where do you see yourself in 5 years?": ["career", "growth"],
    "Give an example of a time you led a team to achieve a difficult goal.": ["lead", "team", "goal"],
    "How do you stay current with technology trends?": ["read", "blog", "learn"],
    "What is your approach to mentoring junior engineers?": ["mentor", "guide", "feedback"],
    "Describe a time you had to learn a new skill quickly.": ["learn", "quick", "adapt"],
    "Tell me about a time you made a mistake at work and how you handled it.": ["mistake", "learned", "improve"],
    "Give an example of a situation where you had to work under pressure.": ["pressure", "deadline", "manage"],
}

def generate_questions(role: str, difficulty: str, interview_type: str, num_questions: int) -> List[Dict[str, str]]:
    key = (role, difficulty, interview_type)
    pool = QUESTION_BANK.get(key, [])
    # deterministic order; if more requested than available, repeat cyclically
    if not pool:
        return []
    selected = []
    for i in range(num_questions):
        q = pool[i % len(pool)]
        selected.append({"id": str(i + 1), "text": q})
    return selected

def evaluate_answers(answers: List[Dict[str, str]]) -> List[Dict[str, object]]:
    results = []
    for ans in answers:
        qid = ans.get("question_id")
        text = ans.get("answer", "").lower()
        # Find the original question text using the stored mapping – assume ids are sequential
        # This simple implementation expects the caller to include the original question text as well
        # For safety, we will match on id via a supplied mapping later; here we just look up by stored id.
        # In practice the backend will receive the full question list separately; we will compute
        # feedback based on known keywords.
        # For now, assume the answer dict also contains "question_text".
        question = ans.get("question_text", "")
        keywords = EVALUATION_KEYWORDS.get(question, [])
        match_count = sum(1 for kw in keywords if kw in text)
        score = round(match_count / max(1, len(keywords)), 2) if keywords else 0.0
        feedback = []
        for kw in keywords:
            if kw in text:
                feedback.append(f"Good: mention of '{kw}'.")
            else:
                feedback.append(f"Missing: '{kw}'.")
        results.append({
            "question_id": qid,
            "score": score,
            "feedback": feedback,
        })
    return results
