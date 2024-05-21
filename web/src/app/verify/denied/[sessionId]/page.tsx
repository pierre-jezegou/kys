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

export default function Denied({ params: { sessionId } }: Params) {
  useEffect(() => {
    setTimeout(() => {
      redirectToJwtio(sessionId);
    }, 5000);
  }, [sessionId]);

  return (
    <>
      <DialogTitle>Hmm, Something&apos;s Up!</DialogTitle>
      <DialogDescription>
        Oops! We couldn&apos;t verify your identity this time. Hang tight,
        we&apos;ll whisk you right back to where you left off in just a moment.
      </DialogDescription>
      <DialogBody>
        <div className="flex justify-center my-4">
          <Image
            src="/miroodles/color/rain.svg"
            alt="rain"
            width="200"
            height="200"
          />
        </div>
      </DialogBody>
    </>
  );
}
