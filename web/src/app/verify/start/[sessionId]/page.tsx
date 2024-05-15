"use client";
import { Button } from "@/components/catalyst/button";
import {
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

type Params = {
  params: {
    sessionId: string;
  };
};

export default function Verify({ params: { sessionId } }: Params) {
  const router = useRouter();

  const handleNext = useCallback(() => {
    if (window.innerWidth > 768) {
      router.push(`/verify/switch-to-phone/${sessionId}`);
    } else {
      router.push(`/verify/upload-selfie/${sessionId}`);
    }
  }, [router, sessionId]);

  return (
    <>
      <DialogTitle>Let&apos;s Get You Verified!</DialogTitle>
      <DialogDescription>
        Verification is a snap! Just take a quick photo of your ID and a selfie,
        and you&apos;ll be all set.
      </DialogDescription>
      <DialogBody>
        <div className="flex justify-center my-4">
          <Image
            src="/miroodles/color/selfie.svg"
            alt="robot"
            width="200"
            height="200"
          />
        </div>
      </DialogBody>
      <DialogActions>
        <Button onClick={handleNext}>Kick Off Verification</Button>
      </DialogActions>
    </>
  );
}
