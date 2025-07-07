// パスユーティリティ
export function getImagePath(filename) {
  const basePath = import.meta.env.BASE_URL || '/';
  return `${basePath}images/${filename}`.replace(/\/+/g, '/');
}

export function getWebPPath(filename) {
  const basePath = import.meta.env.BASE_URL || '/';
  return `${basePath}images/${filename}`.replace(/\/+/g, '/');
}

export function getThumbnailPath(filename) {
  const basePath = import.meta.env.BASE_URL || '/';
  return `${basePath}images/thumbs/${filename}`.replace(/\/+/g, '/');
}