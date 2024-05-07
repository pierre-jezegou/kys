export type State =
  | "created"
  | "details-submitted"
  | "selfie-submitted"
  | "student-id-submitted"
  | "selfie-matched"
  | "selfie-match-failed"
  | "student-id-matched"
  | "student-id-match-failed";

export type Session = {
  id: number;
  name: string;
  university: string;
  created: string;
  state: State;
};

const DENIED_STATES = ["student-id-match-failed"];
const APPROVED_STATES = ["selfie-matched", "student-id-matched"];

export function getProgress(state: State) {
  if (DENIED_STATES.includes(state)) {
    return "denied";
  } else if (APPROVED_STATES.includes(state)) {
    return "approved";
  } else {
    return "pending";
  }
}
