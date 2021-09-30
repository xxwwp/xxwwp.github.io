---
title: svg 剪裁和遮罩
createAt: 2021-08-11
slug: svg/剪裁和遮罩
publish: true
tags:
  - svg
  - 剪裁
  - clipPath
  - 遮罩
  - mask
  - 透明度
archives:
  - 专栏
  - svg
---

## 剪裁

svg 中的剪裁更像是过滤的效果，筛选出需要的部分，把不需要的部分移除。

剪裁之前，需要定义一个剪裁区域，在 `<defs>` 元素中使用 `<clipPath>` 元素描述。`<clipPath>` 元素也需要有一个 id，方便其他元素引用。在 `<clipPath>` 中可以定义任何样子的图形，它将作为剪裁的模具。

应用剪裁也很简单，使用 `clip-path` 属性即可。比如把一个圆剪裁为一个半圆：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
	<defs>
		<clipPath id="ClipPath-1">
			<rect x="20" y="20" width="100" height="50" />
		</clipPath>
	</defs>
	<circle r="50" cx="70" cy="70" clip-path="url(#ClipPath-1)" />
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
	<defs>
		<clipPath id="ClipPath-1">
			<rect x="20" y="20" width="100" height="50" />
		</clipPath>
	</defs>
	<circle r="50" cx="70" cy="70" clip-path="url(#ClipPath-1)" />
</svg>

剪裁区域是一个矩形，且仅包含圆形的上半部分，所以最后圆形应用此剪裁后，只剩下上半部分，超出剪裁区域的部分被移出了。在这个过程中，矩形也不会被绘制。

> clipPath 内部的每个路径都会被检查到、与它的描边属性一起被估值、变形。然后目标的位于 clipPath 内容的结果的透明度区域的每一块都不会呈现。颜色、不透明度都没有这种效果，因为它们不能让一部分彻底消失。

## 遮罩

遮罩类似调节透明度的一个过程，mdn 上的示例让觉得它很多余。但是等学到图片引入后，在图片上填充一层遮罩就会出现很多意外的效果，比如常说的暖色调，冷色调等。

遮罩使用 `<mask>` 元素来定义一个遮罩区域，比如：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="Gradient">
      <stop offset="0" stop-color="white" stop-opacity="0" />
      <stop offset="1" stop-color="white" stop-opacity="1" />
    </linearGradient>
    <mask id="Mask">
      <rect x="0" y="0" width="200" height="200" fill="url(#Gradient)"  />
    </mask>
  </defs>

  <rect x="0" y="0" width="200" height="200" fill="green" />
  <rect x="0" y="0" width="200" height="200" fill="red" mask="url(#Mask)" />
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="Gradient">
      <stop offset="0" stop-color="white" stop-opacity="0" />
      <stop offset="1" stop-color="white" stop-opacity="1" />
    </linearGradient>
    <mask id="Mask">
      <rect x="0" y="0" width="200" height="200" fill="url(#Gradient)"  />
    </mask>
  </defs>

  <rect x="0" y="0" width="200" height="200" fill="green" />
  <rect x="0" y="0" width="200" height="200" fill="red" mask="url(#Mask)" />
</svg>

其中 `stop-color` 为白色，看似和遮罩没有关系，但是删除了遮罩就无效。`#Mack` 代表一个不透明度从 0 到 1 的遮罩。因为第二个红色矩形引用了此遮罩，所以它填充的颜色不透明度就会从 0 到 1。

## svg 图案的显隐

svg 的图案可以使用 `opacity` 来设置不透明度，比如：

```xml
<rect x="0" y="0" width="100" height="100" opacity=".5" />
```

同时，这个属性也可以使用在 css 中。

除此之外，还可以使用 css 的 `display:none`、`visibility:hidden` 等来隐藏 HTML5 中的 svg 元素。在 HTML 中，svg 元素的 `display` 默认都是 `inline`。
