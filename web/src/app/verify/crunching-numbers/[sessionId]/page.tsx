"use client";
import {
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Params = {
  params: {
    sessionId: string;
  };
};

export default function CrunchingNumbers({ params: { sessionId } }: Params) {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const approved = Math.random() > 0.5;

      if (approved) {
        router.push(`/verify/approved/${sessionId}`);
      } else {
        router.push(`/verify/denied/${sessionId}`);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [router, sessionId]);

  return (
    <>
      <DialogTitle>We&apos;re On It!</DialogTitle>
      <DialogDescription>
        We&apos;re quickly crunching the numbers to verify your identity. Just a
        moment and you&apos;ll be all set!
      </DialogDescription>
      <DialogBody>
        <div className="flex justify-center animate-pulse my-4">
          <Image
            src="/miroodles/color/robot.svg"
            alt="robot"
            width="200"
            height="200"
          />
        </div>
      </DialogBody>
    </>
  );
}
