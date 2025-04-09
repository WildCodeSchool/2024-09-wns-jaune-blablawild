import CarrouselTrip from "@/components/CarrouselTrip";
import { FaqSection } from "@/components/faq-section";
import { InformationSection } from "@/components/Information-section";
import { useGetPopularTripQuery } from "@/graphql/hooks";
import SearchBar from "../components/SearchBar/SearchBar";

const HomePage = () => {
  const { data } = useGetPopularTripQuery();
  const hasTrips = data?.getPopularTrip && data.getPopularTrip.length > 0;

  return (
    <section className="flex flex-col w-screen md:gap-35 gap-20">
      <section className="relative w-full h-[60vh] flex justify-center items-center">
        <div className="z-1 w-[70%] md:w-[80%]">
          <SearchBar path="/search-result" />
        </div>
        <img
          src="/home-background.jpg"
          alt=""
          className="absolute object-cover top-0 w-full h-full"
        />
      </section>
      <InformationSection />
      <img
        src="/home-page-carte.png"
        alt="cartographie"
        className="md:h-[250px] h-[150px]"
      />
      {hasTrips && (
        <div className="flex items-center justify-center w-full">
          <CarrouselTrip />
        </div>
      )}
      <FaqSection />
    </section>
  );
};

export default HomePage;
