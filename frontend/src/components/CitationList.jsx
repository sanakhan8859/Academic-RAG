import React from 'react'
export default function CitationList({ items }){
  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Citations</h3>
      {items?.map((c,i)=> (
        <div key={i} className="citation">
          [{i+1}] {c.title} ({c.year}) — <a href={c.url || '#'} target="_blank">{c.url || c.doi || c.openalexId}</a>
        </div>
      ))}
    </div>
  )
}
