import React from 'react'
import { Link } from 'react-router-dom'


export default function TopNav(){
return (
    <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="font-bold text-xl">Smart Tourist Safety</Link>
            <nav className="space-x-4">
                <Link to="/tourist/login" className="text-sm">Tourist</Link>
                <Link to="/police/login" className="text-sm">Police</Link>
                <Link to="/admin/id-issue" className="text-sm">Admin</Link>
            </nav>
        </div>
    </header>
    )
}