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
    (event) => {
      setStudentCard(event.target.files?.[0] || null);
    },
    [setStudentCard]
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      uploadToS3("", studentCard as File);

      router.push("/verify/crunching-numbers");
    },
    [studentCard, router]
  );

  return (
    <>
      <DialogTitle>Student Card</DialogTitle>
      <DialogDescription>
        Show us your student card. Try to fit the entire card in the frame.
      </DialogDescription>
      <DialogBody>
        <form>
          <Field>
            {/* <Label>Student Card</Label> */}
            <Input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleStudentCardChange}
            />
          </Field>
        </form>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => {}}>
          Cancel
        </Button>
        <Button disabled={!studentCard} onClick={handleSubmit}>
          Next
        </Button>
      </DialogActions>
    </>
  );
}
