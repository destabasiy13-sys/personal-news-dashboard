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

module.exports = { saveArticle, unsaveArticle, getSavedArticleIds };
