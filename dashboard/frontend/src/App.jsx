import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Overview from './pages/Overview'
import Metrics from './pages/Metrics'
import Funnel from './pages/Funnel'
import Heatmap from './pages/Heatmap'
import Anomalies from './pages/Anomalies'

function Nav() {
  return (
    <nav className="bg-white shadow">
      <div className="container py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-semibold">Purplle Dashboard</Link>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Overview</Link>
          <Link to="/metrics" className="text-sm text-gray-600 hover:text-gray-900">Metrics</Link>
          <Link to="/funnel" className="text-sm text-gray-600 hover:text-gray-900">Funnel</Link>
          <Link to="/heatmap" className="text-sm text-gray-600 hover:text-gray-900">Heatmap</Link>
          <Link to="/anomalies" className="text-sm text-gray-600 hover:text-gray-900">Anomalies</Link>
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <div>
      <Nav />
      <main className="container py-8">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/funnel" element={<Funnel />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/anomalies" element={<Anomalies />} />
        </Routes>
      </main>
    </div>
  )
}
