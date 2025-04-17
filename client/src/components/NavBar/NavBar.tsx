import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { CircleUserRound } from "lucide-react";
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

export default function NavBar() {
  const navigate = useNavigate();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <CircleUserRound className="cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-screen h-screen md:w-[25vw] md:h-auto p-10 bg-background rounded-none mt-2">
        <ul className="flex flex-col space-y-6 text-md ">
          <li
            className="flex justify-between cursor-pointer px-4 py-2 transition-colors duration-200 hover:text-primary"
            onClick={() => navigate("userjourneys")}
          >
            <div className="flex justify-center gap-2">
              <CarTaxiFront /> Mes Trajets
            </div>
            <ChevronRight />
          </li>
          <Separator />
          <li className="flex justify-between cursor-pointer px-4 py-2 transition-colors duration-200 hover:text-primary">
            <div className="flex justify-center gap-2">
              <UserRound /> Profile
            </div>
            <ChevronRight />
          </li>
          <Separator />
          <li className="flex justify-between cursor-pointer px-4 py-2 transition-colors duration-200 hover:text-primary">
            <div className="flex justify-center gap-2">
              <MessageSquareText /> Messages
            </div>
            <ChevronRight />
          </li>
          <Separator />
          <Modal
            trigger={<Button>Inscription</Button>}
            content={<UserCreationForm />}
            moduleTitle="Inscription"
          />
          <Modal
            trigger={<Button>Se connecter</Button>}
            content={<UserLoginForm />}
            moduleTitle="Se connecter"
          />
          <Separator />
          <li className="flex gap-2 cursor-pointer px-4 py-2 transition-colors duration-200 hover:text-primary">
            <LogOut /> Déconnexion
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
