export type State =
  | "created"
  | "selfie-submitted"
  | "student-id-submitted"
  | "face-not-detected"
  | "too-many-faces"
  | "faces-not-matched"
  | "text-not-detected"
  | "text-not-matched"
  | "approved"
  | "pending";

export type Session = {
  id: number;
  name: string;
  university: string;
  state: State;
};

const DENIED_STATES = [
  "face-not-detected",
  "too-many-faces",
  "faces-not-matched",
  "text-not-detected",
  "text-not-matched",
];
const APPROVED_STATES = ["approved"];

export function getProgress(state: State) {
  if (DENIED_STATES.includes(state)) {
    return "denied";
  } else if (APPROVED_STATES.includes(state)) {
    return "approved";
  } else {
    return "pending";
  }
}
