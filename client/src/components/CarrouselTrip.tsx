import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useGetPopularTripQuery } from "@/graphql/hooks";
import { displayPictureCity } from "@/utils/DisplayCityPictures";
import { formatISO } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";

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

  const images = displayPictureCity();

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleClick = (trip: TripPopular) => {
    const params = new URLSearchParams(location.search);
    params.set("departure", trip.departure_city);
    params.set("arrival", trip.arrival_city);
    params.set("date", formatISO(new Date()));
    navigate(`/search-result?${params.toString()}`);
  };

  const getCarouselItemClass = (totalItems: number) => {
    if (totalItems === 1) return "basis-full";
    if (totalItems === 2) return "basis-1/2";
    return "md:basis-1/2 lg:basis-1/3";
  };

  return (
    <section className="flex flex-col items-center w-full gap-10 ">
      <h1 className="px-4 md:text-3xl text-2xl text-center font-semibold">
        Nos itinéraires les plus populaires
      </h1>
 
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="max-w-2/3 md:max-w-[90%] w-full"
      >
          <div className="flex justify-center items-center gap-4 mb-6 md:mb-10">
        <CarouselPrevious className="static translate-y-0 translate-x-0" />
        <CarouselNext className="static translate-y-0 translate-x-0" />
      </div>
        <CarouselContent>
          {data?.getPopularTrip.map((trip, index) => (
            <CarouselItem
              key={trip.id}
              className={getCarouselItemClass(data.getPopularTrip.length)}
            >
              <div className="p-1">
                <Card className="w-full relative">
                  <CardContent className="relative flex flex-col md:h-[33rem] h-[25rem] items-center justify-end p-6 gap-8 overflow-hidden rounded-[15px]">
                    <img
                      src={images[index % images.length]}
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
      
      </Carousel>
    </section>
  );
}
