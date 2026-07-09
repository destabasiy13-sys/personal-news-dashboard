const articleModel = require('../models/articleModel');
const savedArticleModel = require('../models/savedArticleModel');

async function getStats(req, res) {
  const bySource = await articleModel.getSourceCounts();
  const mostSaved = await savedArticleModel.getMostSaved();
  res.json({ bySource, mostSaved });
}

module.exports = { getStats };
