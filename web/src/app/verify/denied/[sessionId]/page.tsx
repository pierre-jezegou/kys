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
        Oops! We couldn&apos;t verify your identity this time. No worries,
        though! You can try again or reach out to support for assistance.
        We&apos;re here to help you through it.
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
