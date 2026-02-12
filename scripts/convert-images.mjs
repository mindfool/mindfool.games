// scripts/convert-images.mjs
// Converts PNG images to WebP format for smaller file sizes
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '..', 'assets');

const images = ['icon.png', 'adaptive-icon.png', 'splash-icon.png', 'favicon.png'];

async function convert() {
  for (const img of images) {
    const input = path.join(assetsDir, img);
    const output = path.join(assetsDir, img.replace('.png', '.webp'));

    // Check if source exists
    if (!fs.existsSync(input)) {
      console.log(`Skipped: ${img} (not found)`);
      continue;
    }

    const inputStats = fs.statSync(input);

    await sharp(input)
      .webp({ quality: 90 })  // High quality for icons
      .toFile(output);

    const outputStats = fs.statSync(output);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`Converted: ${img} (${inputStats.size} bytes) -> ${img.replace('.png', '.webp')} (${outputStats.size} bytes) - ${savings}% smaller`);
  }
}

convert().catch(console.error);
