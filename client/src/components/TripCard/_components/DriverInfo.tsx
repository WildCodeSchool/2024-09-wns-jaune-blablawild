import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/graphql/hooks";
import { DriverInfoProps } from "../_types/types";
import { useNavigate } from "react-router-dom";

export function DriverInfo({
  driver,
}: Readonly<{ driver: User | null | undefined }>) {
  if (!driver) return null;

  const driverInfo: DriverInfoProps = {
    firstname: driver.firstname,
    image: driver.profile?.image || "",
  };

    const navigate = useNavigate();
  
    const handleNavigateProfile = (id: string) => {
      navigate(`/user/${id}`)
    }

  return (
    <div onClick={() => handleNavigateProfile(driver.id)} className="flex items-center gap-3 hover:opacity-70">
      <div className="relative">
        <Avatar>
          <AvatarImage src={driverInfo.image} alt={driverInfo.firstname} />
          <AvatarFallback>{driverInfo.firstname?.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900">
          {driverInfo.firstname}
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-600">4,4</span>
          <span className="ml-1 text-yellow-400">★</span>
        </div>
      </div>
    </div>
  );
}
