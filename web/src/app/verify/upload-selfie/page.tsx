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

export default function UploadSelfie() {
  const router = useRouter();

  const [selfie, setSelfie] = useState<File | null>(null);

  const handleSelfieChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelfie(event.target.files?.[0] || null);
    },
    [setSelfie]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      router.push("/verify/upload-student-id");
    },
    [router]
  );

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Take a selfie</DialogTitle>
      <DialogDescription>
        Snap a selfie to verify your identity.
      </DialogDescription>
      <DialogBody>
        <Field>
          {/* <Label>Selfie</Label> */}
          <Input
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleSelfieChange}
          />
        </Field>
      </DialogBody>
      <DialogActions>
        <Button plain>Cancel</Button>
        <Button disabled={!selfie} type="submit">
          Next
        </Button>
      </DialogActions>
    </form>
  );
}
