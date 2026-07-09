const savedArticleModel = require('../models/savedArticleModel');

async function saveArticle(req, res) {
  const articleId = req.params.articleId;
  await savedArticleModel.saveArticle(req.session.userId, articleId);
  res.status(201).json({ message: 'Article saved.' });
}

async function unsaveArticle(req, res) {
  const articleId = req.params.articleId;
  await savedArticleModel.unsaveArticle(req.session.userId, articleId);
  res.json({ message: 'Article removed from saved list.' });
}

async function getSavedIds(req, res) {
  const ids = await savedArticleModel.getSavedArticleIds(req.session.userId);
  res.json(ids);
}

module.exports = { saveArticle, unsaveArticle, getSavedIds };
