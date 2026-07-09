const pool = require('../config/db');

async function insertArticle(article) {
  const [result] = await pool.query(
    `INSERT IGNORE INTO articles (title, description, url, source_name, image_url, published_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      article.title,
      article.description,
      article.url,
      article.source_name,
      article.image_url,
      article.published_at,
    ]
  );
  return result.affectedRows > 0;
}

async function getArticles(sourceName) {
  let query = 'SELECT id, title, description, url, source_name, image_url, published_at FROM articles';
  const params = [];

  if (sourceName) {
    query += ' WHERE source_name = ?';
    params.push(sourceName);
  }

  query += ' ORDER BY published_at DESC LIMIT 50';

  const [rows] = await pool.query(query, params);
  return rows;
}

module.exports = { insertArticle, getArticles };
