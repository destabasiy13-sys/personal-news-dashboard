const articleModel = require('../models/articleModel');

async function getNews(req, res) {
  const { source } = req.query;
  const articles = await articleModel.getArticles(source);
  res.json(articles);
}

module.exports = { getNews };
