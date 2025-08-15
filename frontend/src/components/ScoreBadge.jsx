import React from 'react'
export default function ScoreBadge({ value }){
  const v = (value||0)
  return <span className="badge">Seminal: {v.toFixed(3)}</span>
}
