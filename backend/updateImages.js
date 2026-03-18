const google = require('googlethis');
const db = require('./db');

async function updateImages() {
  try {
    const [foods] = await db.query('SELECT id, name FROM foods');
    console.log(`Found ${foods.length} foods. Fetching images...`);

    for (const food of foods) {
      try {
        const query = `Kenyan food ${food.name} high quality`;
        const images = await google.image(query, { safe: false });
        
        if (images && images.length > 0) {
          // Use the first valid looking image
          const imageUrl = images[0].url;
          console.log(`[${food.id}] ${food.name} -> ${imageUrl}`);
          
          await db.execute('UPDATE foods SET image_url = ? WHERE id = ?', [imageUrl, food.id]);
        } else {
          console.log(`[${food.id}] ${food.name} -> No image found`);
        }
      } catch (err) {
        console.error(`Error fetching image for ${food.name}:`, err.message);
      }
      
      // small delay to prevent rate limiting
      await new Promise(res => setTimeout(res, 1000));
    }
    
    console.log('Finished updating all images!');
    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

updateImages();
