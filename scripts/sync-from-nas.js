import { execSync } from 'child_process';
import fs from 'fs/promises';

const NAS_PATH = process.env.NAS_PHOTOS_PATH || '/Volumes/photography/portfolio/edited';
const LOCAL_RAW = './raw-photos';

async function syncFromNAS() {
  try {
    console.log('🔄 Syncing photos from NAS...');
    
    // NASマウント確認
    try {
      await fs.access(NAS_PATH);
    } catch (error) {
      console.log('❌ NAS not accessible. Please mount or check path.');
      return;
    }

    // rsync実行
    const rsyncCommand = `rsync -av --progress "${NAS_PATH}/" "${LOCAL_RAW}/"`;
    console.log(`Executing: ${rsyncCommand}`);
    
    execSync(rsyncCommand, { stdio: 'inherit' });
    
    console.log('✅ Sync completed');
    
    // 自動処理
    const { processPhotos } = await import('./process-photos.js');
    await processPhotos();
    
    console.log('🚀 Ready to commit and deploy!');
    
  } catch (error) {
    console.error('❌ Sync error:', error.message);
  }
}

syncFromNAS();