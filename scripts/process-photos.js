import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import exifReader from 'exif-reader';

const RAW_DIR = './raw-photos';
const OUTPUT_DIR = './public/images';
const DATA_FILE = './src/data/photos.json';

// サポートファイル形式
const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png', 'tiff', 'tif', 'raw', 'raf'];

async function processPhotos() {
  console.log('📸 Starting photo processing...');
  
  // 出力ディレクトリ作成
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(`${OUTPUT_DIR}/thumbs`, { recursive: true });

  // 既存の写真データ読み込み
  let existingPhotos = [];
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    existingPhotos = JSON.parse(data);
  } catch (e) {
    console.log('📝 Creating new photos database');
  }

  // RAWディレクトリの画像ファイル検索
  const pattern = `${RAW_DIR}/**/*.{${SUPPORTED_FORMATS.join(',')}}`;
  const files = await glob(pattern, { nocase: true });
  
  console.log(`🔍 Found ${files.length} image files`);

  const processedPhotos = [];
  
  for (const filePath of files) {
    try {
      const originalFilename = path.parse(filePath).name;
      // ファイル名を正規化（スペースをアンダースコアに、特殊文字を削除）
      const filename = originalFilename.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
      
      // 既に処理済みかチェック
      if (existingPhotos.some(p => p.filename === filename)) {
        console.log(`⏭️  Skipping already processed: ${filename}`);
        continue;
      }

      console.log(`🔄 Processing: ${originalFilename} -> ${filename}`);
      
      const photoData = await processPhoto(filePath, filename);
      processedPhotos.push(photoData);
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  // 写真データ統合・更新
  const allPhotos = [...processedPhotos, ...existingPhotos]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  await fs.writeFile(DATA_FILE, JSON.stringify(allPhotos, null, 2));
  
  console.log(`✅ Processed ${processedPhotos.length} new photos`);
  console.log(`📊 Total photos: ${allPhotos.length}`);
  
  return allPhotos;
}

async function processPhoto(inputPath, filename) {
  // メタデータ抽出
  const metadata = await sharp(inputPath).metadata();
  const exif = metadata.exif ? exifReader(metadata.exif) : {};

  // 画像生成
  const outputBase = `${OUTPUT_DIR}/${filename}`;
  
  // フル解像度 (最大1600px、GitHub Pages容量対策)
  await sharp(inputPath)
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90, progressive: true })
    .toFile(`${outputBase}.jpg`);

  // サムネイル (400x300)
  await sharp(inputPath)
    .resize(400, 300, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 85 })
    .toFile(`${OUTPUT_DIR}/thumbs/${filename}.jpg`);

  // WebP版 (軽量化)
  await sharp(inputPath)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(`${outputBase}.webp`);

  // メタデータ構築
  return {
    id: generateId(),
    filename,
    src: `images/${filename}.jpg`,
    srcWebP: `images/${filename}.webp`,
    thumbnail: `images/thumbs/${filename}.jpg`,
    alt: generateAlt(filename),
    camera: 'FUJIFILM X-T50',
    lens: 'XF16-55mmF2.8 R LM WR II',
    settings: {
      aperture: exif.Photo?.FNumber ? `f/${exif.Photo.FNumber}` : 'f/2.8',
      shutter: formatShutterSpeed(exif.Photo?.ExposureTime),
      iso: exif.Photo?.ISOSpeedRatings || 400,
      focalLength: exif.Photo?.FocalLength ? `${exif.Photo.FocalLength}mm` : null,
    },
    dimensions: {
      width: metadata.width,
      height: metadata.height,
    },
    date: exif.Photo?.DateTime || exif.Image?.DateTime || new Date().toISOString(),
    tags: generateTags(filename),
    processed: new Date().toISOString(),
  };
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function generateAlt(filename) {
  return filename
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function formatShutterSpeed(exposureTime) {
  if (!exposureTime) return '1/250s';
  return exposureTime >= 1 ? `${exposureTime}s` : `1/${Math.round(1/exposureTime)}s`;
}

function generateTags(filename) {
  const tags = [];
  const name = filename.toLowerCase();
  
  if (name.includes('street')) tags.push('street');
  if (name.includes('portrait')) tags.push('portrait');
  if (name.includes('night')) tags.push('night');
  if (name.includes('urban')) tags.push('urban');
  if (name.includes('sunset')) tags.push('sunset');
  if (name.includes('morning')) tags.push('morning');
  
  return tags;
}

// 実行
if (import.meta.url === `file://${process.argv[1]}`) {
  processPhotos().catch(console.error);
}

export { processPhotos };