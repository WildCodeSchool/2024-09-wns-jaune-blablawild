import { CircleCheck } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
export default function Confirmation() {
  return (
    <section className="flex flex-col items-center gap-5">
      <CircleCheck size={50} />
      <h1 className="text-3xl text-accent">Trajet publié !</h1>
      <Link to="/">
        <Button variant="outline" className="rounded-full">
          Retour à l'accueil
        </Button>
      </Link>
    </section>
  );
}
