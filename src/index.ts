import { addWatermark } from './watermark';
import type {
  AddWatermarkOptions,
  WatermarkResult,
  TextWatermarkOptions,
  ImageWatermarkOptions,
  WatermarkOptions,
  WatermarkPosition,
} from './types';

/**
 * 添加水印到图片
 * @param options 配置选项
 * @returns 返回处理后的图片结果
 */
export async function addWatermarkToImage(
  options: AddWatermarkOptions
): Promise<WatermarkResult> {
  const { source, watermarks, outputFormat, quality, returnBase64 = false } = options;

  // 生成带水印的图片 Blob
  const blob = await addWatermark({
    source,
    watermarks,
    outputFormat,
    quality,
  });

  // 生成 base64
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  // 生成 URL
  const url = URL.createObjectURL(blob);

  return {
    blob,
    base64,
    url,
  };
}

// 导出类型
export type {
  AddWatermarkOptions,
  WatermarkResult,
  TextWatermarkOptions,
  ImageWatermarkOptions,
  WatermarkOptions,
  WatermarkPosition,
};

// 导出主要函数
export { addWatermarkToImage as default };

