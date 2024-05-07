"use client";
import {
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Params = {
  params: {
    sessionId: string;
  };
};

export default function WaitingOnPhone({ params: { sessionId } }: Params) {
  const router = useRouter();

  // TODO: Poll session status until it's complete

  return (
    <>
      <DialogTitle>Hang Tight—We&apos;re Almost There!</DialogTitle>
      <DialogDescription>
        We&apos;ll wait here while you wrap things up on your phone.
      </DialogDescription>
      <DialogBody>
        <div className="flex justify-center animate-pulse my-4">
          <Image
            src="/miroodles/color/pointing-phone.svg"
            alt="robot"
            width="200"
            height="200"
          />
        </div>
      </DialogBody>
    </>
  );
}
