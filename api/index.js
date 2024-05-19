const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

const app = express();
const port = 3000;

app.use(express.json());

async function scrapeWallpapersFromUrl(url) {
  const base_url = "https://wallpapers.com";

  axios.get(url)
    .then(response => {
      const data = [];

      if (response.status === 200) {
        const $ = cheerio.load(response.data);
        const picture_tags = $('picture').slice(2);

        picture_tags.each((index, element) => {
          const source_tag = $(element).find('source').first();
          const img_tag = $(element).find('img').first();

          const thumbnail_url = source_tag.attr('data-srcset');
          const img_url = img_tag.attr('data-src');
          const alt = img_tag.attr('alt');

          if (thumbnail_url && img_url && !img_url.endsWith('.svg')) {
            const imgUrl = new URL(img_url, base_url).href;
            const thumbnailUrl = new URL(thumbnail_url, base_url).href;

            data.push({
              caption: alt || '',
              image_url: imgUrl,
              thumbnail_url: thumbnailUrl
            });
          }
        });
      }

      return data;
    })
    .catch(error => {
      throw new Error(`Error scraping wallpapers: ${error.message}`);
    });
}

async function scrapeWallpapers(searchTerm, page = 1) {
  const url = `https://wallpapers.com/search/${searchTerm}?p=${page}`;
  return await scrapeWallpapersFromUrl(url);
}

app.post('/api/search', async (req, res) => {
  const { query } = req.query;
  const { search_term, page } = req.body;

  const searchTerm = query || search_term;
  const pageNumber = page || req.query.page || 1;

  if (!searchTerm) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const wallpapers_data = await scrapeWallpapers(searchTerm, pageNumber);
    res.json(wallpapers_data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/home', async (req, res) => {
  const url = "https://wallpapers.com/4k";

  try {
    const wallpapers_data = await scrapeWallpapersFromUrl(url);
    res.json(wallpapers_data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
