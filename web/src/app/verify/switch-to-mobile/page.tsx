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
      <DialogTitle>Switch to Phone? It&apos;s a Breeze!</DialogTitle>
      <DialogDescription>
        Looks like you&apos;re using a desktop! This process might be smoother and
        quicker on your phone. Feel free to keep going here, or simply scan
        the QR code below to switch over to your mobile device.
      </DialogDescription>

      <DialogBody>
        <div className="flex justify-center">
          <Image src="/qrcode.svg" alt="QR code" width="200" height="200" />
        </div>
      </DialogBody>
      <DialogActions>
        <Button plain>Cancel</Button>
        <Button href={`/verify/fill-details`}>Let&apos;s Go!</Button>
      </DialogActions>
    </>
  );
}
