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

async function getArticles(sourceName, searchQuery, page = 1, limit = 12) {
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

  const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM articles ${whereClause}`,
    params
  );
  const totalCount = countRows[0].total;

  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT id, title, description, url, source_name, image_url, published_at
     FROM articles ${whereClause}
     ORDER BY published_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    articles: rows,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
}

module.exports = { insertArticle, getArticles };
