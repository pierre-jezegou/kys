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

export default function Verify() {
  const router = useRouter();

  const handleStartVerification = useCallback(() => {
    router.push("/verify/fill-details");
  }, [router]);
  return (
    <>
      <DialogTitle>Start Verification</DialogTitle>
      <DialogDescription>
        You only have to snap a picture of your ID and a selfie to get verified.
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
        <Button onClick={handleStartVerification}>Start</Button>
      </DialogActions>
    </>
  );
}
