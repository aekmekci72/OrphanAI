import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLocation } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearestLocations, setNearestLocations] = useState([]);
  const location = useLocation();
  const passedLocations = location.state?.locations || [];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => console.error('Error getting user location:', error)
    );
  }, []);

  useEffect(() => {
    if (userLocation) {
      const sortedLocations = passedLocations
        .map(location => ({
          ...location,
          distance: calculateDistance(userLocation, location)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
      setNearestLocations(sortedLocations);
    }
  }, [userLocation, passedLocations]);

  const calculateDistance = (point1, point2) => {
    const R = 6371; 
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (userLocation && nearestLocations.length > 0) {
        const bounds = L.latLngBounds([userLocation, ...nearestLocations.map(loc => [loc.lat, loc.lng])]);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [map, userLocation, nearestLocations]);
    return null;
  };

  return (
    <div className="bg-white-resonate min-h-screen w-5/6 p-10 flex flex-col items-center">
      <h1 className="text-9xl text-grey-resonate mb-8">Nearby Locations</h1>
      <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
        {userLocation && (
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Your Location</Popup>
            </Marker>
            {nearestLocations.map((location) => (
              <Marker key={location.id} position={[location.lat, location.lng]}>
                <Popup>{location.name}</Popup>
              </Marker>
            ))}
            <MapUpdater />
          </MapContainer>
        )}
      </div>
      <div className="mt-8 w-full">
        <h2 className="text-3xl font-bold text-grey-resonate mb-4">Nearest Locations</h2>
        <ul className="space-y-2">
          {nearestLocations.map((location) => (
            <li key={location.id} className="bg-yellow-resonate rounded-lg p-4 shadow-md">
              <span className="font-semibold">{location.name}</span>
              <span className="ml-4 text-sm">
                ({location.distance.toFixed(2)} km away)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapComponent;