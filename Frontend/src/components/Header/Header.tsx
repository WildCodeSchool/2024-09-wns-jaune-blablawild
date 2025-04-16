import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import NavBar from "../NavBar/NavBar";

export default function Header() {
  return (
    <header className="flex justify-between items-center h-[3rem] border-b border-solid px-3 md:px-0">
      <div className="md:hidden">
        <NavBar />
      </div>

      <div>
        <Link to="/">
          <img src="/logo2.png" alt="logo" className="w-[10rem]" />
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link to="/tripform" className="md:block hidden">
          <Button size="lg" className="rounded-3xl hover:no-underline hover:opacity-80" variant="link">
            <p className="text-foreground">Publier un trajet</p>
          </Button>
        </Link>
        
        <Link
          to="/tripform"
          className="md:hidden border-2 border-foreground rounded-full p-1"
        >
          <Plus strokeWidth={2} size={18} />
        </Link>

        <div className="hidden md:block md:mr-3">
          <NavBar />
        </div>
      </div>
    </header>
  );
}