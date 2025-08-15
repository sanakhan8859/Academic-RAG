// components/TrendsChart.jsx
import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip } from 'chart.js'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip)

export default function TrendsChart({ topics }){
  const labels = Array.from(
    new Set(topics.flatMap(t => Object.keys(t.yearly).map(Number)))
  ).sort((a,b)=>a-b)

  const datasets = topics.slice(0,5).map((t)=>({
    label: `Topic ${t.cluster} (${t.trend})`,
    data: labels.map(y=>t.yearly[y]||0),
    tension: 0.2
  }))

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Topic Trends</h3>
      <Line data={{ labels, datasets }} options={{ responsive:true, plugins:{ legend:{ position:'bottom' }}}} />
    </div>
  )
}