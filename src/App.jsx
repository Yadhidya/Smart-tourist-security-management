import Landing from "./pages/LandingPage"
import TopNav from "./components/TopNav"
import TouristDashboard from "./pages/tourist/touristDashboard"
import TouristID from "./pages/tourist/TouristID"
import TrackingPage from "./pages/tourist/touristTrackingPage"
import { Route, Routes } from "react-router-dom"

function App() {  

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/tourist/dashboard" element={<TouristDashboard/>} />
          <Route path="/tourist/id" element={<TouristID/>} />
          <Route path="/tourist/tracking" element={<TrackingPage/>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
