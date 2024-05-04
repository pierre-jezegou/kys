"use client";
import { Button } from "@/components/catalyst/button";
import {
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";

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
        <div className="flex justify-center my-16">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${process.env.NEXT_PUBLIC_WEB_URL}/verify/fill-details`}
            alt="robot"
            width="200"
            height="200"
          />
        </div>
      </DialogBody>
      <DialogActions>
        <Button plain>Cancel</Button>
        <Button href={`/verify/fill-details`}>Next</Button>
      </DialogActions>
    </>
  );
}
