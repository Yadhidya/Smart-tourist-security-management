import React, { useState, useEffect } from 'react';
import MapPlaceholder from '../../shared/MapPlaceHolder';
import { tourists as mockTourists } from '../../data/mockdata';
import { AlertTable } from './PoliceWidgets';
import { touristPath } from '../../data/tousirstPath';

export default function PoliceDashboard() {
  const center = { lat: 26.0, lng: 92.0 };

  const [tourists, setTourists] = useState(
    mockTourists.map(t => ({
      ...t,
      lastSeenAccessible: t.currentlyAccessible ? Date.now() : null,
      lastUpdate: Date.now(),
      status: 'active', // active, inactive, alert
    }))
  );

  const [criticalAlerts, setCriticalAlerts] = useState([]);

  useEffect(() => {
    const DROP_THRESHOLD = 2 * 60 * 1000; // 2 minutes
    const INACTIVITY_THRESHOLD = 5 * 60 * 1000; // 5 minutes
    const ROUTE_THRESHOLD = 0.05; // km (50 meters)

    const interval = setInterval(() => {
      const now = Date.now();
      const newAlerts = [];

      setTourists(prevTourists =>
        prevTourists.map(t => {
          // --- Simulate tourist movement ---
          const newSpeed = Math.random() * 2; // 0 to 2 m/s
          const newLocation = {
            lat: t.lastLocation.lat + (Math.random() - 0.5) * 0.001,
            lng: t.lastLocation.lng + (Math.random() - 0.5) * 0.001,
          };

          // --- Simulate accessibility ---
          const newCurrentlyAccessible = Math.random() > 0.05; // 5% chance lost

          const lastSeenAccessible = newCurrentlyAccessible
            ? now
            : t.lastSeenAccessible || t.lastUpdate;

          let status = 'active'; // default marker status

          // --- Sudden location drop-off ---
          if (!newCurrentlyAccessible && t.lastSeenAccessible && (now - lastSeenAccessible <= DROP_THRESHOLD)) {
            newAlerts.push({
              id: t.id + '-drop',
              tourist: t.name,
              zone: 'Unknown / Lost',
              severity: 'High',
              anomaly: 'Sudden Location Drop-off',
              timestamp: new Date().toLocaleTimeString(),
            });
            status = 'alert';
          }

          // --- Prolonged inactivity ---
          const timeSinceLastUpdate = now - t.lastUpdate;
          if (newSpeed <= 0.01 && timeSinceLastUpdate >= INACTIVITY_THRESHOLD) {
            newAlerts.push({
              id: t.id + '-inactive',
              tourist: t.name,
              zone: 'Current Location',
              severity: 'Medium',
              anomaly: 'Prolonged Inactivity',
              timestamp: new Date().toLocaleTimeString(),
            });
            if (status !== 'alert') status = 'inactive'; // mark as yellow if not already red
          }

          // --- Route deviation ---
          const path = touristPath[t.id];
          if (path && path.length > 0) {
            const distanceFromRoute = getMinDistanceFromPath(newLocation, path); // in km
            if (distanceFromRoute > ROUTE_THRESHOLD) {
              newAlerts.push({
                id: t.id + '-deviation',
                tourist: t.name,
                zone: 'Off-route',
                severity: 'Medium',
                anomaly: 'Route Deviation',
                timestamp: new Date().toLocaleTimeString(),
              });
              status = 'alert';
            }
          }

          return {
            ...t,
            lastLocation: newLocation,
            speed: newSpeed,
            currentlyAccessible: newCurrentlyAccessible,
            lastSeenAccessible,
            lastUpdate: now,
            status,
          };
        })
      );

      setCriticalAlerts(newAlerts);
    }, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // --- Prepare markers for MapPlaceholder ---
  const markers = tourists.map(t => ({
    lat: t.lastLocation.lat,
    lng: t.lastLocation.lng,
    status: t.status, // active / inactive / alert
  }));

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Tourist Clusters & Heatmap</h3>
        <MapPlaceholder center={center} markers={markers} />

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Quick Stats</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 border rounded">
              Active Tourists
              <div className="font-bold">{tourists.filter(t => t.currentlyAccessible).length}</div>
            </div>
            <div className="p-3 border rounded">
              Alerts Today
              <div className="font-bold">{criticalAlerts.length}</div>
            </div>
            <div className="p-3 border rounded">
              e-FIRs
              <div className="font-bold">0</div>
            </div>
          </div>
        </div>
      </div>

      <aside className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-2">Alert History</h4>
        <AlertTable />

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Critical Alerts (Police)</h4>
          {criticalAlerts.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {criticalAlerts.map(a => (
                <div key={a.id} className="p-2 border rounded bg-red-100 text-red-800">
                  <p>
                    🚨 <strong>{a.tourist}</strong> - {a.anomaly}
                  </p>
                  <p>
                    {a.severity} | {a.timestamp} | {a.zone}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No critical police alerts yet.</p>
          )}
        </div>
      </aside>
    </div>
  );
}

// --- Utility functions ---
function getDistance(loc, zone) {
  const R = 6371e3; // meters
  const φ1 = (loc.lat * Math.PI) / 180;
  const φ2 = (zone.lat * Math.PI) / 180;
  const Δφ = ((zone.lat - loc.lat) * Math.PI) / 180;
  const Δλ = ((zone.lng - loc.lng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in meters
}

function getMinDistanceFromPath(loc, path) {
  if (!path || path.length === 0) return 0;
  return Math.min(...path.map(p => getDistance(loc, p) / 1000)); // in km
}
