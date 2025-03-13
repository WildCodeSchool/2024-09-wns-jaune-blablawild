import { useGetPopularTripQuery } from "@/graphql/hooks";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { displayPictureCity } from "@/utils/DisplayCityPictures";
import { useLocation, useNavigate } from "react-router-dom";
import { formatISO } from "date-fns";

type TripPopular = {
  id: string;
  departure_city: string;
  arrival_city: string;
  price: number;
};

export default function CarrouselTrip() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, data } = useGetPopularTripQuery();

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleClick = (trip: TripPopular) => {
    const params = new URLSearchParams(location.search);
    params.set("departure", trip.departure_city);
    params.set("arrival", trip.arrival_city);
    params.set("date", formatISO(new Date()));
    navigate(`/search-result?${params.toString()}`);
  };

  return (
    <section className="flex flex-col items-center w-full gap-15">
      <h1 className="md:text-3xl text-2xl text-center font-semibold">
        Nos itinéraires les plus populaires
      </h1>
      <Carousel
        opts={{
          align: "start",
        }}
        className="max-w-2/3 md:max-w-[90%]"
      >
        <CarouselContent>
          {data?.getPopularTrip.map((trip, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="w-full relative">
                  <CardContent className="relative flex flex-col md:h-[33rem] h-[25rem] items-center justify-end p-6 gap-8 overflow-hidden rounded-[15px]">
                    <img
                      src={displayPictureCity()}
                      alt="cities-pictures"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <p className="relative z-10 flex justify-start md:text-3xl text-2xl font-semibold text-white w-full">
                      {`${trip.departure_city} → ${trip.arrival_city}`}
                    </p>

                    <div className="relative z-10 flex justify-between w-full">
                      <p className="md:text-2xl text-2xl  text-white">
                        Dès {trip.price} €
                      </p>
                      <Button
                        className="bg-accent rounded-full md:px-7 md:py-6 px-5 py-4 text-md text-background cursor-pointer"
                        onClick={() => handleClick(trip)}
                      >
                        Réserver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
