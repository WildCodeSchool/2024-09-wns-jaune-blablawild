import React from 'react';
import { formatDate } from '@/utils/FormatDate';
import { formatUTCTime } from '@/utils/FormatUTC';

interface TripDetailsSummaryProps {
  date: string;
  departureTime: string;
  departureCity: string;
  departureAddress: string;
  arrivalTime: string;
  arrivalCity: string;
  arrivalAddress: string;
  tripDuration: string;
  driverName: string;
  driverRating: number;
  driverImage?: string;
}

export const TripDetailsSummary: React.FC<TripDetailsSummaryProps> = ({
  date,
  departureTime,
  departureCity,
  departureAddress,
  arrivalTime,
  arrivalCity,
  arrivalAddress,
  tripDuration,
  driverName,
  driverRating,
  driverImage,
}) => {
  return (
    <div className="rounded-lg border-2 border-blue-400 overflow-hidden mb-6">
      {/* Header with date */}
      <div className="bg-gray-100 p-5">
        <h2 className="text-orange-500 text-xl font-medium">
          {formatDate(date, 'fr')}
        </h2>
      </div>

      {/* Trip details section */}
      <div className="bg-gray-100 p-5 pb-4 border-b border-gray-200">
        <div className="flex">
          {/* Left column - Times and line */}
          <div className="flex flex-col items-center mr-4">
            {/* Departure time */}
            <div className="text-indigo-800 font-medium">
              {formatUTCTime(departureTime)}
              <div className="text-xs text-gray-500">
                {tripDuration}
              </div>
            </div>
            
            {/* Vertical line */}
            <div className="w-0.5 h-20 bg-indigo-800 my-1"></div>
            
            {/* Arrival time */}
            <div className="text-indigo-800 font-medium">
              {formatUTCTime(arrivalTime)}
            </div>
          </div>

          {/* Middle column - Dots */}
          <div className="flex flex-col items-center mr-4">
            {/* Departure dot */}
            <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-800 bg-white mt-1.5"></div>
            
            {/* Flex spacer */}
            <div className="flex-grow"></div>
            
            {/* Arrival dot */}
            <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-800 bg-white mt-auto"></div>
          </div>

          {/* Right column - Cities and addresses */}
          <div className="flex flex-col justify-between">
            {/* Departure location */}
            <div>
              <div className="text-indigo-800 font-medium">{departureCity}</div>
              <div className="text-xs text-gray-500">{departureAddress}</div>
            </div>
            
            {/* Arrival location */}
            <div className="mt-auto">
              <div className="text-indigo-800 font-medium">{arrivalCity}</div>
              <div className="text-xs text-gray-500">{arrivalAddress}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Driver section */}
      <div className="bg-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <path d="M16 6l3 4h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h2l3-4h8z" />
              <circle cx="9" cy="15" r="1" />
              <circle cx="15" cy="15" r="1" />
            </svg>
          </div>
          {driverImage ? (
            <img
              src={driverImage}
              alt={driverName}
              className="w-8 h-8 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 mr-3"></div>
          )}
          <div>
            <span className="text-gray-800 font-medium">{driverName}</span>
            <div className="flex items-center">
              <span className="text-yellow-500 text-xs mr-1">★</span>
              <span className="text-xs text-gray-600">{driverRating}</span>
            </div>
          </div>
        </div>
        <div className="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsSummary;