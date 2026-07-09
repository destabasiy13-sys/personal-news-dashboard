import { useState, useEffect } from 'react';
import { API_URL } from '../config';

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/news`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="container mt-4">Loading news...</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Latest News</h1>

      {articles.length === 0 && <p>No articles available yet.</p>}

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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
