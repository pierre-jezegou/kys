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
import { getPresignedUrlForSelfie, uploadToS3 } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type Params = {
  params: {
    sessionId: string;
  };
};

export default function UploadSelfie({ params: { sessionId } }: Params) {
  const router = useRouter();

  const [selfie, setSelfie] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSelfieChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelfie(event.target.files?.[0] || null);
    },
    [setSelfie]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selfie) {
        return;
      }

      setIsUploading(true);

      try {
        const { presignedUrl } = await getPresignedUrlForSelfie(
          sessionId,
          selfie.type
        );

        await uploadToS3(presignedUrl, selfie);

        router.push(`/verify/upload-student-id/${sessionId}`);
      } finally {
        setIsUploading(false);
      }
    },
    [selfie, sessionId, router]
  );

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
        <Button disabled={!selfie || isUploading} type="submit">
          {isUploading ? <Spinner /> : null}
          Upload and Continue
        </Button>
      </DialogActions>
    </form>
  );
}
