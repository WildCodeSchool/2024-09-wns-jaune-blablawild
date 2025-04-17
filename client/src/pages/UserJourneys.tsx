import TripCard from "@/components/TripCard/TripCard";
import { Trip, useGetTripByUserQuery } from "@/graphql/hooks";
import { useState } from "react";
import van_image from "../assets/van-image-trip-form.png";

export default function UserJourneys() {
  const [activeTab, setActiveTab] = useState("À VENIR");

  const filter =
    activeTab === "À VENIR"
      ? "upcoming"
      : activeTab === "PASSÉS"
      ? "past"
      : "published";

  const { loading, error, data } = useGetTripByUserQuery({
    variables: { userId: "12", filter },
  });

  const tabs = ["À VENIR", "PASSÉS", "PUBLIÉS"];

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const trips = data?.getTripByUser ?? [];

  return (
    <section className="flex min-h-screen">
      <div className="w-[15%] hidden lg:block">
        <img src={van_image} alt="van" className="h-full w-full object-cover" />
      </div>
      <div className="w-full lg:w-[70%] bg-white p-8 overflow-y-auto">
        <h1 className="text-3xl mb-4">Mes trajets</h1>
        <ul className="flex justify-between border-b border-gray-200 mb-8">
          {tabs.map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center pb-3 cursor-pointer text-lg font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "border-b-2 border-secondary text-secondary"
                  : "border-b-2 border-transparent text-foreground hover:text-gray-800"
              }`}
            >
              {tab}
            </li>
          ))}
        </ul>
        <TripCard trips={trips as Trip[]} />
      </div>
      <div className="w-[15%] hidden lg:block">
        <img
          src={van_image}
          alt="van"
          className="h-full w-full object-cover object-[75%_center]"
        />
      </div>
    </section>
  );
}
