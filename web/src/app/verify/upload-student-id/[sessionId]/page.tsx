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
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import Spinner from "@/components/spinner";
import { usePresignedStudentIdUrl } from "@/hooks/usePresignedUrl";
import uploadToS3 from "@/utils/uploadToS3";

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

      if (!presignedUrl || !studentCard) {
        return;
      }

      setIsUploading(true);

      uploadToS3(presignedUrl, studentCard).then(() => {
        router.push(`/verify/crunching-numbers/${sessionId}`);
      }).finally(() => {
        setIsUploading(false);
      });
    },
    [presignedUrl, studentCard, router, sessionId, setIsUploading]
  );

  if (error) {
    return (
      <p>
        Oops! We couldn&apos;t load the necessary details for your selfie.
        Please try again later.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Almost There!</DialogTitle>
      <DialogDescription>
        We&apos;re excited to see your student card! Please make sure the entire card is visible in the photo to help us verify you swiftly.
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
        <Button disabled={isLoading || !studentCard || isUploading} type="submit">
          {isUploading ? <Spinner /> : null}
          Upload and Continue
        </Button>
      </DialogActions>
    </form>
  );
}
