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
      router.push("/verify/approved");
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <>
      <DialogTitle>Crunching Numbers</DialogTitle>
      <DialogDescription>
        Were currently crunching the numbers. This may take a few minutes. Grab
        a coffee and relax, we will notify you once we are done.
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
