import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="flex justify-between items-center h-[4.5rem] mt-2 mr-2">
      <img src="/logo2.png" alt="logo" className="w-[16rem]" />
      <Button size="lg" className="rounded-3xl mx-4" variant="outline">
        Se connecter
      </Button>
    </header>
  );
}
