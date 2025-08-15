import React, { useState } from 'react'
import SearchBar from '../components/SearchBar'
import { search } from '../lib/api'
import ResultCard from '../components/ResultCard'
import CitationList from '../components/CitationList'

export default function Search() {
  const [q, setQ] = useState('How do transformers handle clinical abbreviations?')
  const [answer, setAnswer] = useState('')
  const [contexts, setContexts] = useState([])
  const [cites, setCites] = useState([])
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      console.log("Query:", q)
      
      const res = await search({
        query: q,
        contexts: [],   // optionally pre-populate with prior contexts
        citations: []   // optionally pre-populate citations
      })

      console.log("Search response:", res)

      setAnswer(res.answer)
      setContexts(res.contexts || [])
      setCites(res.citations || [])
    } catch (err) {
      console.error("Search error:", err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <SearchBar value={q} onChange={setQ} onSubmit={submit} />
      {loading && <div className="card">Loading…</div>}
      {answer && (
        <div className="card">
          <div dangerouslySetInnerHTML={{ __html: answer.replace(/\n/g,'<br/>') }} />
        </div>
      )}
      <div className="row">
        <div className="col">
          {contexts?.map((c,i) => <ResultCard key={i} item={c} />)}
        </div>
        <div className="col">
          <CitationList items={cites} />
        </div>
      </div>
    </div>
  )
}