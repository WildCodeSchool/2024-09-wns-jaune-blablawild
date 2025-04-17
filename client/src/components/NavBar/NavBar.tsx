import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { CircleUserRound, Settings } from "lucide-react";
import { CarTaxiFront } from "lucide-react";
import { UserRound } from "lucide-react";
import { MessageSquareText } from "lucide-react";
import { LogOut } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserCreationForm from "../UserCreationForm/UserCreationForm";
import { Button } from "../ui/button";
import Modal from "../Modal/Modal";
import UserLoginForm from "../UserLoginForm/UserLoginForm";
import { useState } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const liClassName =
    "flex justify-between cursor-pointer transition-colors duration-200 hover:text-accent";
  const divClassName = "flex justify-center gap-2";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <CircleUserRound
          className="cursor-pointer"
          size={30}
          strokeWidth={1.5}
        />
      </PopoverTrigger>
      <PopoverContent className="w-screen h-screen md:w-[25vw] md:h-auto p-10 bg-background rounded-none mt-2">
        <ul className="flex flex-col space-y-6 text-md ">
          <li className={liClassName} onClick={() => navigate("userjourneys")}>
            <div className={divClassName}>
              <CarTaxiFront /> Mes Trajets
            </div>
            <ChevronRight />
          </li>
          <Separator />
          <li className={liClassName}>
            <div className={divClassName}>
              <UserRound /> Profile
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
          <li
            className={liClassName}
            onClick={() => handleNavigation("/messages")}
          >
            <div className={divClassName}>
              <MessageSquareText /> Messages
            </div>
            <ChevronRight />
          </li>
          <Separator />
          <Modal
            trigger={
              <Button onClick={() => setIsOpen(false)}>Inscription</Button>
            }
            content={<UserCreationForm />}
            moduleTitle="Inscription"
          />
          <Modal
            trigger={
              <Button onClick={() => setIsOpen(false)}>Se connecter</Button>
            }
            content={<UserLoginForm />}
            moduleTitle="Se connecter"
          />
          <Separator />
          <li className={liClassName}>
            <div className={divClassName}>
              <LogOut /> Déconnexion
            </div>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
