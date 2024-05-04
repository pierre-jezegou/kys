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
import { usePresignedSelfieUrl } from "@/hooks/usePresignedUrl";
import uploadToS3 from "@/utils/uploadToS3";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type Params = {
  params: {
    sessionId: string;
  };
};

export default function UploadSelfie({ params: { sessionId } }: Params) {
  const router = useRouter();

  const { presignedUrl, error, isLoading } = usePresignedSelfieUrl(sessionId);

  const [selfie, setSelfie] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const handleSelfieChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelfie(event.target.files?.[0] || null);
    },
    [setSelfie]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!presignedUrl || !selfie) {
        return;
      }

      setIsUploading(true);

      uploadToS3(presignedUrl, selfie)
        .then(() => {
          router.push(`/verify/upload-student-id/${sessionId}`);
        })
        .finally(() => {
          setIsUploading(false);
        });
    },
    [presignedUrl, selfie, router, sessionId]
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
      <DialogTitle>Show Us Your Smile!</DialogTitle>
      <DialogDescription>
        Ready for your close-up? Snap a quick selfie to continue with your
        identity verification.
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
        <Button disabled={isLoading || !selfie || isUploading} type="submit">
          {isUploading ? <Spinner /> : null}
          Upload and Continue
        </Button>
      </DialogActions>
    </form>
  );
}
