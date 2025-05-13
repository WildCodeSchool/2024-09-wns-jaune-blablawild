import React from 'react';
import { formatUTCTime } from '@/utils/FormatUTC';

interface TripDetailsCardProps {
  departureCity: string;
  departureAddress: string;
  arrivalCity: string;
  arrivalAddress: string;
  departureHour: string;
  arrivalHour: string;
  timeTrip: string;
}

export const TripDetailsCard: React.FC<TripDetailsCardProps> = ({
  departureCity,
  departureAddress,
  arrivalCity,
  arrivalAddress,
  departureHour,
  timeTrip,
  arrivalHour,
}) => {
  return (
    <div className="bg-gray-100 border-[#E5E5E5] border-1 rounded-lg px-6 py-8 mb-6">
      <div className="flex">
        <div className="flex flex-col justify-between mr-2">
          <div>
            <p className="text-forecast text-xl">{formatUTCTime(departureHour)}</p>
            <p className="text-xs text-gray-500">{timeTrip}</p>
          </div>
          <p className="text-forecast text-xl">{arrivalHour}</p>
        </div>
        
        <div className="flex flex-col items-center mx-2 relative">
          <div className="w-2 h-2 rounded-full border-2 border-[#4E598C]"></div>
          <div className="w-0.5 h-24 bg-[#4E598C] my-1"></div>
          <div className="w-2 h-2 rounded-full border-2 border-[#4E598C]"></div>
        </div>
        
        <div className="flex flex-col justify-between ml-2">
          <div>
            <p className="text-lg text-forecast">{departureCity}</p>
            <p className="text-xs text-forecast">{departureAddress}</p>
          </div>
          <div>
            <p className="text-lg text-forecast">{arrivalCity}</p>
            <p className="text-xs text-forecast">{arrivalAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsCard;