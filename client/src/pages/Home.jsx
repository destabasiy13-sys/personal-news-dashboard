import { useState, useEffect } from 'react';
import { API_URL } from '../config';

const SOURCES = [
  'BBC News',
  'Al Jazeera English',
  'Associated Press',
  'Independent',
  'The Times of India',
];

function Home({ user }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [savedIds, setSavedIds] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');
  const [refreshMessageType, setRefreshMessageType] = useState('info');

  function loadArticles() {
    setLoading(true);
    const params = new URLSearchParams();
    if (source) params.set('source', source);
    if (search) params.set('q', search);
    params.set('page', page);

    return fetch(`${API_URL}/api/news?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles);
        setTotalPages(data.totalPages);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadArticles();
  }, [source, search, page]);

  function handleSourceChange(e) {
    setSource(e.target.value);
    setPage(1);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  async function handleRefresh() {
    setRefreshing(true);
    setRefreshMessage('');

    const res = await fetch(`${API_URL}/api/news/refresh`, { method: 'POST' });
    const data = await res.json();

    if (!res.ok) {
      setRefreshMessageType('warning');
      setRefreshMessage(data.error);
    } else {
      setRefreshMessageType('success');
      setRefreshMessage(`Refreshed — ${data.saved} new article(s) found.`);
      await loadArticles();
    }
    setRefreshing(false);
  }

  useEffect(() => {
    if (!user) {
      setSavedIds(new Set());
      return;
    }
    fetch(`${API_URL}/api/saved/ids`, { credentials: 'include' })
      .then((res) => res.json())
      .then((ids) => setSavedIds(new Set(ids)));
  }, [user]);

  async function toggleSave(articleId) {
    if (savedIds.has(articleId)) {
      await fetch(`${API_URL}/api/saved/${articleId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(articleId);
        return next;
      });
    } else {
      await fetch(`${API_URL}/api/saved/${articleId}`, {
        method: 'POST',
        credentials: 'include',
      });
      setSavedIds((prev) => new Set(prev).add(articleId));
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h1>Latest News</h1>
        <div className="d-flex flex-wrap gap-2">
          <form className="d-flex" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="form-control"
              placeholder="Search articles..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ minWidth: '140px' }}
            />
            <button type="submit" className="btn btn-outline-primary ms-2">
              Search
            </button>
          </form>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={source}
            onChange={handleSourceChange}
          >
            <option value="">All Sources</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            className="btn btn-outline-success"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>
      </div>

      {refreshMessage && (
        <div className={`alert alert-${refreshMessageType} py-2`}>{refreshMessage}</div>
      )}

      {loading && <p>Loading news...</p>}
      {!loading && articles.length === 0 && <p>No articles available yet.</p>}

      <div className="row">
        {articles.map((article) => (
          <div className="col-md-4 mb-4" key={article.id}>
            <div className="card h-100">
              {article.image_url && (
                <img src={article.image_url} className="card-img-top" alt="" />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{article.title}</h5>
                {article.description && (
                  <p className="card-text">{article.description}</p>
                )}
                <div className="mt-auto">
                  <span className="badge bg-secondary me-2">{article.source_name}</span>
                  <small className="text-muted">
                    {new Date(article.published_at).toLocaleDateString()}
                  </small>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm mt-2 d-block"
                  >
                    Read more
                  </a>
                  {user && (
                    <button
                      className={`btn btn-sm mt-2 d-block ${
                        savedIds.has(article.id) ? 'btn-warning' : 'btn-outline-secondary'
                      }`}
                      onClick={() => toggleSave(article.id)}
                    >
                      {savedIds.has(article.id) ? 'Saved' : 'Save'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
          <button
            className="btn btn-outline-primary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            className="btn btn-outline-primary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
