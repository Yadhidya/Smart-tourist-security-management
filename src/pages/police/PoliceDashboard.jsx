import React from 'react'
import MapPlaceholder from '../../shared/MapPlaceHolder'
import { tourists } from '../../data/mockdata'
import { AlertTable } from './PoliceWidgets'
import { useEffect, useState } from 'react'
import { riskZones } from '../../data/riskZones'
import { touristPath } from '../../data/tousirstPath'


export default function PoliceDashboard(){
    const center = { lat: 26.0, lng: 92.0 }
  // store police alerts (critical only)
    const [criticalAlerts, setCriticalAlerts] = useState([])

    useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      const loc = touristPath[i % touristPath.length]

      riskZones.forEach((zone) => {
        const dist = getDistance(loc, zone)

        // police alert if inside 700m (stronger if inside 500m)
        if (dist <= 700) {
          setCriticalAlerts((prev) => [
            ...prev,
            {
              id: `${Date.now()}-${Math.random()}`,
              tourist: 'Tourist A',
              zone: zone.name,
              severity: dist <= 500 ? 'Critical (≤500m)' : 'Critical (≤700m)',
              timestamp: new Date().toLocaleTimeString(),
            },
          ])
        }
      })
      i++
    }, 3000)

    return () => clearInterval(interval)
  }, [])

return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Tourist Clusters & Heatmap</h3>
                <MapPlaceholder center={center} markers={tourists.map(t=>t.lastLocation)} />

                <div className="mt-4">
                    <h4 className="font-semibold mb-2">Quick Stats</h4>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 border rounded">Active Tourists <div className="font-bold">2</div></div>
                        <div className="p-3 border rounded">Alerts Today <div className="font-bold">1</div></div>
                        <div className="p-3 border rounded">e-FIRs <div className="font-bold">0</div></div>
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
              {criticalAlerts.map((a) => (
                <div
                     key={a.id} // now guaranteed unique
                        className="p-2 border rounded bg-red-100 text-red-800"
                >
                <p>
                  🚨 <strong>{a.tourist}</strong> entered {a.zone}
                </p>
                <p>{a.severity} | {a.timestamp}</p>
              </div>
            ))}
            </div>
          ) : (
            <p>No critical police alerts yet.</p>
          )}
        </div>
        </aside>
</div>
    )
}

function getDistance(loc, zone) {
  const R = 6371e3 // radius of Earth in meters
  const φ1 = (loc.lat * Math.PI) / 180
  const φ2 = (zone.lat * Math.PI) / 180
  const Δφ = ((zone.lat - loc.lat) * Math.PI) / 180
  const Δλ = ((zone.lng - loc.lng) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}