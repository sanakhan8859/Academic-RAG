import React from 'react'
export default function SearchBar({ value, onChange, onSubmit }){
  return (
    <div className="card">
      <form onSubmit={(e)=>{e.preventDefault(); onSubmit?.()}} style={{display:'flex', gap:8}}>
        <input value={value} onChange={e=>onChange(e.target.value)} placeholder="Ask a research question..." />
        <button className="primary" type="submit">Search</button>
      </form>
      <div className="small">Answers include inline citations and a key-papers list.</div>
    </div>
  )
}
