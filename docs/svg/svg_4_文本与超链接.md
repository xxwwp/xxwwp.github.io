---
title: svg 文本与超链接
createAt: 2021-08-10
slug: svg/文本与超链接
publish: true
tags:
  - svg
  - 文本
  - text
  - link
  - 超链接
archives:
  - 专栏
  - svg
---

**svg 中有两种文本模式，一种是写在图像中的文本，另一种是 svg 字体。本节只探讨前者。**

## 文本

在 svg 中内嵌一个文本使用 `<text>` 元素，它的内部文本会被渲染，可以通过属性 `x` 和 `y` 来对其进行简单的定位，比如：

```xml
<text x="10" y="10">我不懂我们是否有着各自的命运，还是我们生命中的偶然，像在风中飘，或许两者同时发生。——《阿甘正传》</text>
```

可以使用 `text-anchor` 来对文字进行排列，它有这些可能值：`start`、`middle`、`end` 或 `inherit`，这个属性决定了文本基于 `x` 和 `y` 所在点的文本流方向。比如：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="400">
	<defs>
		<linearGradient id="Gradient-1" x1="0" x2="1" y1="0" y2="0">
			<stop stop-color="skyblue" offset="0%" />
			<stop stop-color="blue" offset="100%" />
		</linearGradient>
	</defs>
	<text x="60" y="50" text-anchor="start" font-size="30px" fill="url(#Gradient-1)">start</text>
	<circle r="3" cx="60" cy="50" />
	<text x="60" y="100" text-anchor="middle" font-size="30px" fill="url(#Gradient-1)">middle</text>
	<circle r="3" cx="60" cy="100" />
	<text x="60" y="150" text-anchor="end" font-size="30px" fill="url(#Gradient-1)">end</text>
	<circle r="3" cx="60" cy="150" />
	<text x="60" y="200" text-anchor="inherit" font-size="30px" fill="url(#Gradient-1)">inherit</text>
	<circle r="3" cx="60" cy="200" />
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="230">
	<defs>
		<linearGradient id="Gradient-1" x1="0" x2="1" y1="0" y2="0">
			<stop stop-color="skyblue" offset="0%" />
			<stop stop-color="blue" offset="100%" />
		</linearGradient>
	</defs>
	<text x="60" y="50" text-anchor="start" font-size="30px" fill="url(#Gradient-1)">start</text>
	<circle r="3" cx="60" cy="50" />
	<text x="60" y="100" text-anchor="middle" font-size="30px" fill="url(#Gradient-1)">middle</text>
	<circle r="3" cx="60" cy="100" />
	<text x="60" y="150" text-anchor="end" font-size="30px" fill="url(#Gradient-1)">end</text>
	<circle r="3" cx="60" cy="150" />
	<text x="60" y="200" text-anchor="inherit" font-size="30px" fill="url(#Gradient-1)">inherit</text>
	<circle r="3" cx="60" cy="200" />
</svg>

> 注意：svg 中的文本不会自动换行。

## 字体属性

