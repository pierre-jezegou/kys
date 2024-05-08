"use client";
import { Avatar } from "@/components/catalyst/avatar";
import { Badge } from "@/components/catalyst/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/catalyst/table";
import type { Session, State } from "@/lib/session";

const sessions: Session[] = [
  {
    id: 1,
    name: "Vincent Olesen",
    university: "Danmarks Tekniske Universitet",
    created: "2021-01-01",
    state: "selfie-match-failed",
  },
  {
    id: 2,
    name: "Pierre Jezegou",
    university: "École Centrale de Lille",
    created: "2021-01-01",
    state: "student-id-matched",
  },
  {
    id: 3,
    name: "Vanja Vidmark",
    university: "KTH Royal Institute of Technology",
    created: "2021-01-01",
    state: "selfie-submitted",
  },
];

const statusExplanation: Record<State, string> = {
  created: "A verification session has been created.",
  "selfie-submitted": "The student has submitted their selfie.",
  "student-id-submitted": "The student has submitted their student ID.",
  "face-not-detected": "Could not detect a face in the selfie.",
  "too-many-faces": "There is more than one face in the selfie.",
  "faces-not-matched": "The faces in the selfie do not match.",
  "text-not-detected": "Could not detect text in the student ID.",
  "text-not-matched": "The text in the student ID does not match.",
  approved: "The student ID and selfie match.",
};

function SessionsTable({ sessions }: any) {
  return (
    <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader className="hidden lg:table-cell">Progress</TableHeader>
          <TableHeader>Result</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {sessions.map((session: Session) => (
          <TableRow key={session.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <Avatar className="size-12" />
                <div>
                  <div className="font-medium">{session.name}</div>
                  <div className="text-zinc-500">
                    <a href="#" className="hover:text-zinc-700">
                      {session.university}
                    </a>
                  </div>
                </div>
              </div>
            </TableCell>
            {/* Only use stepper for desktop */}
            <TableCell className="hidden lg:table-cell">
              {statusExplanation[session.state]}
            </TableCell>
            <TableCell>
              {session.state == "student-id-matched" ? (
                <Badge color="lime">Approved</Badge>
              ) : session.state == "selfie-match-failed" ? (
                <Badge color="red">Denied</Badge>
              ) : session.state == "student-id-match-failed" ? (
                <Badge color="red">Denied</Badge>
              ) : (
                <Badge color="zinc">In progress</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function Audit() {
  return <SessionsTable sessions={sessions} />;
}
