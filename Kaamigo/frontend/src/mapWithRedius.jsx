import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

const MapWithRadius = ({ freelancers = [], userLocation = null }) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (userLocation) {
      setPosition([userLocation.lat, userLocation.lng]);
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => setPosition([28.6139, 77.209]) // fallback: Delhi
      );
    }
  }, [userLocation]);

  return position ? (
    <MapContainer center={position} zoom={13} scrollWheelZoom className="w-full h-full z-10">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Circle center={position} radius={10000} pathOptions={{ color: "purple", fillOpacity: 0.2 }} />
      <Marker position={position}>
        <Popup>You are here!</Popup>
      </Marker>
      {freelancers.map((freelancer) => (
        <Marker 
          key={freelancer.id} 
          position={[freelancer.location?.lat || 28.6139, freelancer.location?.lng || 77.209]}
        >
          <Popup>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-orange-400 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg">
                {freelancer.name.charAt(0)}
              </div>
              <strong className="text-purple-700">{freelancer.name}</strong>
              <br />
              <span className="text-gray-600">{freelancer.role}</span>
              <br />
              <span className="text-sm text-gray-500">⭐ {freelancer.rating} • ₹{freelancer.price}</span>
              {freelancer.isPro && (
                <div className="mt-1">
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">PRO</span>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  ) : (
    <p className="text-center text-gray-500">Loading map...</p>
  );
};

export default MapWithRadius;
