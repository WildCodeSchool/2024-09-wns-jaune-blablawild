import CarrouselTrip from "@/components/CarrouselTrip";
import { FaqSection } from "@/components/faq-section";
import { InformationSection } from "@/components/Information-section";
import img from "../assets/home-background.jpg";
import SearchBar from "../components/SearchBar/SearchBar";
import HomePageCarte from "@/assets/pictures/home-page-carte.png";

const HomePage = () => {
  return (
    <section className="flex flex-col w-screen gap-6">
      <Header />
      <section className="relative w-full h-[60vh] flex justify-center items-center">
        <div className="z-1 w-[70%] md:w-[80%] md:h-[45px]">
          <SearchBar />
        </div>
        <img
          src={img}
          alt="Main picture on search trip"
          className="absolute object-cover top-0 w-full h-full"
        />
      </section>
      <InformationSection />
      <img src={HomePageCarte} alt="cartographie" className="md:h-[250px] h-[150px]" />
      <div className="flex items-center justify-center w-full">
        <CarrouselTrip />
      </div>
      <FaqSection />
    </section>
  );
};

export default HomePage;
