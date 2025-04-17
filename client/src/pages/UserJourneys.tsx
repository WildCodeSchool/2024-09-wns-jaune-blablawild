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
    <section
      className="flex flex-col items-center"
      style={{ backgroundImage: `url(${van_image})` }}
    >
      <div className="flex-col h-screen justify-center w-[65%] bg-white p-5 overflow-y-scroll">
        <h1 className="self-start text-3xl">Mes Trajets</h1>
        <div className="flex justify-center">
          <ul className="flex w-full max-w-3xl justify-between border-b border-gray-200 mb-8">
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
        </div>
        <div>
          <TripCard trips={trips as Trip[]} />
        </div>
      </div>
    </section>
  );
}
