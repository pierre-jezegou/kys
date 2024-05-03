"use client";

import { Dialog } from "@/components/catalyst/dialog";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Dialog show={true} onClose={() => {}}>
        {children}
      </Dialog>
    </>
  );
}
