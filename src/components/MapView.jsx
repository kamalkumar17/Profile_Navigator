import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for the missing marker icon in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const MapView = ({ profiles, center, zoom = 4 }) => {
  // Calculate center if not provided
  if (!center && profiles.length > 0) {
    // Use the first profile's coordinates as default
    center = [profiles[0].location.coordinates.lat, profiles[0].location.coordinates.lng];
    
    // If there are multiple profiles, calculate the center
    if (profiles.length > 1) {
      const lats = profiles.map(p => p.location.coordinates.lat);
      const lngs = profiles.map(p => p.location.coordinates.lng);
      
      const sumLat = lats.reduce((acc, lat) => acc + lat, 0);
      const sumLng = lngs.reduce((acc, lng) => acc + lng, 0);
      
      center = [sumLat / lats.length, sumLng / lngs.length];
    }
  }

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {profiles.map((profile) => (
        <Marker 
          key={profile.id} 
          position={[profile.location.coordinates.lat, profile.location.coordinates.lng]}
        >
          <Popup>
            <div className="p-1">
              <div className="flex items-center mb-2">
                <img 
                  src={profile.photo} 
                  alt={profile.name} 
                  className="w-10 h-10 rounded-full object-cover mr-2"
                />
                <div>
                  <h3 className="font-medium text-sm">{profile.name}</h3>
                  <p className="text-xs text-gray-600">{profile.position}</p>
                </div>
              </div>
              <p className="text-xs mb-2">{profile.location.address}</p>
              <p className="text-xs mb-2">
                {profile.location.city}, {profile.location.state} {profile.location.zip}
              </p>
              <Link 
                to={`/profile/${profile.id}`}
                className="text-xs text-primary-500 hover:text-primary-600 font-medium"
              >
                View Profile
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;