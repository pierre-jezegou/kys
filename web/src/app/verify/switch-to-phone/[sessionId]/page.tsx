"use client";
import { Button } from "@/components/catalyst/button";
import {
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";

type Params = {
  params: {
    sessionId: string;
  };
};

export default function SwitchToPhone({ params: { sessionId } }: Params) {
  const qrcodeUrl = encodeURIComponent(
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
        <div className="flex justify-center">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/qrcode?data=${qrcodeUrl}`}
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
