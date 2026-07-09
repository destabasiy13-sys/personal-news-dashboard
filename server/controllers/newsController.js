const articleModel = require('../models/articleModel');

async function getNews(req, res) {
  const { source, q } = req.query;
  const articles = await articleModel.getArticles(source, q);
  res.json(articles);
}

module.exports = { getNews };
