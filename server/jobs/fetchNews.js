const articleModel = require('../models/articleModel');

const SOURCES = 'bbc-news,al-jazeera-english,associated-press,independent,the-times-of-india';

async function fetchAndCacheNews() {
  // pageSize=100 is the max allowed on the free tier — without it NewsAPI
  // defaults to 20 total results across all 5 sources combined, which can
  // cut off sources later in the list entirely
  const url = `https://newsapi.org/v2/top-headlines?sources=${SOURCES}&pageSize=100&apiKey=${process.env.NEWS_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'ok') {
    console.error('NewsAPI error:', data.message);
    return { received: 0, saved: 0, error: data.message };
  }

  let savedCount = 0;
  for (const item of data.articles) {
    // NewsAPI marks articles pulled by a source as "[Removed]" instead of leaving them out
    if (item.title === '[Removed]' || !item.url) continue;

    const saved = await articleModel.insertArticle({
      title: item.title,
      description: item.description,
      url: item.url,
      source_name: item.source.name,
      image_url: item.urlToImage,
      published_at: item.publishedAt ? new Date(item.publishedAt) : null,
    });
    if (saved) savedCount++;
  }

  console.log(`News fetch complete: ${data.articles.length} received, ${savedCount} new articles saved.`);
  return { received: data.articles.length, saved: savedCount };
}

module.exports = fetchAndCacheNews;
