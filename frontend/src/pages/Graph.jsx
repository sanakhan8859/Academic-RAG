import React, { useState } from 'react'
import { egoGraph } from '../lib/api'
import GraphView from '../components/GraphView'

export default function Graph(){
  const [id, setId] = useState('')
  const [graph, setGraph] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await egoGraph({ id, radius: 1 })
      setGraph({ ...res.graph, center: id })
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="card" style={{display:'flex', gap:8}}>
        <input value={id} onChange={e=>setId(e.target.value)} placeholder="OpenAlex ID e.g. openalex:W123…" />
        <button className="primary" onClick={load}>Show Ego Graph</button>
      </div>
      {loading && <div className="card">Loading…</div>}
      {graph && <GraphView graph={graph} />}
    </div>
  )
}
