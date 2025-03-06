// optimize-images.js - Image optimization script for web performance
const sharp = require('sharp');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

// Configuration
const config = {
    // Folders to process
    imageFolders: [
        'images/illustrations',
        'images/originals',
        'images/zines'
    ],
    // File extensions to process
    extensions: ['jpg', 'jpeg', 'png'],
    // Output quality (1-100)
    quality: 80,
    // Size variations to create
    sizes: [
        { suffix: '-sm', width: 400 },
        { suffix: '-md', width: 800 },
        { suffix: '-lg', width: 1200 }
    ],
    // Enable WebP conversion
    convertToWebP: true
};

async function processImage(imagePath) {
    try {
        // Get file info
        const ext = path.extname(imagePath).toLowerCase();
        const dir = path.dirname(imagePath);
        const baseName = path.basename(imagePath, ext);
        const outputExt = ext === '.png' ? '.png' : '.jpg';
        
        // Create output directory if it doesn't exist
        const outputDir = path.join(dir, 'optimized');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Create a sharp instance
        let image = sharp(imagePath);
        
        // Get image metadata
        const metadata = await image.metadata();
        
        // Process each size
        for (const size of config.sizes) {
            // Only resize if the image is larger than target size
            if (metadata.width > size.width) {
                // Resize and save
                let resized = image.clone().resize(size.width);
                
                // Save as original format (JPG/PNG)
                if (outputExt === '.jpg') {
                    await resized.jpeg({ quality: config.quality })
                        .toFile(path.join(outputDir, `${baseName}${size.suffix}${outputExt}`));
                } else {
                    await resized.png({ quality: config.quality })
                        .toFile(path.join(outputDir, `${baseName}${size.suffix}${outputExt}`));
                }
                
                // Save as WebP if enabled
                if (config.convertToWebP) {
                    await resized.webp({ quality: config.quality })
                        .toFile(path.join(outputDir, `${baseName}${size.suffix}.webp`));
                }
            }
        }
        
        // Also optimize the original size image
        if (outputExt === '.jpg') {
            await image.jpeg({ quality: config.quality })
                .toFile(path.join(outputDir, `${baseName}${outputExt}`));
        } else {
            await image.png({ quality: config.quality })
                .toFile(path.join(outputDir, `${baseName}${outputExt}`));
        }
        
        // Save WebP version of original
        if (config.convertToWebP) {
            await image.webp({ quality: config.quality })
                .toFile(path.join(outputDir, `${baseName}.webp`));
        }
        
        console.log(`✅ Processed: ${imagePath}`);
    } catch (error) {
        console.error(`❌ Error processing ${imagePath}:`, error);
    }
}

async function optimizeImages() {
    // Process each folder
    for (const folder of config.imageFolders) {
        // Find all images with specified extensions
        const pattern = `${folder}/**/*.@(${config.extensions.join('|')})`;
        const files = glob.sync(pattern);
        
        console.log(`Found ${files.length} images in ${folder}`);
        
        // Process each image
        for (const file of files) {
            await processImage(file);
        }
    }
    
    console.log('🎉 All images processed successfully!');
}

optimizeImages().catch(err => {
    console.error('Error during optimization:', err);
    process.exit(1);
});