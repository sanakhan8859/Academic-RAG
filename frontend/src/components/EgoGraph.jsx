import React, { useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { egoGraph } from '../lib/api';

export default function EgoGraph({ paperId }) {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const fetchGraph = async () => {
      if (!paperId) return;
      try {
        const data = await egoGraph({ id: paperId, radius: 1 });
        setGraphData({
          nodes: data.graph.nodes.map(n => ({ id: n.id, label: n.title })),
          links: data.graph.edges.map(e => ({ source: e.source, target: e.target }))
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchGraph();
  }, [paperId]);

  return (
    <div style={{ height: '500px', border: '1px solid #ccc' }}>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="label"
        nodeAutoColorBy="id"
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
      />
    </div>
  );
}