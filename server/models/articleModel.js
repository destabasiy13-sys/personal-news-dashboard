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

async function getArticles(sourceName, searchQuery) {
  let query = 'SELECT id, title, description, url, source_name, image_url, published_at FROM articles';
  const conditions = [];
  const params = [];

  if (sourceName) {
    conditions.push('source_name = ?');
    params.push(sourceName);
  }

  if (searchQuery) {
    conditions.push('(title LIKE ? OR description LIKE ?)');
    const likeValue = `%${searchQuery}%`;
    params.push(likeValue, likeValue);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY published_at DESC LIMIT 50';

  const [rows] = await pool.query(query, params);
  return rows;
}

module.exports = { insertArticle, getArticles };
