// pages/Trends.jsx
import React, { useEffect, useState } from 'react';
import TrendsChart from '../components/TrendsChart';
import { getTrends } from '../lib/api';

export default function TrendsPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrends()
      .then(res => {
        setTopics(res.topics || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="card p-4">Loading trends…</div>;
  if (!topics.length) return <div className="card p-4">No trends data available</div>;

  return (
    <div className="p-4">
      <TrendsChart topics={topics} />

      <h2 className="mt-8 text-xl font-bold">Topic Counts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {topics.map((topic, idx) => (
          <div key={idx} className="card p-4 border rounded shadow">
            <h3 className="font-semibold">{topic.topic}</h3>
            <p>Count: {topic.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
