import { useState, useEffect } from 'react';
import { API_URL } from '../config';

function Stats() {
  const [bySource, setBySource] = useState([]);
  const [mostSaved, setMostSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/stats`)
      .then((res) => res.json())
      .then((data) => {
        setBySource(data.bySource);
        setMostSaved(data.mostSaved);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="container mt-4">Loading stats...</div>;
  }

  const maxCount = Math.max(...bySource.map((s) => s.count), 1);

  return (
    <div className="container mt-4">
      <h1>Dashboard Stats</h1>

      <h2 className="h4 mt-4">Articles Cached by Source</h2>
      {bySource.map((s) => (
        <div key={s.source_name} className="mb-2">
          <div className="d-flex justify-content-between">
            <span>{s.source_name}</span>
            <span className="text-muted">{s.count}</span>
          </div>
          <div className="progress" style={{ height: '8px' }}>
            <div
              className="progress-bar"
              style={{ width: `${(s.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}

      <h2 className="h4 mt-4">Most Saved Articles</h2>
      {mostSaved.length === 0 ? (
        <p>No articles have been saved by users yet.</p>
      ) : (
        <ol className="list-group list-group-numbered">
          {mostSaved.map((a) => (
            <li key={a.id} className="list-group-item d-flex justify-content-between align-items-start">
              <div>
                <div>{a.title}</div>
                <span className="badge bg-secondary">{a.source_name}</span>
              </div>
              <span className="badge bg-primary rounded-pill">
                {a.save_count} save{a.save_count === 1 ? '' : 's'}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Stats;
