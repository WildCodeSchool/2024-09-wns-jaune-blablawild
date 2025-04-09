import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
export default function Confirmation() {
  return (
    <section className="flex flex-col items-center gap-5">
      <Check size={30} /> 
      <h1 className="text-3xl text-accent mb-10">Trajet publié !</h1>
      <Link to="/">
        <Button variant="outline" className="rounded-full px-6 py-5">
          Retour à l'accueil
        </Button>
      </Link>
    </section>
  );
}
