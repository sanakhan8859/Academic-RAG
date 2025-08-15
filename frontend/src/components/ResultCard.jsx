import React from 'react'
export default function ResultCard({ item }){
  const m = item.metadata || {}
  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <strong>{m.title || 'Untitled'}</strong>
        <span className="badge">{m.year || '—'}</span>
      </div>
      <div className="small">{(m.conceptsTop||[]).join(', ')}</div>
      <div style={{marginTop:8}} className="citation">{(item?.text || item?.document || '')?.slice(0, 280)}…</div>
    </div>
  )
}
