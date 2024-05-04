"use client";
import {
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";
import Image from "next/image";

type Params = {
  params: {
    sessionId: string;
  };
};

export default function Approved({ params: { sessionId } }: Params) {
  return (
    <>
 <DialogTitle>Tada! You&apos;re Verified!</DialogTitle>
      <DialogDescription>
        Awesome news! Your identity has been verified. Hang tight, we&apos;ll whisk you right back to where you left off in just a moment.
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
