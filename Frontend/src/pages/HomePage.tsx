import SearchBar from "../components/SearchBar/SearchBar";
import img from "../assets/home-background.jpg";
import Header from "@/components/Header";
import { FaqSection } from "@/components/faq-section";
import { InformationSection } from "@/components/Information-section";

const HomePage = () => {
  return (
    <section className="flex flex-col h-screen">
      <Header />
      <section className="relative w-full h-[60%] flex justify-center items-center">
        <div className="z-1 w-[60%] md:w-[80%] md:h-[45px]">
          <SearchBar />
        </div>
        <img
          src={img}
          alt="Main picture on search trip"
          className="absolute object-cover top-0 w-full h-full"
        />
      </section>
      <InformationSection/>
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-bold">Drive Up</h1>
      </div>
      <FaqSection/>
    </>
    </section>
  );
};

export default HomePage;
