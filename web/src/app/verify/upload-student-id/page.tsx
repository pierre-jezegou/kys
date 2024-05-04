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

export default function UploadStudentCard() {
  const router = useRouter();

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

      uploadToS3(
        "https://essai-boto3-s3.s3.amazonaws.com/blablablabla/student-id.png",
        studentCard as File
      ).then(() => {
        router.push("/verify/crunching-numbers");
      });

      router.push("/verify/crunching-numbers");
    },
    [studentCard, router]
  );

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
            accept="image/*"
            capture="environment"
            onChange={handleStudentCardChange}
          />
        </Field>
      </DialogBody>
      <DialogActions>
        <Button plain>Cancel</Button>
        <Button disabled={!studentCard} type="submit">
          Next
        </Button>
      </DialogActions>
    </form>
  );
}
