import React, { useEffect, useState } from 'react'
import { getStoreMetrics } from '../api/client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Metrics() {
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    getStoreMetrics().then(setMetrics).catch(() => setMetrics(null))
  }, [])

  // mock time series using single metric values (backend doesn't currently provide time series)
  const series = metrics ? [
    { name: 'Now', visitors: metrics.unique_visitors, dwell: metrics.average_dwell_ms },
  ] : []

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Metrics</h2>
      {!metrics && <div>Loading...</div>}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Visitors (sample)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={series}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visitors" stroke="#4F46E5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Average dwell (ms)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={series}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="dwell" stroke="#10B981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
