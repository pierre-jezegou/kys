from typing import TypedDict, Literal


SessionState = Literal[
    "created",
    "selfie-submitted",
    "student-id-submitted",
    "selfie-matched",
    "selfie-match-failed",
    "student-id-matched",
    "student-id-match-failed",
]


class Session(TypedDict):
    id: str
    name: str
    university: str
    created_at: str
    updated_at: str
    state: SessionState
