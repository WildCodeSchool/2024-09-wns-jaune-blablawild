import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/useUserStore";
import {
  CarTaxiFront,
  ChevronRight,
  CircleUserRound,
  LogOut,
  MessageSquareText,
  PlusCircle,
  Settings,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import UserCreationForm from "../UserCreationForm/UserCreationForm";
import UserLoginForm from "../UserLoginForm/UserLoginForm";
import { Button } from "../ui/button";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const closeNavbar = () => setOpen(false);

  const liClassName =
    "flex justify-between cursor-pointer transition-colors duration-200 hover:text-accent";
  const divClassName = "flex justify-center gap-2";

  const handleNavigation = (path: string) => {
    navigate(path);
    closeNavbar();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
      <CircleUserRound
          className="cursor-pointer"
          size={30}
          strokeWidth={1.5}
        />
      </PopoverTrigger>
      <PopoverContent className="w-screen h-screen md:w-[25vw] md:h-auto p-10 bg-background rounded-none mt-2 shadow-lg">
        <ul className="flex flex-col space-y-6 text-md">
          {isAuthenticated ? (
            <>
              <li
                className={liClassName}
                onClick={() => handleNavigation("userjourneys")}
              >
                <div className={divClassName}>
                  <CarTaxiFront /> Mes Trajets
                </div>
                <ChevronRight />
              </li>
              <Separator />
              <li
                className={liClassName}
                onClick={() => handleNavigation(`/user/${user?.id}`)}
              >
                <div className={divClassName}>
                  <UserRound /> Profil
                </div>
                <ChevronRight />
              </li>
              <Separator />
              <li
                className={liClassName}
                onClick={() => handleNavigation("/settings")}
              >
                <div className={divClassName}>
                  <Settings /> Paramètres
                </div>
                <ChevronRight />
              </li>
              <Separator />
              <li className={liClassName}>
                <div className={divClassName}>
                  <MessageSquareText /> Messages
                </div>
                <ChevronRight />
              </li>
              <Separator />
              <li
                className={liClassName}
                onClick={() => handleNavigation("/tripform")}
              >
                <div className={divClassName}>
                  <PlusCircle /> Publier un trajet
                </div>
                <ChevronRight />
              </li>
              <Separator />
              <li className={liClassName} onClick={handleLogout}>
                <div className={divClassName}>
                  <LogOut /> Déconnexion
                </div>
              </li>
            </>
          ) : (
            <>
              <Modal
                trigger={
                  <Button className="w-full rounded-3xl bg-accent hover:bg-secondary">
                    S'inscrire
                  </Button>
                }
                content={<UserCreationForm closeNavbar={closeNavbar} />}
                moduleTitle="Inscription"
              />
              <Modal
                trigger={
                  <Button
                    className="w-full rounded-3xl border-accent text-accent hover:bg-accent/10 hover:text-accent"
                    variant="outline"
                  >
                    Se connecter
                  </Button>
                }
                content={<UserLoginForm closeNavbar={closeNavbar} />}
                moduleTitle="Se connecter"
              />
            </>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
