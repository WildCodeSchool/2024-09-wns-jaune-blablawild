import React from "react";

export const TripDetailsCard = ({ 
  departureCity = "Paris", 
  departureAddress = "91 rue de charenton",
  arrivalCity = "Marseilles", 
  arrivalAddress = "10 rue du bon shit",
  departureHour = "8h10", 
  departureSubHour = "7h40",
  arrivalHour = "15h50" 
}) => {
  return (
    <div className="bg-gray-100 rounded-lg p-6 mb-6">
      <div className="flex">
        {/* Colonne de gauche : heures et ligne */}
        <div className="flex flex-col items-center mr-6">
          {/* Heure de départ */}
          <div className="flex flex-col items-center">
            <span className="text-blue-600 font-semibold">{departureHour}</span>
            <span className="text-xs text-gray-500">{departureSubHour}</span>
          </div>
          
          {/* Ligne verticale */}
          <div className="w-0.5 h-24 bg-blue-600 my-1"></div>
          
          {/* Heure d'arrivée */}
          <div className="text-blue-600 font-semibold">{arrivalHour}</div>
        </div>
        
        {/* Colonne de droite : villes et adresses */}
        <div className="flex flex-col justify-between">
          {/* Ville et adresse de départ */}
          <div>
            <div className="font-semibold text-gray-800">{departureCity}</div>
            <div className="text-xs text-blue-500">{departureAddress}</div>
          </div>
          
          {/* Ville et adresse d'arrivée */}
          <div>
            <div className="font-semibold text-gray-800">{arrivalCity}</div>
            <div className="text-xs text-blue-500">{arrivalAddress}</div>
          </div>
        </div>
      </div>
    </div>
  );
};