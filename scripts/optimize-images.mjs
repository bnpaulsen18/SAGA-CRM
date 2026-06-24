/**
 * Image Optimization Script
 * Converts PNG logos to optimized WebP format with multiple sizes
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');
const optimizedDir = join(publicDir, 'optimized');

// Create optimized directory if it doesn't exist
if (!existsSync(optimizedDir)) {
  mkdirSync(optimizedDir, { recursive: true });
}

// Images to optimize with their target sizes
const images = [
  {
    input: 'SAGA_Logo_final.png',
    outputName: 'saga-logo',
    sizes: [
      { width: 400, suffix: '-400w' },
      { width: 800, suffix: '-800w' },
      { width: 1200, suffix: '-1200w' },
    ],
  },
];

async function optimizeImage(inputPath, outputPath, width) {
  try {
    const info = await sharp(inputPath)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);

    const inputSize = (await sharp(inputPath).metadata()).size;
    const savings = ((1 - info.size / inputSize) * 100).toFixed(1);

    console.log(`✓ ${outputPath}`);
    console.log(`  ${width}w: ${(info.size / 1024).toFixed(1)}KB (${savings}% smaller)`);

    return info;
  } catch (error) {
    console.error(`✗ Failed to optimize ${inputPath}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🎨 Starting image optimization...\n');

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const image of images) {
    const inputPath = join(publicDir, image.input);

    if (!existsSync(inputPath)) {
      console.log(`⚠ Skipping ${image.input} - file not found`);
      continue;
    }

    console.log(`📸 Processing ${image.input}...`);

    // Get original size
    const originalMetadata = await sharp(inputPath).metadata();
    totalOriginalSize += originalMetadata.size;

    // Optimize to multiple sizes
    for (const size of image.sizes) {
      const outputPath = join(
        optimizedDir,
        `${image.outputName}${size.suffix}.webp`
      );

      const info = await optimizeImage(inputPath, outputPath, size.width);
      totalOptimizedSize += info.size;
    }

    // Also create a full-size WebP version
    const fullSizePath = join(optimizedDir, `${image.outputName}.webp`);
    const fullSizeInfo = await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(fullSizePath);

    totalOptimizedSize += fullSizeInfo.size;

    console.log(`✓ ${fullSizePath}`);
    console.log(
      `  Full size: ${(fullSizeInfo.size / 1024).toFixed(1)}KB\n`
    );
  }

  // Summary
  const totalSavings = (
    (1 - totalOptimizedSize / totalOriginalSize) *
    100
  ).toFixed(1);

  console.log('✅ Optimization complete!\n');
  console.log('📊 Summary:');
  console.log(`  Original size: ${(totalOriginalSize / 1024).toFixed(1)}KB`);
  console.log(`  Optimized size: ${(totalOptimizedSize / 1024).toFixed(1)}KB`);
  console.log(`  Total savings: ${totalSavings}%`);
  console.log(`\n📁 Optimized images saved to: ${optimizedDir}`);
}

main().catch((error) => {
  console.error('❌ Optimization failed:', error);
  process.exit(1);
});
