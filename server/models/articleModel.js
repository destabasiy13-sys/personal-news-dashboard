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

module.exports = { insertArticle };
