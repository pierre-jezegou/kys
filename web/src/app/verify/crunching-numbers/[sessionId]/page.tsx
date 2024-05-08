"use client";
import {
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";
import { useSession } from "@/hooks/useSession";
import { getProgress } from "@/lib/session";
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

  const session = useSession(sessionId);

  const state = session?.state;

  useEffect(() => {
    if (!state) return;

    const progress = getProgress(state);
    if (progress == "approved") {
      console.log(progress);
      router.push(`/verify/approved/${sessionId}`);
    } else if (progress == "denied") {
      console.log(progress);
      router.push(`/verify/denied/${sessionId}`);
    }
  }, [router, sessionId, state]);

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
