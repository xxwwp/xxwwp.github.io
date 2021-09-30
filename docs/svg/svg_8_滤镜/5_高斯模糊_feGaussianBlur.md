---
title: svg 高斯模糊 feGaussianBlue
createAt: 2021-08-18
slug: svg/filter/高斯模糊
publish: true
tags:
  - svg
  - 滤镜
  - 高斯模糊
  - stdDeviation
  - feGaussianBlue
archives:
  - 专栏
  - svg
---

[`<feGaussianBlur>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feGaussianBlur) 是高斯模糊滤镜。

> 该滤镜对输入图像进行高斯模糊，属性 `stdDeviation` 中指定的数量定义了钟形。

示例：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="GaussianBlur-1">
			<feGaussianBlur stdDeviation="0.1" />
		</filter>
	</defs>
	<image
		x="1"
		y="1"
		width="8"
		height="8"
		xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
		filter="url(#GaussianBlur-1)"
	/>
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="GaussianBlur-1">
			<feGaussianBlur stdDeviation="0.1" />
		</filter>
	</defs>
	<image
		x="1"
		y="1"
		width="8"
		height="8"
		xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
		filter="url(#GaussianBlur-1)"
	/>
</svg>

高斯模糊效果就像近视一样。
