import React, { useEffect, useState } from 'react'
import { getSeminal } from '../lib/api'
import ScoreBadge from '../components/ScoreBadge'

export default function Seminal(){
  const [items, setItems] = useState([])
  useEffect(()=>{ (async()=>{
    const res = await getSeminal({ limit: 20 })
    setItems(res.items || [])
  })() },[])
  return (
    <div className="row">
      {items.map(p => (
        <div className="card col" key={p._id}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <strong>{p.title}</strong>
            <ScoreBadge value={p.seminalScore} />
          </div>
          <div className="small">{p.year} · {(p.concepts||[]).filter(c=>c.level===0).map(c=>c.name).join(', ')}</div>
          <div style={{marginTop:8}} className="citation">{(p.abstract||'').slice(0, 240)}…</div>
          {p.url && <a className="badge" href={p.url} target="_blank">Open</a>}
        </div>
      ))}
    </div>
  )
}
