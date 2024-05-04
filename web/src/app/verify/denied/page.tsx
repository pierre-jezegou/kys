"use client";
import {
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";
import Image from "next/image";

export default function Denied() {
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
