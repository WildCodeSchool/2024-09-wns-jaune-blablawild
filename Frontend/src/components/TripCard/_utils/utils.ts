import { formatTime } from "@/utils/FormatTime";

export const calculateArrivalTime = (departureTime: string | Date): string => {
  const date = new Date(departureTime);
  date.setHours(date.getHours() + 8);
  return date.toISOString();
};

export const formatHourFromTime = (time: string | Date): string => {
  return new Date(time).getUTCHours() + "h";
};

export const formatDuration = (
  time: string | Date,
  locale: string = "fr"
): string => {
  const timeStr = time instanceof Date ? time.toISOString() : time;
  const [hours, minutes] = formatTime(timeStr, locale).split(":");
  return `${hours}h${minutes}`;
};

export const calculateTripDuration = (
  departureTime: string | Date,
  arrivalTime: string | Date
): string => {
  const departureDate = new Date(departureTime);
  const arrivalDate = new Date(arrivalTime);
  const durationInHours =
    (arrivalDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60);
  return `${Math.floor(durationInHours)}h${durationInHours % 1 ? "30" : "00"}`;
};

export const getImageUrl = (city: string): string => {
  return `/${city}.jpg`;
};

export const mockTrips = [
  {
    id: "1",
    departure_time: new Date("2024-03-20T08:00:00").toISOString(),
    departure_city: "Paris",
    arrival_city: "Cherbourg",
    price: 25,
    capacity: 3,
    driver: {
      id: "d1",
      firstname: "Jean",
      lastname: "Dupont",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
    },
  },
  {
    id: "2",
    departure_time: new Date("2024-03-20T10:30:00").toISOString(),
    departure_city: "Marseille",
    arrival_city: "Caen",
    price: 20,
    capacity: 2,
    driver: {
      id: "d2",
      firstname: "Marie",
      lastname: "Martin",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
    },
    passengers: [
      {
        id: "p1",
        firstname: "Sophie",
        lastname: "Martin",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      },
      {
        id: "p2",
        firstname: "Lucas",
        lastname: "Bernard",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
      },
    ],
  },
];
