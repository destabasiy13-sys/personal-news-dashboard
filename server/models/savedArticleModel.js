const pool = require('../config/db');

async function saveArticle(userId, articleId) {
  const [result] = await pool.query(
    'INSERT IGNORE INTO saved_articles (user_id, article_id) VALUES (?, ?)',
    [userId, articleId]
  );
  return result.affectedRows > 0;
}

async function unsaveArticle(userId, articleId) {
  await pool.query(
    'DELETE FROM saved_articles WHERE user_id = ? AND article_id = ?',
    [userId, articleId]
  );
}

async function getSavedArticleIds(userId) {
  const [rows] = await pool.query(
    'SELECT article_id FROM saved_articles WHERE user_id = ?',
    [userId]
  );
  return rows.map((row) => row.article_id);
}

async function getSavedArticles(userId) {
  const [rows] = await pool.query(
    `SELECT a.id, a.title, a.description, a.url, a.source_name, a.image_url, a.published_at
     FROM saved_articles sa
     JOIN articles a ON sa.article_id = a.id
     WHERE sa.user_id = ?
     ORDER BY sa.saved_at DESC`,
    [userId]
  );
  return rows;
}

module.exports = { saveArticle, unsaveArticle, getSavedArticleIds, getSavedArticles };
