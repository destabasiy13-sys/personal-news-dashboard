require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const sessionMiddleware = require('./config/session');
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const savedRoutes = require('./routes/savedRoutes');
const statsRoutes = require('./routes/statsRoutes');
const fetchAndCacheNews = require('./jobs/fetchNews');
const { initMailer } = require('./config/mailer');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(sessionMiddleware);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/stats', statsRoutes);

initMailer().then(() => {
  fetchAndCacheNews();
  cron.schedule('*/30 * * * *', fetchAndCacheNews);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
