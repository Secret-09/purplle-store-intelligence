import React, { useEffect, useState } from 'react'
import { getStoreMetrics } from '../api/client'

export default function Overview() {
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    getStoreMetrics().then(setMetrics).catch(() => setMetrics(null))
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Overview</h2>
      {!metrics && <div>Loading metrics...</div>}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Unique visitors</div>
            <div className="text-2xl font-bold">{metrics.unique_visitors}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Conversion rate</div>
            <div className="text-2xl font-bold">{metrics.conversion_rate}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Average dwell (ms)</div>
            <div className="text-2xl font-bold">{metrics.average_dwell_ms}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Queue depth</div>
            <div className="text-2xl font-bold">{metrics.queue_depth}</div>
          </div>
        </div>
      )}
    </div>
  )
}
