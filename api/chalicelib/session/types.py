from typing import TypedDict, Literal

SessionState = Literal[
    "created",
    "selfie-submitted",
    "student-id-submitted",
    "face-not-detected",
    "too-many-faces",
    "faces-not-matched",
    "text-not-detected",
    "text-not-matched",
    "approved",
]

class Session(TypedDict):
    id: str
    name: str
    university: str
    created: str
    updated: str
    state: SessionState
