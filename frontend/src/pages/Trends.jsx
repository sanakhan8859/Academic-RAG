// pages/Trends.jsx
import React, { useEffect, useState } from 'react';
import TrendsChart from '../components/TrendsChart';
import { getTrends } from '../lib/api';

export default function TrendsPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    getTrends().then(res => {
      setTopics(res.topics || []);
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[])

  if(loading) return <div className="card">Loading trends…</div>
  if(!topics.length) return <div className="card">No trends data available</div>

  return <TrendsChart topics={topics} />
}