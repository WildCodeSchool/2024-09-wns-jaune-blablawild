import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import UserCreationForm from "./UserCreationForm";
import { useState } from "react";

export default function ModalUserCreationForm() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmissionSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="rounded-3xl"
          variant="outline"
          onClick={() => setIsOpen(true)}
        >
          Se connecter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Inscription</DialogTitle>
        </DialogHeader>
        <UserCreationForm onSuccess={handleSubmissionSuccess} />
      </DialogContent>
    </Dialog>
  );
}
