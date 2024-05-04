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
      <DialogTitle>Denied</DialogTitle>
      <DialogDescription>
        Your identity could not be verified. Please try again or contact
        support. We will redirect you back to where you left off.
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
