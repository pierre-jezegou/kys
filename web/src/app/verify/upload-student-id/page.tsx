"use client";
import { useState, useCallback } from "react";
import { Field } from "@/components/catalyst/fieldset";
import { Input } from "@/components/catalyst/input";
import { Button } from "@/components/catalyst/button";
import { useRouter } from "next/navigation";
import {
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";

export default function UploadStudentCard() {
  const router = useRouter();
  const [studentCard, setStudentCard] = useState<File | null>(null);

  const handleStudentCardChange = useCallback(
    (event) => {
      setStudentCard(event.target.files?.[0] || null);
    },
    [setStudentCard]
  );

  const handleSubmit = useCallback((event) => {
    // Redirect to `verify/upload-student-id`
  }, []);

  return (
    <>
      <DialogTitle>Student Card</DialogTitle>
      <DialogDescription>
        Show us your student card. Try to fit the entire card in the frame.
      </DialogDescription>
      <DialogBody>
        <form>
          <Field>
            {/* <Label>Selfie</Label> */}
            <Input
              type="file"
              accept="image/*"
              capture="user"
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
