import React, { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type WithCloseModal = {
  closeModal?: () => void;
};

type ModalProps = {
  content: ReactNode;
  trigger: ReactNode;
  moduleTitle: string;
  description?: string;
};

export default function Modal({
  content,
  trigger,
  moduleTitle,
  description = "Formulaire",
}: ModalProps) {
  const [open, setOpen] = useState(false);

  const contentWithClose = React.isValidElement(content)
    ? React.cloneElement(content as React.ReactElement<WithCloseModal>, {
        closeModal: () => setOpen(false),
      })
    : content;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">{moduleTitle}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {contentWithClose}
      </DialogContent>
    </Dialog>
  );
}
