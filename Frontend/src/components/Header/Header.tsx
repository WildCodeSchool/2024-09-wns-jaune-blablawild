import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="flex justify-between items-center h-[3rem] mt-1 mr-3 border-b border-solid">
      <Link to="/">
        <img src="/logo2.png" alt="logo" className="w-[10rem]" />
      </Link>
      <div>
        <Button size="lg" className="rounded-3xl mx-4" variant="outline">
          Se connecter
        </Button>
        <Link to="/tripform">
          <Button size="lg" className="rounded-3xl mx-4" variant="outline">
            Ajouter un trajet
          </Button>
        </Link>
      </div>
    </header>
  );
}
