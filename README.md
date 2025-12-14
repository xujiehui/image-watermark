# watermark-img

一个在 web 环境下为图片添加水印的 npm 包，支持文字和图片水印。

## 特性

- ✅ 支持文字水印
- ✅ 支持图片水印
- ✅ 支持多个水印叠加
- ✅ 支持自定义位置（9 个位置可选）
- ✅ 支持重复铺满整个图片
- ✅ 支持自定义透明度
- ✅ 支持旋转角度
- ✅ 支持自定义字体样式
- ✅ 支持多种图片格式输出
- ✅ TypeScript 支持
- ✅ 零依赖

## 安装

```bash
npm install watermark-img
```

## 使用方法

### 基础用法

```javascript
import { addWatermarkToImage } from 'watermark-img';

// 添加文字水印
const result = await addWatermarkToImage({
  source: 'path/to/image.jpg', // 或 File、Blob、HTMLImageElement
  watermarks: {
    text: '水印文字',
    position: 'bottom-right',
    fontSize: 20,
    color: '#ffffff',
    opacity: 0.7,
  },
});

// 使用结果
const img = document.createElement('img');
img.src = result.url; // 或 result.base64
document.body.appendChild(img);
```

### 添加图片水印

```javascript
import { addWatermarkToImage } from 'watermark-img';

const result = await addWatermarkToImage({
  source: 'path/to/image.jpg',
  watermarks: {
    image: 'path/to/watermark.png',
    position: 'bottom-right',
    width: 100,
    height: 50,
    opacity: 0.5,
  },
});
```

### 添加多个水印

```javascript
const result = await addWatermarkToImage({
  source: 'path/to/image.jpg',
  watermarks: [
    {
      text: '顶部水印',
      position: 'top-center',
      fontSize: 24,
      color: '#ff0000',
    },
    {
      image: 'path/to/logo.png',
      position: 'bottom-right',
      width: 80,
      height: 80,
      opacity: 0.6,
    },
  ],
});
```

### 重复铺满水印

```javascript
// 文字水印重复铺满
const result = await addWatermarkToImage({
  source: 'path/to/image.jpg',
  watermarks: {
    text: '水印文字',
    repeat: true, // 启用重复模式
    repeatSpacing: 50, // 水印间距（像素），默认 50
    fontSize: 20,
    color: '#ffffff',
    opacity: 0.3,
    rotate: -45, // 可选：旋转角度
  },
});

// 图片水印重复铺满
const result = await addWatermarkToImage({
  source: 'path/to/image.jpg',
  watermarks: {
    image: 'path/to/watermark.png',
    repeat: true,
    repeatSpacing: 100,
    width: 80,
    height: 80,
    opacity: 0.4,
    rotate: 30,
  },
});
```

### 自定义输出格式

```javascript
const result = await addWatermarkToImage({
  source: 'path/to/image.jpg',
  watermarks: {
    text: '水印',
    position: 'bottom-right',
  },
  outputFormat: 'image/jpeg',
  quality: 0.9, // 仅对 jpeg 有效
});
```

### 获取 base64 字符串

```javascript
const result = await addWatermarkToImage({
  source: 'path/to/image.jpg',
  watermarks: {
    text: '水印',
  },
  returnBase64: true, // 默认 false
});

console.log(result.base64); // data:image/png;base64,...
```

## API

### `addWatermarkToImage(options)`

添加水印到图片。

#### 参数

- `source` (string | File | Blob | HTMLImageElement): 源图片
- `watermarks` (WatermarkOptions | WatermarkOptions[]): 水印配置（单个或多个）
- `outputFormat` (string, 可选): 输出格式，默认 `'image/png'`
- `quality` (number, 可选): 输出质量（0-1），仅对 jpeg 有效，默认 `0.92`
- `returnBase64` (boolean, 可选): 是否返回 base64，默认 `false`

#### 返回值

返回 `Promise<WatermarkResult>`，包含：
- `blob`: 处理后的图片 Blob
- `base64`: 处理后的图片 base64 字符串
- `url`: 处理后的图片 URL（可用于预览）

### 文字水印配置 (TextWatermarkOptions)

- `text` (string): 水印文字
- `fontSize` (number, 可选): 字体大小，默认 `16`
- `color` (string, 可选): 字体颜色，默认 `'#000000'`
- `fontFamily` (string, 可选): 字体家族，默认 `'Arial'`
- `fontWeight` (string | number, 可选): 字体粗细，默认 `'normal'`
- `opacity` (number, 可选): 透明度（0-1），默认 `0.5`
- `rotate` (number, 可选): 旋转角度（度），默认 `0`
- `position` (WatermarkPosition, 可选): 水印位置，默认 `'bottom-right'`（当 `repeat` 为 `true` 时忽略）
- `offset` (object, 可选): 距离边缘的偏移量，默认 `{ x: 10, y: 10 }`（当 `repeat` 为 `true` 时忽略）
- `repeat` (boolean, 可选): 是否重复铺满整个图片，默认 `false`
- `repeatSpacing` (number, 可选): 重复模式下的水印间距（像素），默认 `50`

### 图片水印配置 (ImageWatermarkOptions)

- `image` (string | HTMLImageElement): 水印图片 URL 或 Image 对象
- `width` (number, 可选): 水印宽度，默认原图宽度
- `height` (number, 可选): 水印高度，默认原图高度
- `opacity` (number, 可选): 透明度（0-1），默认 `0.5`
- `rotate` (number, 可选): 旋转角度（度），默认 `0`
- `position` (WatermarkPosition, 可选): 水印位置，默认 `'bottom-right'`（当 `repeat` 为 `true` 时忽略）
- `offset` (object, 可选): 距离边缘的偏移量，默认 `{ x: 10, y: 10 }`（当 `repeat` 为 `true` 时忽略）
- `repeat` (boolean, 可选): 是否重复铺满整个图片，默认 `false`
- `repeatSpacing` (number, 可选): 重复模式下的水印间距（像素），默认 `50`

### 水印位置 (WatermarkPosition)

可选值：
- `'top-left'`: 左上角
- `'top-right'`: 右上角
- `'bottom-left'`: 左下角
- `'bottom-right'`: 右下角
- `'center'`: 居中
- `'top-center'`: 顶部居中
- `'bottom-center'`: 底部居中
- `'left-center'`: 左侧居中
- `'right-center'`: 右侧居中

## 示例

### 在 React 中使用

```jsx
import React, { useState } from 'react';
import { addWatermarkToImage } from 'watermark-img';

function WatermarkDemo() {
  const [result, setResult] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const result = await addWatermarkToImage({
      source: file,
      watermarks: {
        text: '我的水印',
        position: 'bottom-right',
        fontSize: 24,
        color: '#ffffff',
        opacity: 0.8,
      },
    });

    setResult(result);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {result && <img src={result.url} alt="带水印的图片" />}
    </div>
  );
}
```

### 在 Vue 中使用

```vue
<template>
  <div>
    <input type="file" accept="image/*" @change="handleFileChange" />
    <img v-if="result" :src="result.url" alt="带水印的图片" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { addWatermarkToImage } from 'watermark-img';

const result = ref(null);

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const res = await addWatermarkToImage({
    source: file,
    watermarks: {
      text: '我的水印',
      position: 'bottom-right',
      fontSize: 24,
      color: '#ffffff',
      opacity: 0.8,
    },
  });

  result.value = res;
};
</script>
```

## 浏览器兼容性

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- 需要支持 Canvas API 和 FileReader API

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

