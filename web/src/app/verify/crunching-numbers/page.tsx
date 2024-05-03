"use client";
import { Button } from "@/components/catalyst/button";
import {
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";
import Image from "next/image";
import { useCallback, useState } from "react";

import uploadToS3 from "@/utils/uploadToS3";
import { Description } from "@/components/catalyst/fieldset";

export default function CrunchingNumbers() {
  return (
    <>
      <DialogTitle>Crunching Numbers</DialogTitle>
      <DialogDescription>
        Were currently crunching the numbers. This may take a few minutes. Grab
        a coffee and relax, we will notify you once we are done.
      </DialogDescription>
      <DialogBody>
        <div className="flex justify-center animate-pulse mb-8">
          <Image src="/robot.png" alt="robot" width="200" height="200" />
        </div>

      </DialogBody>
    </>
  );
}
