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

export default function Denied({ params: { sessionId } }: Params) {
  return (
    <>
      <DialogTitle>Hmm, Something&apos;s Up!</DialogTitle>
      <DialogDescription>
        Oops! We couldn&apos;t verify your identity this time.
        Hang tight, we&apos;ll whisk you right back to where you left off in just a moment.
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
