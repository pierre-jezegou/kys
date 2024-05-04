"use client";
import { Button } from "@/components/catalyst/button";
import {
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";
import { Field } from "@/components/catalyst/fieldset";
import { Input } from "@/components/catalyst/input";
import Spinner from "@/components/spinner";
import { uploadToS3 } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type Params = {
  params: {
    sessionId: string;
  };
};

export default function UploadStudentCard({ params: { sessionId } }: Params) {
  const router = useRouter();

  const [studentCard, setStudentCard] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const handleStudentCardChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStudentCard(event.target.files?.[0] || null);
    },
    [setStudentCard]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!studentCard) {
        return;
      }

      setIsUploading(true);

      uploadToS3(
        `${process.env.NEXT_PUBLIC_API_URL}/presigned-url/student-id`,

        studentCard,
        sessionId
      )
        .then(() => {
          router.push(`/verify/crunching-numbers/${sessionId}`);
        })
        .finally(() => {
          setIsUploading(false);
        });
    },
    [studentCard, router, sessionId, setIsUploading]
  );

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Almost There!</DialogTitle>
      <DialogDescription>
        We&apos;re excited to see your student card! Please make sure the entire
        card is visible in the photo to help us verify you swiftly.
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
        <Button disabled={!studentCard || isUploading} type="submit">
          {isUploading ? <Spinner /> : null}
          Upload and Continue
        </Button>
      </DialogActions>
    </form>
  );
}
