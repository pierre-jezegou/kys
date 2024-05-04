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
import Stepper from "@/components/stepper";

type Status =
  | "created"
  | "details-submitted"
  | "selfie-submitted"
  | "student-id-submitted"
  | "selfie-matched"
  | "student-id-matched"
  | "completed";

type Result = "in-progress" | "approved" | "denied";

type Session =
  | {
      id: number;
      name: string;
      university: string;
      created: string;
      status: Exclude<Status, "completed">;
      result: "in-progress";
    }
  | {
      id: number;
      name: string;
      university: string;
      created: string;
      status: "completed";
      result: Exclude<Result, "in-progress">;
    };

const sessions: Session[] = [
  {
    id: 1,
    name: "Vincent Olesen",
    university: "Danmarks Tekniske Universitet",
    created: "2021-01-01",
    status: "completed",
    result: "denied",
  },
  {
    id: 2,
    name: "Pierre Jezegou",
    university: "École Centrale de Lille",
    created: "2021-01-01",
    status: "completed",
    result: "approved",
  },
  {
    id: 3,
    name: "Vanja Vidmark",
    university: "KTH Royal Institute of Technology",
    created: "2021-01-01",
    status: "completed",
    result: "approved",
  },
];

// Status explanation

const statusExplanation = {
  created: "Created",
  "details-submitted": "Details submitted",
  "selfie-submitted": "Selfie submitted",
  "student-id-submitted": "Student ID submitted",
  "selfie-matched": "Selfie matched",
  "student-id-matched": "Student ID matched",
  completed: "Completed",
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
        {sessions.map((session: any) => (
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
              {statusExplanation[session.status]}
            </TableCell>
            <TableCell>
              {session.result == "approved" ? (
                <Badge color="lime">Approved</Badge>
              ) : (
                <Badge color="zinc">Denied</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function Audit() {
  return (
    <div className="">
      <SessionsTable sessions={sessions} />
    </div>
  );
}
