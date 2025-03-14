import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export default function Header() {
  return (
    <header className="flex justify-between items-center h-[3rem] my-1 mr-3">
      <Link to="/">
        <img src="/logo2.png" alt="logo" className="w-[10rem]" />
      </Link>
      <div className="flex gap-2">
        <Link to="/tripform">
          <Button size="lg" className="rounded-3xl" variant="outline">
            <Plus />
            <p className="md:block hidden">Ajouter un trajet</p>
          </Button>
        </Link>
        <Button size="lg" className="rounded-3xl" variant="outline">
          Se connecter
        </Button>
      </div>
    </header>
  );
}
