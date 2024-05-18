"use client";
import { Button } from "@/components/catalyst/button";
import {
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";
import Image from "next/image";

export default function Start() {
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
        <Button href="/verify/fill-details">Kick Off Verification</Button>
      </DialogActions>
    </>
  );
}
