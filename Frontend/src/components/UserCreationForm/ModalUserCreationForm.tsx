import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import UserCreationForm from "./UserCreationForm";

export default function ModalUserCreationForm() {
    return (
        <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-3xl" variant="outline">
          Se connecter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Inscription</DialogTitle>
        </DialogHeader>
        <UserCreationForm />
      </DialogContent>
    </Dialog>
    );
}