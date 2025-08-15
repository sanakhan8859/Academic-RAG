import React from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
export default function GraphView({ graph }){
  const elements = [
    ...graph.nodes.map(n=>({ data: { id: n.id, label: n.title }, classes: (n.id===graph.center?'center':'') })),
    ...graph.edges.map(e=>({ data: { source: e.source, target: e.target } }))
  ]
  return (
    <div className="card">
      <CytoscapeComponent elements={elements}
        style={{ width: '100%', height: '600px' }}
        layout={{ name: 'cose' }}
        stylesheet={[{ selector:'node', style:{ 'background-color':'#6ea8fe', 'label':'data(label)', 'font-size':'10px' } },
                     { selector:'.center', style:{ 'background-color':'#ffd166', 'border-width':2, 'border-color':'#fff' } },
                     { selector:'edge', style:{ 'line-color':'#7a86c2', 'target-arrow-shape':'triangle', 'target-arrow-color':'#7a86c2' } }]} />
    </div>
  )
}
