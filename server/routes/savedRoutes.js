const express = require('express');
const router = express.Router();
const savedController = require('../controllers/savedController');
const requireAuth = require('../middleware/requireAuth');

router.get('/ids', requireAuth, savedController.getSavedIds);
router.post('/:articleId', requireAuth, savedController.saveArticle);
router.delete('/:articleId', requireAuth, savedController.unsaveArticle);

module.exports = router;
