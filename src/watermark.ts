import type {
  TextWatermarkOptions,
  ImageWatermarkOptions,
  WatermarkOptions,
} from './types';
import { loadImage, calculatePosition, degToRad } from './utils';

/**
 * 绘制文字水印
 */
async function drawTextWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  options: TextWatermarkOptions
): Promise<void> {
  const {
    text,
    fontSize = 16,
    color = '#000000',
    fontFamily = 'Arial',
    fontWeight = 'normal',
    opacity = 0.5,
    rotate = 0,
    position = 'bottom-right',
    offset = {},
    repeat = false,
    repeatSpacing = 50,
  } = options;

  ctx.save();

  // 设置字体
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity;

  // 测量文字尺寸
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize;

  // 如果启用重复模式，在整个画布上重复绘制
  if (repeat) {
    // 计算旋转后的边界框尺寸
    const rad = degToRad(rotate);
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    const rotatedWidth = textWidth * cos + textHeight * sin;
    const rotatedHeight = textWidth * sin + textHeight * cos;

    // 计算每个水印单元的总尺寸（包括间距）
    const unitWidth = rotatedWidth + repeatSpacing;
    const unitHeight = rotatedHeight + repeatSpacing;

    // 计算需要绘制的行数和列数
    const cols = Math.ceil(canvasWidth / unitWidth) + 1;
    const rows = Math.ceil(canvasHeight / unitHeight) + 1;

    // 循环绘制每个水印
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * unitWidth;
        const y = row * unitHeight;

        ctx.save();
        // 移动到绘制位置中心
        ctx.translate(x + rotatedWidth / 2, y + rotatedHeight / 2);

        // 旋转
        if (rotate !== 0) {
          ctx.rotate(rad);
        }

        // 绘制文字
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 0, 0);

        ctx.restore();
      }
    }
  } else {
    // 原有单次绘制逻辑
    // 计算位置
    const { x, y } = calculatePosition(
      position,
      canvasWidth,
      canvasHeight,
      textWidth,
      textHeight,
      offset
    );

    // 移动到绘制位置
    ctx.translate(x + textWidth / 2, y + textHeight / 2);

    // 旋转
    if (rotate !== 0) {
      ctx.rotate(degToRad(rotate));
    }

    // 绘制文字
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);
  }

  ctx.restore();
}

/**
 * 绘制图片水印
 */
async function drawImageWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  options: ImageWatermarkOptions
): Promise<void> {
  const {
    image,
    width,
    height,
    opacity = 0.5,
    rotate = 0,
    position = 'bottom-right',
    offset = {},
    repeat = false,
    repeatSpacing = 50,
  } = options;

  // 加载水印图片（统一使用 loadImage 处理所有类型，确保图片已加载完成）
  const watermarkImg = await loadImage(image);

  // 验证图片是否有效
  if (!(watermarkImg instanceof HTMLImageElement)) {
    throw new Error('水印图片加载失败：返回的不是有效的 HTMLImageElement');
  }

  // 验证图片是否已加载完成
  if (!watermarkImg.complete || watermarkImg.naturalWidth === 0) {
    throw new Error('水印图片加载失败：图片未完全加载');
  }

  const watermarkWidth = width ?? watermarkImg.width;
  const watermarkHeight = height ?? watermarkImg.height;

  ctx.save();

  // 设置透明度
  ctx.globalAlpha = opacity;

  // 如果启用重复模式，在整个画布上重复绘制
  if (repeat) {
    // 计算旋转后的边界框尺寸
    const rad = degToRad(rotate);
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    const rotatedWidth = watermarkWidth * cos + watermarkHeight * sin;
    const rotatedHeight = watermarkWidth * sin + watermarkHeight * cos;

    // 计算每个水印单元的总尺寸（包括间距）
    const unitWidth = rotatedWidth + repeatSpacing;
    const unitHeight = rotatedHeight + repeatSpacing;

    // 计算需要绘制的行数和列数
    const cols = Math.ceil(canvasWidth / unitWidth) + 1;
    const rows = Math.ceil(canvasHeight / unitHeight) + 1;

    // 循环绘制每个水印
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * unitWidth;
        const y = row * unitHeight;

        ctx.save();
        // 移动到绘制位置中心
        ctx.translate(x + rotatedWidth / 2, y + rotatedHeight / 2);

        // 旋转
        if (rotate !== 0) {
          ctx.rotate(rad);
        }

        // 绘制图片（确保图片对象有效）
        if (watermarkImg instanceof HTMLImageElement && watermarkImg.complete && watermarkImg.naturalWidth > 0) {
          ctx.drawImage(
            watermarkImg,
            -watermarkWidth / 2,
            -watermarkHeight / 2,
            watermarkWidth,
            watermarkHeight
          );
        } else {
          throw new Error('水印图片无效，无法绘制');
        }

        ctx.restore();
      }
    }
  } else {
    // 原有单次绘制逻辑
    // 计算位置
    const { x, y } = calculatePosition(
      position,
      canvasWidth,
      canvasHeight,
      watermarkWidth,
      watermarkHeight,
      offset
    );

    // 移动到绘制位置中心
    ctx.translate(x + watermarkWidth / 2, y + watermarkHeight / 2);

    // 旋转
    if (rotate !== 0) {
      ctx.rotate(degToRad(rotate));
    }

    // 绘制图片（确保图片对象有效）
    if (watermarkImg instanceof HTMLImageElement && watermarkImg.complete && watermarkImg.naturalWidth > 0) {
      ctx.drawImage(
        watermarkImg,
        -watermarkWidth / 2,
        -watermarkHeight / 2,
        watermarkWidth,
        watermarkHeight
      );
    } else {
      throw new Error('水印图片无效，无法绘制');
    }
  }

  ctx.restore();
}

/**
 * 绘制单个水印
 */
async function drawWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  watermark: WatermarkOptions
): Promise<void> {
  if ('text' in watermark) {
    await drawTextWatermark(ctx, canvasWidth, canvasHeight, watermark);
  } else {
    await drawImageWatermark(ctx, canvasWidth, canvasHeight, watermark);
  }
}

/**
 * 添加水印到图片
 */
export async function addWatermark(
  options: {
    source: string | File | Blob | HTMLImageElement;
    watermarks: WatermarkOptions | WatermarkOptions[];
    outputFormat?: string;
    quality?: number;
  }
): Promise<Blob> {
  const {
    source,
    watermarks,
    outputFormat = 'image/png',
    quality = 0.92,
  } = options;

  // 加载源图片
  const sourceImage = await loadImage(source);

  // 创建 canvas
  const canvas = document.createElement('canvas');
  canvas.width = sourceImage.width;
  canvas.height = sourceImage.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法创建 Canvas 上下文');
  }

  // 绘制源图片
  ctx.drawImage(sourceImage, 0, 0);

  // 绘制水印
  const watermarkArray = Array.isArray(watermarks) ? watermarks : [watermarks];
  for (const watermark of watermarkArray) {
    await drawWatermark(ctx, canvas.width, canvas.height, watermark);
  }

  // 转换为 Blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('无法生成图片 Blob'));
        }
      },
      outputFormat,
      quality
    );
  });
}

