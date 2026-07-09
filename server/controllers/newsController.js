const articleModel = require('../models/articleModel');
const fetchAndCacheNews = require('../jobs/fetchNews');

const REFRESH_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

// Tracks the last manual refresh attempt in memory, not the database.
// MAX(fetched_at) on the articles table only changes when a NEW article is
// inserted - since NewsAPI's free tier often returns nothing new (see the
// ~24h delay we diagnosed), that column can go stale for hours, which would
// silently defeat this cooldown if we used it as the source of truth.
let lastRefreshAttempt = 0;

async function getNews(req, res) {
  const { source, q } = req.query;
  const articles = await articleModel.getArticles(source, q);
  res.json(articles);
}

async function refreshNews(req, res) {
  const msSinceLastAttempt = Date.now() - lastRefreshAttempt;

  if (msSinceLastAttempt < REFRESH_COOLDOWN_MS) {
    const secondsLeft = Math.ceil((REFRESH_COOLDOWN_MS - msSinceLastAttempt) / 1000);
    return res.status(429).json({
      error: `Please wait ${secondsLeft} seconds before refreshing again.`,
    });
  }

  lastRefreshAttempt = Date.now();
  const result = await fetchAndCacheNews();
  res.json({ message: 'News refreshed.', ...result });
}

module.exports = { getNews, refreshNews };
