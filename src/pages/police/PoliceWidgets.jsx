import React from 'react'


export function AlertTable(){
const alerts = [
{id: 'A-001', time: '2025-07-02 11:20', tourist: 'John Miller', status: 'Investigating'},
]
return (
    <div className="text-sm">
        <table className="w-full border">
            <thead className="text-left bg-slate-50"><tr><th className="p-2">ID</th><th className="p-2">Time</th><th className="p-2">Tourist</th><th className="p-2">Status</th></tr></thead>
            <tbody>
                {alerts.map(a=> (
                <tr key={a.id} className="border-t"><td className="p-2">{a.id}</td><td className="p-2">{a.time}</td><td className="p-2">{a.tourist}</td><td className="p-2">{a.status}</td></tr>
            ))}
            </tbody>
        </table>
    </div>
)
}