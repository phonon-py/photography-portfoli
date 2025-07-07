import fs from 'fs/promises';
import path from 'path';
import { processPhotos } from './process-photos.js';

async function addPhoto(photoPath) {
  if (!photoPath) {
    console.log('Usage: npm run add-photo /path/to/photo.jpg');
    return;
  }

  try {
    // raw-photosディレクトリにコピー
    const filename = path.basename(photoPath);
    const destPath = `./raw-photos/${filename}`;
    
    await fs.mkdir('./raw-photos', { recursive: true });
    await fs.copyFile(photoPath, destPath);
    
    console.log(`📸 Added: ${filename}`);
    
    // 処理実行
    await processPhotos();
    
    console.log('✅ Photo processed and ready for commit!');
    console.log('Next: git add . && git commit -m "Add new photo" && git push');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// コマンドライン引数から実行
const photoPath = process.argv[2];
addPhoto(photoPath);