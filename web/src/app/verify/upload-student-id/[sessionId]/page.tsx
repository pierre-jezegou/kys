"use client";
import { useState, useCallback } from "react";
import { Field } from "@/components/catalyst/fieldset";
import { Input } from "@/components/catalyst/input";
import { Button } from "@/components/catalyst/button";
import { useRouter, useParams } from "next/navigation";
import {
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";

import uploadToS3 from "@/utils/uploadToS3";
import { usePresignedStudentIdUrl } from "@/hooks/usePresignedUrl";

type Params = {
  params: {
    sessionId: string;
  };
};

export default function UploadStudentCard({ params: { sessionId } }: Params) {
  const router = useRouter();

  const { presignedUrl, error, isLoading } =
    usePresignedStudentIdUrl(sessionId);

  const [studentCard, setStudentCard] = useState<File | null>(null);

  const handleStudentCardChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStudentCard(event.target.files?.[0] || null);
    },
    [setStudentCard]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!presignedUrl || !studentCard) {
        return;
      }

      uploadToS3(presignedUrl, studentCard).then(() => {
        const approved = Math.random() > 0.5;

        if (approved) {
          router.push(`/verify/approved/${sessionId}`);
        } else {
          router.push(`/verify/denied/${sessionId}`);
        }
      });
    },
    [presignedUrl, studentCard, router, sessionId]
  );

  if (error) {
    return <p>Failed to fetch presigned URL</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Student Card</DialogTitle>
      <DialogDescription>
        Show us your student card. Try to fit the entire card in the frame.
      </DialogDescription>
      <DialogBody>
        <Field>
          {/* <Label>Student Card</Label> */}
          <Input
            type="file"
            name="file"
            accept="image/*"
            capture="environment"
            onChange={handleStudentCardChange}
          />
        </Field>
      </DialogBody>
      <DialogActions>
        <Button plain>Cancel</Button>
        <Button disabled={isLoading || !studentCard} type="submit">
          Next
        </Button>
      </DialogActions>
    </form>
  );
}
