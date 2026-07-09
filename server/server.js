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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://160.97.246.210:5173'],
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

fetchAndCacheNews();
cron.schedule('*/30 * * * *', fetchAndCacheNews);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
