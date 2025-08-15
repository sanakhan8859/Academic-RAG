import React, { useState } from 'react'
import Search from './pages/Search'
import Graph from './pages/Graph'
import Trends from './pages/Trends'
import Seminal from './pages/Seminal'

export default function App(){
  const [tab, setTab] = useState('search')
  return (
    <>
      <header>
        <h1>Academic RAG + Citation Network</h1>
        <nav style={{display:'flex', gap:8}}>
          {['search','graph','trends','seminal'].map(t => (
            <button key={t} className={tab===t?'badge primary':'badge'} onClick={()=>setTab(t)}>{t.toUpperCase()}</button>
          ))}
        </nav>
      </header>
      <div className="container">
        {tab==='search' && <Search/>}
        {tab==='graph' && <Graph/>}
        {tab==='trends' && <Trends/>}
        {tab==='seminal' && <Seminal/>}
      </div>
    </>
  )
}
