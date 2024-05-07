"use client";
import { Button } from "@/components/catalyst/button";
import {
  DialogActions,
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

export default function SwitchToPhone({ params: { sessionId } }: Params) {
  const url = encodeURIComponent(
    `${window.location.origin}/verify/upload-selfie/${sessionId}`
  );

  return (
    <>
      <DialogTitle>Switch to Phone? It&apos;s a Breeze!</DialogTitle>
      <DialogDescription>
        Looks like you&apos;re using a desktop! This process might be smoother
        and quicker on your phone. Feel free to keep going here, or simply scan
        the QR code below to switch over to your mobile device.
      </DialogDescription>
      <DialogBody>
        <div className="flex justify-center my-16">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${url}`}
            alt="QR code"
            width="150"
            height="150"
          />
        </div>
      </DialogBody>
      <DialogActions>
        <Button plain>Cancel</Button>
        <Button href={`/verify/upload-selfie/${sessionId}`} outline>
          Stay Here
        </Button>
        <Button href={`/verify/waiting-on-phone/${sessionId}`}>Switch</Button>
      </DialogActions>
    </>
  );
}
