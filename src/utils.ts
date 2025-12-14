/**
 * 工具函数
 */

/**
 * 加载图片
 */
export function loadImage(source: string | File | Blob | HTMLImageElement): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (source instanceof HTMLImageElement) {
      // 如果图片已经加载完成且有效
      if (source.complete && source.naturalWidth > 0) {
        resolve(source);
        return;
      }
      // 如果图片正在加载或加载失败
      if (source.complete && source.naturalWidth === 0) {
        reject(new Error('图片加载失败：图片元素无效'));
        return;
      }
      // 等待图片加载
      const onLoad = () => {
        if (source.naturalWidth > 0) {
          resolve(source);
        } else {
          reject(new Error('图片加载失败：图片无效'));
        }
        source.removeEventListener('load', onLoad);
        source.removeEventListener('error', onError);
      };
      const onError = () => {
        reject(new Error('图片加载失败'));
        source.removeEventListener('load', onLoad);
        source.removeEventListener('error', onError);
      };
      source.addEventListener('load', onLoad);
      source.addEventListener('error', onError);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // 验证图片是否有效
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        resolve(img);
      } else {
        reject(new Error('图片加载失败：图片尺寸无效'));
      }
    };
    img.onerror = (error) => {
      reject(new Error('图片加载失败：无法加载图片资源'));
    };

    if (source instanceof File || source instanceof Blob) {
      img.src = URL.createObjectURL(source);
    } else {
      img.src = source;
    }
  });
}

/**
 * 计算水印位置坐标
 */
export function calculatePosition(
  position: string,
  canvasWidth: number,
  canvasHeight: number,
  watermarkWidth: number,
  watermarkHeight: number,
  offset: { x?: number; y?: number } = {}
): { x: number; y: number } {
  const offsetX = offset.x ?? 10;
  const offsetY = offset.y ?? 10;

  switch (position) {
    case 'top-left':
      return { x: offsetX, y: offsetY };
    case 'top-right':
      return { x: canvasWidth - watermarkWidth - offsetX, y: offsetY };
    case 'bottom-left':
      return { x: offsetX, y: canvasHeight - watermarkHeight - offsetY };
    case 'bottom-right':
      return { x: canvasWidth - watermarkWidth - offsetX, y: canvasHeight - watermarkHeight - offsetY };
    case 'center':
      return {
        x: (canvasWidth - watermarkWidth) / 2,
        y: (canvasHeight - watermarkHeight) / 2,
      };
    case 'top-center':
      return {
        x: (canvasWidth - watermarkWidth) / 2,
        y: offsetY,
      };
    case 'bottom-center':
      return {
        x: (canvasWidth - watermarkWidth) / 2,
        y: canvasHeight - watermarkHeight - offsetY,
      };
    case 'left-center':
      return {
        x: offsetX,
        y: (canvasHeight - watermarkHeight) / 2,
      };
    case 'right-center':
      return {
        x: canvasWidth - watermarkWidth - offsetX,
        y: (canvasHeight - watermarkHeight) / 2,
      };
    default:
      return { x: offsetX, y: offsetY };
  }
}

/**
 * 将角度转换为弧度
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

