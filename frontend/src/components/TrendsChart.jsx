// components/TrendsChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip } from 'chart.js';

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip);

export default function TrendsChart({ topics }) {
  // Use topics as simple counts per topic
  const labels = topics.map(t => t.topic);
  const datasets = [{
    label: 'Topic Counts',
    data: topics.map(t => t.count),
    backgroundColor: 'rgba(54, 162, 235, 0.5)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 2,
    tension: 0.2
  }];

  return (
    <div className="card p-4 border rounded shadow">
      <h3 style={{ marginTop: 0 }}>Trending Topics</h3>
      <Line data={{ labels, datasets }} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
    </div>
  );
}
