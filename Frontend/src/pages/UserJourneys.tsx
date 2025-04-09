import van_image from "../assets/van-image-trip-form.png";
import { useState } from "react";

export default function UserJourneys() {
    const [activeTab, setActiveTab] = useState("À VENIR");

    const tabs = ["À VENIR", "PASSÉS", "PUBLIÉS"];
  return (
    <section className="flex flex-col items-center" style={{ backgroundImage: `url(${van_image})` }}>
      <div className="flex-col h-screen justify-center w-[65%] bg-white p-5">
        <h1 className="self-start text-3xl">Mes Trajets</h1>
        <div className="flex justify-center">
          <ul className="flex w-full max-w-3xl justify-between border-b border-gray-200 mb-8">
            {tabs.map((tab) => (
                 <li
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`flex-1 text-center pb-3 cursor-pointer text-lg font-medium transition-all duration-200 ${
                   activeTab === tab
                     ? "border-b-2 border-orange-500 text-orange-500"
                     : "border-b-2 border-transparent text-gray-600 hover:text-gray-800"
                 }`}
               >
                 {tab}
               </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
