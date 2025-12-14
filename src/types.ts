/**
 * 水印位置
 */
export type WatermarkPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center'
  | 'top-center'
  | 'bottom-center'
  | 'left-center'
  | 'right-center';

/**
 * 文字水印配置
 */
export interface TextWatermarkOptions {
  /** 水印文字 */
  text: string;
  /** 字体大小，默认 16 */
  fontSize?: number;
  /** 字体颜色，默认 '#000000' */
  color?: string;
  /** 字体家族，默认 'Arial' */
  fontFamily?: string;
  /** 字体粗细，默认 'normal' */
  fontWeight?: string | number;
  /** 透明度，0-1，默认 0.5 */
  opacity?: number;
  /** 旋转角度（度），默认 0 */
  rotate?: number;
  /** 水印位置，默认 'bottom-right' */
  position?: WatermarkPosition;
  /** 距离边缘的偏移量（像素），默认 10 */
  offset?: {
    x?: number;
    y?: number;
  };
  /** 是否重复铺满整个图片，默认 false */
  repeat?: boolean;
  /** 重复模式下的水印间距（像素），默认 50 */
  repeatSpacing?: number;
}

/**
 * 图片水印配置
 */
export interface ImageWatermarkOptions {
  /** 水印图片 URL、File、Blob 或 Image 对象 */
  image: string | File | Blob | HTMLImageElement;
  /** 水印宽度，默认原图宽度 */
  width?: number;
  /** 水印高度，默认原图高度 */
  height?: number;
  /** 透明度，0-1，默认 0.5 */
  opacity?: number;
  /** 旋转角度（度），默认 0 */
  rotate?: number;
  /** 水印位置，默认 'bottom-right' */
  position?: WatermarkPosition;
  /** 距离边缘的偏移量（像素），默认 10 */
  offset?: {
    x?: number;
    y?: number;
  };
  /** 是否重复铺满整个图片，默认 false */
  repeat?: boolean;
  /** 重复模式下的水印间距（像素），默认 50 */
  repeatSpacing?: number;
}

/**
 * 水印配置（联合类型）
 */
export type WatermarkOptions = TextWatermarkOptions | ImageWatermarkOptions;

/**
 * 添加水印的配置选项
 */
export interface AddWatermarkOptions {
  /** 源图片（URL、File、Blob 或 Image 对象） */
  source: string | File | Blob | HTMLImageElement;
  /** 水印配置（可以是单个或多个） */
  watermarks: WatermarkOptions | WatermarkOptions[];
  /** 输出图片格式，默认 'image/png' */
  outputFormat?: string;
  /** 输出图片质量（0-1），仅对 jpeg 格式有效，默认 0.92 */
  quality?: number;
  /** 是否返回 base64 字符串，默认 false（返回 Blob） */
  returnBase64?: boolean;
}

/**
 * 水印结果
 */
export interface WatermarkResult {
  /** 处理后的图片 Blob */
  blob: Blob;
  /** 处理后的图片 base64 字符串 */
  base64: string;
  /** 处理后的图片 URL（可用于预览） */
  url: string;
}

