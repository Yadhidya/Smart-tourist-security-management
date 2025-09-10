import React from "react";


export default function SafetyCard({ name, score }){
let badge = score > 80 ? 'bg-green-100 text-green-800' : score > 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
return (
    <div className="p-3 border rounded">
        <div className="flex items-center justify-between">
            <div>
                <div className="font-semibold">{name}</div>
                <div className="text-sm text-slate-600">Tourist</div>
            </div>
            <div className={`px-3 py-1 rounded ${badge}`}>{score} Score</div>
        </div>
        <div className="mt-3 text-sm text-slate-700">Auto-assigned safety score based on travel patterns and area sensitivity (prototype).</div>
    </div>
    )
}