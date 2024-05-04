"use client";
import { Button } from "@/components/catalyst/button";
import {
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";
import Image from "next/image";

export default function SwitchToPhone() {
  return (
    <>
      <DialogTitle>Easier on a phone</DialogTitle>
      <DialogDescription>
        We see that you are on a desktop. The process is a bit easier on a
        phone, but if you have a selfie and a photo of your ID, you can continue
        here. Scan the QR code below to switch to your phone.
      </DialogDescription>
      <DialogBody>
        <div className="flex justify-center">
          <Image src="/qrcode.svg" alt="QR code" width="200" height="200" />
        </div>
      </DialogBody>
      <DialogActions>
        <Button plain>Cancel</Button>
        <Button href={`/verify/fill-details`}>Next</Button>
      </DialogActions>
    </>
  );
}
