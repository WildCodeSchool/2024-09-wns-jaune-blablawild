import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface DisplayMapProps {
  departureCoordinates?: Coordinates;
  arrivalCoordinates?: Coordinates;
}

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, map, zoom]);
  
  return null;
}


delete (L.Icon.Default.prototype as any)._getIconUrl;

const departureIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconSize: [25, 40],
});

const arrivalIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 40],
});

export const DisplayMap = ({ departureCoordinates, arrivalCoordinates }: DisplayMapProps) => {
 
  const defaultCenter: [number, number] = [48.8566, 2.3522];
  
  console.log(import.meta.env.VITE_STADIA_MAP_API_KEY)

  let center: [number, number] = defaultCenter;
  let zoom = 13;

 
  if (departureCoordinates && arrivalCoordinates) {
    center = [
      (departureCoordinates.lat + arrivalCoordinates.lat) / 2,
      (departureCoordinates.lng + arrivalCoordinates.lng) / 2
    ];
    
    // Calculer la distance pour ajuster le zoom
    const latDiff = Math.abs(departureCoordinates.lat - arrivalCoordinates.lat);
    const lngDiff = Math.abs(departureCoordinates.lng - arrivalCoordinates.lng);
    
    if (latDiff > 3 || lngDiff > 3) {
      zoom = 5;  // Grandes distances
    } else if (latDiff > 1 || lngDiff > 1) {
      zoom = 8;  // Distances moyennes
    } else {
      zoom = 10; // Petites distances
    }
  } 
 
  else if (departureCoordinates) {
    center = [departureCoordinates.lat, departureCoordinates.lng];
  } else if (arrivalCoordinates) {
    center = [arrivalCoordinates.lat, arrivalCoordinates.lng];
  }

  return (
    <div className='w-full h-full'>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          url={`https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=${import.meta.env.VITE_STADIA_MAP_API_KEY}`}
          minZoom={0}
          maxZoom={20}
          attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {departureCoordinates && (
          <Marker 
            position={[departureCoordinates.lat, departureCoordinates.lng]} 
            icon={departureIcon}
          />
        )}
        
        {arrivalCoordinates && (
          <Marker 
            position={[arrivalCoordinates.lat, arrivalCoordinates.lng]} 
            icon={arrivalIcon}
          />
        )}
        
        <MapUpdater center={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
};