import Header from "@/components/Header";

const HomePage = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col h-screen w-full">
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-4xl font-bold">Drive Up</h1>
        </div>
      </div>
    </>
  );
};

export default HomePage;
