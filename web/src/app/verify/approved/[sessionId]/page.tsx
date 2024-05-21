"use client";

import {
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";
import { getSessionToken } from "@/lib/api";
import Image from "next/image";
import { useEffect } from "react";

async function redirectToJwtio(sessionId: string) {
  const { token } = await getSessionToken(sessionId);
  window.location.href = `https://jwt.io?token=${token}`;
}

type Params = {
  params: {
    sessionId: string;
  };
};

export default function Approved({ params: { sessionId } }: Params) {
  useEffect(() => {
    setTimeout(() => {
      redirectToJwtio(sessionId);
    }, 5000);
  }, [sessionId]);

  return (
    <>
      <DialogTitle>Tada! You&apos;re Verified!</DialogTitle>
      <DialogDescription>
        Awesome news! Your identity has been verified. Hang tight, we&apos;ll
        whisk you right back to where you left off in just a moment.
      </DialogDescription>
      <DialogBody>
        <div className="flex justify-center my-4">
          <Image
            src="/miroodles/color/flower.svg"
            alt="robot"
            width="200"
            height="200"
          />
        </div>
      </DialogBody>
    </>
  );
}
