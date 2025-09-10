import React from 'react'
import { tourists } from '../../data/mockdata'


export default function TouristID(){
const t = tourists[0]
return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold">Digital Tourist ID</h3>
        <div className="mt-4 border rounded p-4 flex gap-4 items-center">
            <div className="w-32 h-32 bg-slate-100 rounded flex items-center justify-center">Photo</div>
                <div>
                    <div className="font-semibold text-lg">{t.name}</div>
                    <div className="text-sm text-slate-600">ID: {t.id}</div>
                    <div className="mt-2 text-sm">Itinerary: {t.itinerary}</div>
                    <div className="mt-1 text-sm">Emergency: +91 90000 00000</div>
                    <div className="mt-2 text-xs text-slate-500">Valid: 01 Jul 2025 — 10 Jul 2025</div>
                </div>  
            </div>    
        <div className="mt-4 text-sm text-slate-700">Note: In the real system this ID would be minted on a blockchain and be time-bound to the visit duration.</div>
    </div>
    )
}