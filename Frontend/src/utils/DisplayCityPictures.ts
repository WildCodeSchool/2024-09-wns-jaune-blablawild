import Caen from "@/assets/pictures/Caen.jpg";
import Cherbourg from "@/assets/pictures/Cherbourg.jpg";
import Lille from "@/assets/pictures/Lille.webp";
import Toulon from "@/assets/pictures/Toulon.avif";
import Toulouse from "@/assets/pictures/Toulouse.jpg";

const cities = [
  { name: "Caen", img: Caen },
  { name: "Cherbourg", img: Cherbourg },
  { name: "Lille", img: Lille },
  { name: "Toulon", img: Toulon },
  { name: "Toulouse", img: Toulouse },
];

export const displayPictureCity = (arrival_city: string) => {
  return cities.find((city) => arrival_city === city.name)?.img;
};