> 文本的一个至关重要的部分是它显示的字体。SVG 提供了一些属性，类似于它们的 CSS 同行，用来激活文本选区。下列每个属性可以被设置为一个 SVG 属性或者成为一个 CSS 声明：font-family、font-style、font-weight、font-variant、font-stretch、font-size、font-size-adjust、kerning、letter-spacing、word-spacing 和 text-decoration。
>
> ---[MDN](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Texts#%E8%AE%BE%E7%BD%AE%E5%AD%97%E4%BD%93%E5%B1%9E%E6%80%A7)

都是 css 的属性，不在介绍。

需要注意的是，字体颜色依旧是 `fill`，并且 svg 文本支持使用 `stroke` 属性描边。

## `<tspan>` 子文本

可以使用 `<tspan>` 来描述一段文本中的子文本，比如高亮一个单词。

```xml
<text y="20">
	你可以像疯狗一样对周围的一切
	<tspan fill="red">愤愤不平</tspan>
	，你可以诅咒命运，但是等到最后一刻，你还得平静的放手而去。
	---《本杰明·巴顿奇事》
</text>
```

`tspan` 还有很多其他属性：

- `x`、`y` 用来设置文本距离原本位置的偏移量，这个值可以是一个数列，数列的值会逐一作用到字符上直到数列结束。使用 “`,`” 隔开。该 `tspan` 元素后续的文本会受到最终定位的影响。

- `dx`、`dy` 同上，但是使用的是相对距离。

- `rotate` 旋转字符的角度，注意是字符，不是整段文本。也可以使用数列，数列的值会逐一作用到字符上。如果数列不足，`tspan` 内的后续文本会按照最后一个角度旋转，旋转效果不会超出 `tspan` 元素。

- `textLength` 用以设置文本的最低长度，当不足时自动填充空隙。

示例：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="400" height="200">
	<defs>
		<lineargradient id="gradient-3" x1="0" x2="1" y1="0" y2="0">
			<stop stop-color="skyblue" offset="0%" />
			<stop stop-color="blue" offset="100%" />
		</lineargradient>
		<style type="text/css">
			tspan {
				fill: url(#gradient-3);
				text-anchor: middle;
			}
		</style>
	</defs>
	<text>
		<tspan x="200" y="30" font-size="20">
			山园小梅二首
			<tspan dy="5" font-size="12" fill="silver">（其一）</tspan>
		</tspan>
		<tspan x="200" y="60" textlength="300">众芳摇落独暄妍，占尽风情向小园。</tspan>
		<tspan x="200" y="90" textlength="300">疏影横斜水清浅，暗香浮动月黄昏。</tspan>
		<tspan x="200" y="120" textlength="300">霜禽欲下先偷眼，粉蝶如知合断魂。</tspan>
		<tspan x="200" y="150" textlength="300">幸有微吟可相狎，不须檀板共金樽。</tspan>
	</text>
</svg>
```

效果图：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="400" height="200">
	<defs>
		<lineargradient id="gradient-3" x1="0" x2="1" y1="0" y2="0">
			<stop stop-color="skyblue" offset="0%" />
			<stop stop-color="blue" offset="100%" />
		</lineargradient>
		<style type="text/css">
			tspan {
				fill: url(#gradient-3);
				text-anchor: middle;
			}
		</style>
	</defs>
	<text>
		<tspan x="200" y="30" font-size="20">
			山园小梅二首
			<tspan dy="5" font-size="12" fill="silver">（其一）</tspan>
		</tspan>
		<tspan x="200" y="60" textlength="300">众芳摇落独暄妍，占尽风情向小园。</tspan>
		<tspan x="200" y="90" textlength="300">疏影横斜水清浅，暗香浮动月黄昏。</tspan>
		<tspan x="200" y="120" textlength="300">霜禽欲下先偷眼，粉蝶如知合断魂。</tspan>
		<tspan x="200" y="150" textlength="300">幸有微吟可相狎，不须檀板共金樽。</tspan>
	</text>
</svg>

## `<tref>` 文本引用

使用 `<tref>` 可以引用已经定义的文本，并可以重新修改样式。

示例：

```xml
<text id="example">This is an example text.</text>

<text>
    <tref xlink:href="#example" />
</text>
```

## textPath

使用 `<textPath>` 元素的 `xlink:href` 属性可以根据任意路径对齐字符，比如让字体环绕在圆弧，贝塞尔曲线上，形成环绕。

示例：

```xml
<path id="my_path" d="M 20 100 c 50,80 100,-80 150,0" fill="transparent" />
<text>
	<textPath xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#my_path" fill="tomato">这是一段飘着跑的文本段落</textPath>
</text>
```

效果大致如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
	<path id="my_path" d="M 20 100 c 50,80 100,-80 150,0" fill="transparent" />
	<text>
		<textPath xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#my_path" fill="tomato">这是一段飘着跑的文本段落</textPath>
	</text>
</svg>

> 如果文本长度超过了路径长度会被隐藏。

## 超链接

svg 中的超链接和 HTML 中类似，用于跳转到一个 URL 上。

它还可以用来包裹其他图形，如 `rect`、`circle` 等，不过它不能直接包裹文本，包裹文本需要借助 `text` 元素。超链接的地址使用 `xlink:href` 来指定。

可以在 [MDN][1] 上找到其使用示例。

## 参考

- [a][1]

[1]: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/a
