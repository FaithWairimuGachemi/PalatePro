import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix standard marker icon issues in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ position, setPosition, setDeliveryLocation }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setDeliveryLocation(`Coordinates: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`);
      
      // Reverse Geocoding with Nominatim to get human-readable localized address
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
        .then(res => res.json())
        .then(data => {
            if(data && data.display_name) {
               setDeliveryLocation(data.display_name);
            }
        }).catch(err => console.log('Geocoding error:', err));
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const LocationMap = ({ setDeliveryLocation }) => {
  const [position, setPosition] = useState(null);
  
  // Default to Nairobi, Kenya
  const defaultCenter = [-1.2921, 36.8219];

  return (
    <div style={{ height: '300px', width: '100%', marginBottom: '15px', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }}>
      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          className="map-tiles"
        />
        <LocationMarker position={position} setPosition={setPosition} setDeliveryLocation={setDeliveryLocation} />
      </MapContainer>
    </div>
  );
};

export default LocationMap;
