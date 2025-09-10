import React from 'react';
import { tourists } from '../../data/mockdata';
import MapPlaceholder from '../../shared/MapPlaceHolder'

export default function TrackingPage(){
const t = tourists[0]
return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">Live Tracking (Opt-in)</h4>
            <MapPlaceholder center={t.lastLocation} markers={[t.lastLocation]} />
        </div>
        <aside className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold">Shared With</h4>
                <ul className="mt-2 text-sm space-y-2">
                    <li>Family Member: +91 90000 00001</li>
                    <li>Local Police Unit: Kaziranga PS</li>
                </ul>
                <div className="mt-4 text-xs text-slate-500">Opt-in only. Prototype demo shows mock live location.</div>
            </aside>
        </div>
    )
}
