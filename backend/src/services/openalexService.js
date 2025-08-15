import axios from 'axios';
const BASE = 'https://api.openalex.org/works';

function invertIndexToText(inv) {
  if (!inv) return '';
  const positions = [];
  for (const [word, poses] of Object.entries(inv)) {
    for (const pos of poses) positions.push([pos, word]);
  }
  positions.sort((a,b)=>a[0]-b[0]);
  return positions.map(([,w])=>w).join(' ');
}

export async function fetchOpenAlex({ query, perPage = 200, maxPages = 2 }) {
  const out = [];
  for (let page = 1; page <= maxPages; page++) {
    const params = {
      search: query,
      per_page: perPage,
      page,
      filter: 'type:journal-article,is_paratext:false,has_abstract:true,from_publication_date:2018-01-01',
      sort: 'cited_by_count:desc'
    };
    const { data } = await axios.get(BASE, { params, timeout: 60000 });
    for (const w of data.results) {
      out.push({
        openalexId: w.id,
        title: w.title,
        abstract: invertIndexToText(w.abstract_inverted_index),
        year: w.publication_year || null,
        authors: (w.authorships||[]).map(a=>a.author.display_name),
        venue: w.host_venue?.display_name,
        concepts: (w.concepts||[]).map(c=>({ name: c.display_name, level: c.level })),
        references: w.referenced_works || [],
        cited_by_count: w.cited_by_count || 0,
        doi: w.doi || null,
        url: w.primary_location?.source?.host_page_url || w.primary_location?.landing_page_url || null
      });
    }
    await new Promise(r=>setTimeout(r, 500));
  }
  return out;
}
