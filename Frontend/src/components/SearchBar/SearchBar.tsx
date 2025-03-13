import { ArrowRightLeft, CalendarDays, MapPin, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import PopoverPassenger from "./PopoverPassenger";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { useLocation, useNavigate } from "react-router-dom";
import PopoverCalendar from "./PopoverCalendar";
import { format, formatISO } from "date-fns";
import { fr } from "date-fns/locale";
import { capitalizeFirstLetter } from "../../utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type SearchBarProps = {
  path?: string;
};

export default function SearchBar({ path }: SearchBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [countPassenger, setCountPassenger] = useState<number>(1);
  const [departureCity, setDepartureCity] = useState<string>("");
  const [arrivalCity, setArrivalCity] = useState<string>("");
  const [departureTime, setDepartureTime] = useState<Date | null>(null);
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const handleCloseCalendar = () => {
    setOpenCalendar(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setDepartureCity(params.get("departure") || "");
    setArrivalCity(params.get("arrival") || "");
    const departureTimeParam = params.get("date");
    if (departureTimeParam) {
      setDepartureTime(new Date(departureTimeParam));
    }
    setCountPassenger(Number(params.get("passengers")) || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    const params = new URLSearchParams(location.search);
    if (departureCity) params.set("departure", departureCity);
    if (arrivalCity) params.set("arrival", arrivalCity);
    if (countPassenger > 0) params.set("passengers", countPassenger.toString());
    if (departureTime) params.set("date", formatISO(departureTime));
    if (path) {
      navigate(`${path}?${params.toString()}`);
    } else {
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  };

  return (
    <section className="w-full h-full flex flex-col md:flex-row items-center overflow-hidden rounded-md bg-background md:bg-white">
      <section className="w-full md:flex-1 flex flex-col md:flex-row items-center md:gap-1 px-5 md:p-1">
        <section className="w-full md:flex-1 flex items-center justify-center gap-2 bg-background py-2 px-3 md:px-2 md:py-0 md:rounded-md">
          <MapPin className="size-5" />
          <Input
            type="text"
            placeholder="Départ"
            className="w-full m-0 p-0 shadow-none border-none placeholder:text-foreground focus-visible:ring-0"
            value={departureCity}
            onChange={(e) => setDepartureCity(e.target.value)}
          />
          <ArrowRightLeft className="hidden md:block size-5" />
        </section>
        <Separator className="md:hidden" />
        <div className="w-full md:flex-1 flex items-center gap-2 bg-background py-2 px-3 md:py-0 md:px-2 md:rounded-md">
          <MapPin className="size-5" />
          <Input
            type="text"
            placeholder="Arrivée"
            className="w-full m-0 p-0 shadow-none border-none placeholder:text-foreground focus-visible:ring-0"
            value={arrivalCity}
            onChange={(e) => setArrivalCity(e.target.value)}
          />
        </div>
        <Separator className="md:hidden" />
        <div className="hidden md:block md:flex-[0.8]">
          <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
            <PopoverTrigger asChild>
              <div className="w-full flex items-center gap-2 bg-background text-foreground shadow-none cursor-pointer hover:bg-gray-200 md:px-2 md:py-2 px-3 py-4 md:rounded-md">
                <CalendarDays className="size-5" />
                {departureTime ? (
                  <p className="md:text-sm">
                    {capitalizeFirstLetter(
                      format(departureTime, "EEE dd MMM", { locale: fr })
                    )}
                  </p>
                ) : (
                  <p className="md:text-sm">Date</p>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="mt-1">
              <PopoverCalendar
                setSelected={setDepartureTime}
                selected={departureTime}
                onClose={handleCloseCalendar}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="block md:hidden w-full">
          <Dialog>
            <DialogTrigger asChild>
              <div className="w-full flex items-center gap-2 bg-background text-foreground shadow-none cursor-pointer hover:bg-gray-200 px-3 py-4 rounded-md">
                <CalendarDays className="size-5" />
                {departureTime ? (
                  <p className="text-sm">
                    {capitalizeFirstLetter(
                      format(departureTime, "EEE dd MMM", { locale: fr })
                    )}
                  </p>
                ) : (
                  <p className="md:text-sm">Date</p>
                )}
              </div>
            </DialogTrigger>
            <DialogContent
              className="flex flex-col justify-center items-center w-full"
              aria-describedby="dialog-date"
            >
              <DialogTitle>
                <p id="dialog-date" className="text-xs">
                  Sélectionner une date
                </p>
              </DialogTitle>
              <PopoverCalendar
                setSelected={setDepartureTime}
                selected={departureTime}
              />
            </DialogContent>
          </Dialog>
        </div>
        <Separator className="md:hidden" />
        <div className="hidden md:block md:flex-[0.8]">
          <Popover>
            <PopoverTrigger asChild>
              <div className="w-full flex items-center gap-2 bg-background text-foreground shadow-none cursor-pointer hover:bg-gray-200 md:px-2 md:py-2 px-3 py-4 md:rounded-md">
                <User className="size-5" />
                {countPassenger > 0 ? (
                  <p className="md:text-sm">
                    {countPassenger}{" "}
                    {`passager${countPassenger > 1 ? "s" : ""}`}
                  </p>
                ) : (
                  <p className="md:text-sm">Passagers</p>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end" className="mt-1">
              <PopoverPassenger
                count={countPassenger}
                setCount={setCountPassenger}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="block md:hidden w-full">
          <Dialog>
            <DialogTrigger asChild>
              <div className="w-full flex items-center gap-2 bg-background text-foreground shadow-none cursor-pointer hover:bg-gray-200 md:px-2 md:py-2 px-3 py-4 md:rounded-md">
                <User className="size-5" />
                {countPassenger > 0 ? (
                  <p className="md:text-sm">
                    {countPassenger}{" "}
                    {`passager${countPassenger > 1 ? "s" : ""}`}
                  </p>
                ) : (
                  <p className="md:text-sm">Passagers</p>
                )}
              </div>
            </DialogTrigger>
            <DialogContent aria-describedby="dialog-passenger">
              <DialogTitle>
                <p id="dialog-passenger" className="text-xs">
                  Sélectionner le nombre de passagers
                </p>
              </DialogTitle>
              <PopoverPassenger
                count={countPassenger}
                setCount={setCountPassenger}
              />
            </DialogContent>
          </Dialog>
        </div>
      </section>
      <Button
        type="button"
        className="w-full m:h-full h-[50px] text-md md:flex-[0.15] flex justify-center items-center md:justify-start bg-accent rounded-none hover:bg-secondary cursor-pointer"
        onClick={handleClick}
      >
        Rechercher
      </Button>
    </section>
  );
}
