const sharp = require('sharp');
const path = require('path');

const inputPath = 'C:\\Users\\matej\\.gemini\\antigravity\\brain\\c69afc0e-473c-40d4-9117-7f381eb3772b\\media__1785093128517.png';
const outputPath = path.join(__dirname, 'public', 'flower-outline.png');

async function processImage() {
  try {
    console.log('Reading input image...');
    const { data, info } = await sharp(inputPath)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    console.log(`Image dimensions: ${width}x${height}, channels: ${channels}`);

    const outputData = Buffer.alloc(width * height * 4);

    for (let i = 0; i < width * height; i++) {
      const r = data[i * channels];
      const g = data[i * channels + 1];
      const b = data[i * channels + 2];

      // Calculate brightness of original pixel
      const brightness = (r + g + b) / 3;

      // Inverted brightness: 255 is black line in original, 0 is white background
      let inv = 255 - brightness;

      // Threshold to remove any compression/background artifacts or slight off-white haze
      let alpha = 0;
      if (inv > 20) {
        alpha = Math.min(255, Math.round((inv - 20) * (255 / 235)));
      }

      const outIndex = i * 4;
      outputData[outIndex] = 255;     // R - Pure White
      outputData[outIndex + 1] = 255; // G - Pure White
      outputData[outIndex + 2] = 255; // B - Pure White
      outputData[outIndex + 3] = alpha; // A - Clean extracted outline alpha
    }

    console.log('Writing transparent white outline PNG...');
    await sharp(outputData, {
      raw: {
        width,
        height,
        channels: 4
      }
    })
      .png({ compressionLevel: 9 })
      .toFile(outputPath);

    console.log(`Successfully saved white outline to: ${outputPath}`);
  } catch (err) {
    console.error('Error processing image:', err);
    process.exit(1);
  }
}

processImage();
