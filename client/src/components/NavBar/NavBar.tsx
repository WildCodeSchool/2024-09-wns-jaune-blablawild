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
import UserLoginForm from "../UserLoginForm/UserLoginForm";
import { Button } from "../ui/button";
import { useGetProfileQuery } from "@/graphql/hooks";

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

  let stringUserId = null; 
  if (user && user.id) {
    stringUserId = String(user.id);
  }
  
  const { data } = useGetProfileQuery({
    skip: !isAuthenticated || !stringUserId,
    variables: {
      userId: stringUserId || "",
    },
  });

  let profileImage = null;
  if (data?.getProfile.image) {
    profileImage = data?.getProfile.image;
  }

  return (
    <>
      {!isAuthenticated ? (
        <Modal
        trigger={
          <Button className="rounded-full px-6 bg-transparent" variant="outline">
            Se connecter
          </Button>
        }
        content={<UserLoginForm closeNavbar={closeNavbar} />}
        moduleTitle="Se connecter"
        dialogStyle="w-[350px]"
        />
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            {profileImage ? (
              <img src={profileImage} className="w-8 h-8 rounded-full cursor-pointer" alt="Profile" />
            ) : (
              <CircleUserRound
                className="cursor-pointer"
                size={30}
                strokeWidth={1.5}
              />
            )}
          </PopoverTrigger>
          <PopoverContent className="w-screen h-screen md:w-[25vw] md:h-auto p-10 bg-background rounded-none shadow-lg">
            <ul className="flex flex-col space-y-6 text-sm">
              <li
                className={liClassName}
                onClick={() => handleNavigation("userjourneys")}
              >
                <div className={divClassName}>
                  <CarTaxiFront size={20} /> Mes Trajets
                </div>
                <ChevronRight size={20} />
              </li>
              <Separator />
              <li
                className={liClassName}
                onClick={() => handleNavigation(`/user/${user?.id}`)}
              >
                <div className={divClassName}>
                  <UserRound size={20} /> Profil
                </div>
                <ChevronRight size={20} />
              </li>
              <Separator />
              <li
                className={liClassName}
                onClick={() => handleNavigation("/settings")}
              >
                <div className={divClassName}>
                  <Settings size={20} /> Paramètres
                </div>
                <ChevronRight size={20} />
              </li>
              <Separator />
              <li className={liClassName}>
                <div className={divClassName}>
                  <MessageSquareText size={20} /> Messages
                </div>
                <ChevronRight size={20} />
              </li>
              <Separator />
              <li
                className={liClassName}
                onClick={() => handleNavigation("/tripform")}
              >
                <div className={divClassName}>
                  <PlusCircle size={20} /> Publier un trajet
                </div>
                <ChevronRight size={20} />
              </li>
              <Separator />
              <li className={liClassName} onClick={handleLogout}>
                <div className={divClassName}>
                  <LogOut size={20} /> Déconnexion
                </div>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}