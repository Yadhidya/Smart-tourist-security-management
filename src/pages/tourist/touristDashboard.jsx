import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Mock Data
const tourists = [{
  id: 'T-0001',
  name: 'Asha Devi',
  country: 'India',
  itinerary: 'Chennai → Madurai → Tiruchirappalli',
  safetyScore: 87,
  status: 'Active',
  lastLocation: { lat: 13.0827, lng: 80.2707 }, // Chennai
  plannedRoute: [
    [13.0827, 80.2707],  // Chennai
    [9.9252, 78.1198],   // Madurai
    [10.7905, 78.7047]   // Tiruchirappalli
  ]
}];

const riskZones = [
  { name: "Madurai City Center", lat: 9.9252, lng: 78.1198, radius: 2000 },
  { name: "Tiruchirappalli Airport", lat: 10.7634, lng: 78.7047, radius: 1000 }
];

// Haversine distance calculation
const getDistance = (loc, zone) => {
  const R = 6371e3;
  const φ1 = (loc.lat * Math.PI) / 180;
  const φ2 = (zone.lat * Math.PI) / 180;
  const Δφ = ((zone.lat - loc.lat) * Math.PI) / 180;
  const Δλ = ((zone.lng - loc.lng) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const findNearestZone = (location, zones) => {
  if (!location) return null;
  let nearest = null;
  let minDist = Infinity;

  zones.forEach(zone => {
    const dist = getDistance(location, zone);
    if (dist < minDist) {
      minDist = dist;
      nearest = { ...zone, distance: dist };
    }
  });

  return nearest;
};

// Main Component
export default function TouristDashboard() {
  const [tourist, setTourist] = useState(tourists[0]);
  const [location, setLocation] = useState(tourist.lastLocation);
  const [alert, setAlert] = useState(null);
  const [nearest, setNearest] = useState(null);

  // Geofencing alert
  useEffect(() => {
    if (!location) return;
    const zone = findNearestZone(location, riskZones);
    setNearest(zone);
    if (zone && zone.distance <= zone.radius) {
      setAlert(`⚠️ Entered risky area: ${zone.name}`);
    } else {
      setAlert(null);
    }
  }, [location]);

  // Handle fetching new route from OpenRouteService
  const handleNewTrip = async () => {
    const newItinerary = 'Chennai → Madurai → Tiruchirappalli';
    const orsApiKey = ''; // replace with your ORS API key
    const orsUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsApiKey}&start=80.2707,13.0827&end=78.1198,9.9252`;

    try {
      const response =axios.get(orsUrl, { headers: { Accept: "application/json" } });
      const data = response.data;
console.log(response);
      if (data && data.features && data.features.length > 0) {
        // Map GeoJSON coordinates [lng, lat] -> [lat, lng]
        const routeCoords = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);

        setTourist({
          ...tourist,
          plannedRoute: routeCoords,
          itinerary: newItinerary
        });

        setAlert('New trip planned! The map will now show the new route.');
      } else {
        setAlert('Error: Could not fetch route from API.');
      }
    } catch (error) {
      console.error("Route planning error:", error);
      setAlert('Error: Could not fetch route from API. Check API key or network.');
    }
  };

  const plannedRouteColor = { color: 'blue' };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Map Section */}
      <div className="md:col-span-2 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Current Location & Planned Route</h3>
        {location ? (
          <MapContainer
            center={location}
            zoom={6}
            style={{ height: "500px", width: "100%" }}
            key={tourist.itinerary} // force re-render on route change
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline pathOptions={plannedRouteColor} positions={tourist.plannedRoute} />
            <Marker position={location}>
              <Popup>You are here</Popup>
            </Marker>
            {riskZones.map((zone, idx) => (
              <Circle
                key={idx}
                center={[zone.lat, zone.lng]}
                radius={zone.radius}
                pathOptions={{ color: "red" }}
              >
                <Popup>{zone.name}</Popup>
              </Circle>
            ))}
          </MapContainer>
        ) : <p>Fetching location...</p>}
        {alert && (
          <div className="mt-4 p-3 border rounded bg-red-100 text-red-800 font-semibold">
            {alert}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="bg-white p-4 rounded shadow">
        <div className="p-4 bg-gray-100 rounded-lg shadow-inner mb-4">
          <div className="font-bold text-xl text-gray-800">{tourist.name}</div>
          <div className="text-gray-600 mb-2">Tourist</div>
          <div className="flex items-center justify-between">
            <span className="text-5xl font-extrabold text-blue-600">{tourist.safetyScore}</span>
            <span className="text-sm font-medium text-gray-500">Safety Score</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Auto-assigned safety score based on travel patterns and area sensitivity (prototype).
          </p>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Trip Details</h4>
          <p className="text-sm text-gray-600 mb-2">
            Itinerary: <strong>{tourist.itinerary}</strong>
          </p>
          <p className="text-sm font-medium">
            Next stop: <span className="text-blue-500">Madurai</span>
          </p>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Quick Actions</h4>
          <div className="space-y-2">
            <Link to="/tourist/panic" className="block w-full text-center px-3 py-2 bg-red-600 text-white rounded">
              Panic Button
            </Link>
            <Link to="/tourist/tracking" className="block w-full text-center px-3 py-2 border rounded">
              Share Live Location
            </Link>
            <Link to="/tourist/id" className="block w-full text-center px-3 py-2 border rounded">
              View Digital ID
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-2">Plan a New Trip (Prototype)</h4>
          <button
            onClick={handleNewTrip}
            className="w-full text-center px-3 py-2 bg-green-600 text-white rounded"
          >
            Start New Trip
          </button>
        </div>
      </aside>
    </div>
  );
}
