import SearchBar from "@/components/SearchBar/SearchBar";

export function SearchHeader() {
  return (
    <section className="relative w-full h-[55vh] flex justify-center items-center">
      <img
        src="/searchTripImg.png"
        alt=""
        className="absolute object-cover top-0 w-full h-full"
      />
      <div className="flex flex-col justify-center items-center gap-7 z-1 w-[70%] md:w-[80%]">
        <p className="text-white text-2xl">Où souhaitez-vous aller ?</p>
        <div className="w-full">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
