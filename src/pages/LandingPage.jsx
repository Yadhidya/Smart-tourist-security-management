import React from 'react'
import { Link } from 'react-router-dom'


export default function Landing(){
return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-semibold mb-3">Smart Tourist Safety Monitoring & Incident Response</h1>
        <p className="mb-6">AI + Blockchain + Geo-fencing to protect tourists and speed up incident response. This is a static prototype (dummy data) demonstrating the UX and flow.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded">
                <h3 className="font-semibold">Tourist App</h3>
                <p className="text-sm">Safety score, geo-fence alerts, panic button, digital ID.</p>
                <Link to="/tourist/login" className="inline-block mt-3 text-indigo-600">Open Tourist App →</Link>
        </div>


        <div className="p-4 border rounded">
            <h3 className="font-semibold">Police Dashboard</h3>
                <p className="text-sm">Heatmaps, clusters, alert history, e-FIR mock.</p>
                <Link to="/police/login" className="inline-block mt-3 text-indigo-600">Open Police Portal →</Link>
        </div>


        <div className ="p-4 border rounded">
            <h3 className="font-semibold">Admin / ID Issuance</h3>
            <p className="text-sm">Issue time-bound digital IDs, view records.</p>
            <Link to="/admin/id-issue" className="inline-block mt-3 text-indigo-600">Open Admin →</Link>
        </div>
    </div>


    <section className="mt-8">
    <h2 className="text-xl font-semibold mb-2">Prototype Notes</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
        <li>All data is static & mock — no backend.</li>
        <li>Maps show dummy markers. Replace with real APIs later.</li>
        <li>Charts use Recharts with mock data.</li>
        <li>Use this to demo UX, flows, and stakeholder value.</li>
        </ul>
    </section>
    </div>
    )
}