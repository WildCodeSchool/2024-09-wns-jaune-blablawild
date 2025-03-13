import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="flex justify-between items-center h-[3rem] my-1 mr-3">
      <Link to="/">
        <img src="/logo2.png" alt="logo" className="w-[10rem]" />
      </Link>
      <Button size="lg" className="rounded-3xl mx-4" variant="outline">
        Se connecter
      </Button>
    </header>
  );
}
