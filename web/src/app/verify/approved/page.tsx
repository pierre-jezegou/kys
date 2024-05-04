"use client";
import {
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";
import Image from "next/image";

export default function Approved() {
  return (
    <>
      <DialogTitle>Approved 🎉</DialogTitle>
      <DialogDescription>
        Your identity has been successfully verified. We will redirect you back to where you left off.
      </DialogDescription>
      <DialogBody>
        <div className="flex justify-center my-4">
          <Image src="/miroodles/color/flower.svg" alt="robot" width="200" height="200" />
        </div>
      </DialogBody>
    </>
  );
}
