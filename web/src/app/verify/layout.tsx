"use client";

import { Dialog } from "@/components/catalyst/dialog";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const handleClose = () => {};

  return (
    <>
      <Dialog open={true} onClose={handleClose}>
        {children}
      </Dialog>
    </>
  );
}
