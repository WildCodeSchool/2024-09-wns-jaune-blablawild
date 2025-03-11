import { FaqSection } from "@/components/faq-section";

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-bold">Drive Up</h1>
      </div>
      <FaqSection/>
    </div>
  );
};

export default HomePage;
