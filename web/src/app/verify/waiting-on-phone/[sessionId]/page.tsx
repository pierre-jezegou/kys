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

export default function WaitingOnPhone({ params: { sessionId } }: Params) {
  const router = useRouter();

  const session = useSession(sessionId);

  const state = session?.state;

  useEffect(() => {
    if (!state) return;

    const progress = getProgress(state);

    if (progress == "approved") {
      router.push(`/verify/approved/${sessionId}`);
    } else if (progress == "denied") {
      router.push(`/verify/denied/${sessionId}`);
    }
  }, [router, sessionId, state]);

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
