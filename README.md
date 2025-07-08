# 📸 Photography Portfolio

青森を拠点とするストリートフォトグラファーのポートフォリオサイト（Photon Log）

## 🌟 特徴

- **ドラマチックなヒーロー**: 背景写真付きの印象的なランディングページ
- **現代的なデザイン**: ダークテーマとミニマルなレイアウト
- **高速表示**: Astroによる静的サイト生成とWebP対応
- **レスポンシブギャラリー**: タイル状レイアウトで安定した表示
- **EXIF表示**: ホバー時にカメラ設定情報を表示
- **コンタクト機能**: 撮影依頼やコラボレーション対応
- **自動最適化**: 画像の自動リサイズとフォーマット変換
- **GitHub Pages**: 完全無料でのホスティング

## 🚀 ライブサイト

**https://phonon-py.github.io/photography-portfoli**

## 📸 Instagram & Contact

- **Instagram**: https://www.instagram.com/photon_log/
- **Email**: phn.19890918@gmail.com

## 🛠️ 技術スタック

- **フレームワーク**: [Astro](https://astro.build/) v5
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/) v3
- **画像処理**: [Sharp](https://sharp.pixelplumbing.com/)
- **メタデータ**: [exif-reader](https://github.com/devongovett/exif-reader)
- **デプロイ**: GitHub Actions + GitHub Pages
- **言語**: TypeScript, JavaScript (ES Modules)

## 📁 プロジェクト構造

```
photography-portfoli/
├── src/
│   ├── components/          # Astroコンポーネント
│   │   ├── PhotoGallery.astro
│   │   ├── PhotoCard.astro
│   │   └── DebugInfo.astro
│   ├── layouts/            # レイアウトテンプレート
│   │   └── Layout.astro
│   ├── pages/              # ページファイル
│   │   └── index.astro
│   ├── data/               # データファイル
│   │   └── photos.json     # 写真メタデータDB
│   └── utils/              # ユーティリティ
├── public/
│   ├── images/             # 最適化済み画像（Git管理）
│   │   ├── *.jpg          # フルサイズ画像
│   │   ├── *.webp         # WebP版
│   │   └── thumbs/        # サムネイル
│   └── favicon.svg
├── scripts/                # 画像処理スクリプト
│   ├── process-photos.js   # 一括処理
│   ├── add-photo.js       # 1枚追加
│   └── sync-from-nas.js   # NAS同期（オプション）
├── raw-photos/             # 処理前画像（Git対象外）
├── .github/workflows/      # GitHub Actions
│   └── deploy.yml
└── astro.config.mjs        # Astro設定
```

## 🔧 セットアップ

### 前提条件
- Node.js 18以上
- Git
- GitHub アカウント

### インストール手順

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/phonon-py/photography-portfoli.git
   cd photography-portfoli
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   → http://localhost:4321 でアクセス

## 📸 写真の追加方法

### 方法1: 1枚ずつ追加
```bash
npm run add-photo "/path/to/your/photo.jpg"
```

### 方法2: 複数枚一括処理
```bash
# raw-photosディレクトリに写真をコピー
cp /path/to/photos/*.jpg ./raw-photos/

# 一括処理
npm run process-photos
```

### 方法3: NAS同期（オプション）
```bash
# .env.localに設定
echo 'NAS_PHOTOS_PATH=/path/to/nas/photos' > .env.local

# 同期実行
npm run sync-from-nas
```

## 🚀 デプロイ

### GitHub Pagesの設定

1. **リポジトリ設定**
   - Settings → Pages → Source: "GitHub Actions"

2. **権限設定**
   - Settings → Actions → General → Workflow permissions: "Read and write permissions"

3. **デプロイ実行**
   ```bash
   git add .
   git commit -m "Add new photos"
   git push origin main
   ```
   → 自動でサイトが更新されます

## 🎨 カスタマイズ

### サイト情報の変更
`astro.config.mjs`:
```javascript
export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/your-repo-name',
  // ...
});
```

### スタイリングの変更
- `src/pages/index.astro`でヒーローセクションやテキストをカスタマイズ可能
- ヒーロー背景画像の変更: `images/DSCF0283.jpg`を任意の画像に置き換え

### カメラ情報の変更
`scripts/process-photos.js`の以下部分を編集:
```javascript
camera: 'FUJIFILM X-T50',
lens: 'XF16-55mmF2.8 R LM WR II',
```

## 📊 画像最適化仕様

- **フルサイズ**: 最大1600px、JPEG 90%品質
- **WebP版**: 最大1200px、WebP 85%品質  
- **サムネイル**: 400x300px、JPEG 85%品質
- **自動EXIF抽出**: カメラ設定、撮影日時など

## 🔍 トラブルシューティング

### 画像が表示されない
1. `npm run build` でエラーがないか確認
2. GitHub Actionsのログを確認
3. 画像ファイルサイズが大きすぎないか確認（1GB制限）

### ビルドエラー
```bash
# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install

# キャッシュクリア
npm run build
```

### 開発環境での問題
```bash
# 開発サーバー再起動
npm run dev
```

## 📝 コマンドリファレンス

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番用ビルド |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run add-photo <path>` | 写真を1枚追加 |
| `npm run process-photos` | 全写真を一括処理 |
| `npm run sync-from-nas` | NASから同期 |
| `npm run deploy` | 処理+ビルド |

## 🤝 コントリビューション

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 ライセンス

このプロジェクトは [ISC License](LICENSE) の下で公開されています。

## 🎨 サイト構成

### ページ構成
- **Hero Section**: 背景写真付きの印象的なランディング
- **Gallery Section**: タイル状レイアウトのポートフォリオ（日時昇順）
- **Contact Section**: 撮影依頼・コラボレーション受付

### ブランディング
- **サイト名**: Photon Diary
- **コンセプト**: 青森ベースのストリートフォトグラファー
- **テーマ**: 何気ない日常の中に潜む美しい瞬間を切り取る

## 🙏 謝辞

- **FUJIFILM** - X-T50カメラシステム
- **Astro** - 高速な静的サイトジェネレーター
- **Tailwind CSS** - 美しいスタイリング
- **Sharp** - 高性能画像処理
- **GitHub Pages** - 無料ホスティング

---

**Built with ❤️ for street photography enthusiasts in Aomori**