import { useState , useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup,Circle } from "react-leaflet";
import { useLiveLocation } from "../hooks/useLiveLocation";
import SafetyCard from '../../shared/SafetyCard'
import { riskZones } from '../../data/riskZones'
import { tourists } from '../../data/mockdata';
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { touristPath } from '../../data/tousirstPath';

const t = tourists[0]


export default function TouristDashboard(){
    const [location, setLocation] = useState(touristPath[0]);
  const [alert, setAlert] = useState(null);
  const [nearest, setNearest] = useState(null);
  const [index, setIndex] = useState(0);

  // Simulate movement every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        const nextIndex = (prev + 1) % touristPath.length;
        setLocation(touristPath[nextIndex]);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Check alerts + nearest zone
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

return (
     <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Map Section */}
      <div className="md:col-span-2 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Current Location</h3>

        {location ? (
          <MapContainer
            center={location}
            zoom={15}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
        ) : (
          <p>Fetching location...</p>
        )}

        {alert && (
          <div className="mt-4 p-3 border rounded bg-red-100 text-red-800 font-semibold">
            {alert}
          </div>
        )}
      </div>


    <aside className="bg-white p-4 rounded shadow">
        <SafetyCard name={t.name} score={t.safetyScore} />

        <div className="mt-4">
            <h4 className="font-semibold mb-2">Quick Actions</h4>
            <div className="space-y-2">
                <Link to="/tourist/panic" className="block w-full text-center px-3 py-2 bg-red-600 text-white rounded">Panic Button</Link>
                <Link to="/tourist/tracking" className="block w-full text-center px-3 py-2 border rounded">Share Live Location</Link>
                <Link to="/tourist/id" className="block w-full text-center px-3 py-2 border rounded">View Digital ID</Link>
            </div>
        </div>
    </aside>
    </div>
    )
}

function getDistance(loc, zone) {
  const R = 6371e3; // radius of Earth in meters
  const φ1 = (loc.lat * Math.PI) / 180;
  const φ2 = (zone.lat * Math.PI) / 180;
  const Δφ = ((zone.lat - loc.lat) * Math.PI) / 180;
  const Δλ = ((zone.lng - loc.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestZone(location, zones) {
  if (!location) return null;
  let nearest = null;
  let minDist = Infinity;

  zones.forEach((zone) => {
    const dist = getDistance(location, zone);
    if (dist < minDist) {
      minDist = dist;
      nearest = { ...zone, distance: dist };
    }
  });

  return nearest;
}