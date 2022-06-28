---
title: svg 滤镜 filter
createAt: 2021-08-11
slug: /docs/svg/滤镜
publish: true
tags:
  - svg
  - 滤镜
  - filter
  - 位置
  - 尺寸
  - filterunits
archives:
  - 专栏
  - svg
---

## 简介

svg 中的滤镜功能十分丰富，它以多种方式修改原图案，已达到不同的效果，例如毛玻璃特效、高斯模糊、泛色、光照等等。

svg 中的滤镜使用 `<filter>` 元素定义，不同的滤镜使用不同内部元素，svg 提供以下滤镜：

- `<feBlend>`：混合，用来把两个对象混合在一起，类似图像编辑软件中图层的混合。

- `<feColorMatrix>`：色彩矩阵，使用矩阵乘法重新计算每个像素 rgba 的值，形成新的颜色。

- `<feComponentTransfer>`：颜色分量重映射，用来重新定义颜色通道的分布。适用于亮度、对比度，色彩平衡或阈值的操作。

- `<feFuncR>`：用于配合 `<feComponentTransfer>` 来指定 R 通道的分布。

- `<feFuncG>`：用于配合 `<feComponentTransfer>` 来指定 G 通道的分布。

- `<feFuncB>`：用于配合 `<feComponentTransfer>` 来指定 B 通道的分布。

- `<feFuncA>`：用于配合 `<feComponentTransfer>` 来指定不透明度 alpha 通道的分布。

- `<feComposite>`：智能合成，使用两个图像进行像素组合，也可用于类似剪裁，求两图的交并补集操作。

- `<feConvolveMatrix>`：卷积矩阵，使用一个卷积核来确定目标像素与其相邻像素的关系。常用场景有模糊、边缘检测、锐化、压花、斜角和浮雕等等。

- `<feDiffuseLighting>`：漫反射光照。

- `<feSpecularLighting>`：镜面反射光照。

- `<feDistantLight>`：远光光源。

- `<fePointLight>`：点光源。

- `<feSpotLight>`：聚光光源。

- `<feDisplacementMap>`：映射置换。使用一个图像的颜色对另一个图像的像素位置进行偏移。可以造成扭曲，撕裂效果。

- `<feDropShadow>`：投影滤镜。用于生成图像的投影。

- `<feFlood>`：泛色滤镜。用于生成一个矩形的颜色区域。

- `<feGaussianBlur>`：高斯模糊。用于给图像产生高斯模糊。

- `<feImage>`：图片滤镜。用于在滤镜中引入一张图片。

- `<feMerge>`：合并，用于合并多个源的结果。常用来把多个滤镜与原图像进行合并。

- `<feMergeNode>`：合并节点。用于在合并中设置其中一个源的信息。

- `<feMorphology>`：形态调整。用于修整图像的轮廓清晰度。

- `<feOffset>`：偏移。对输入源进行偏移。

- `<feTile>`：瓦砾。对滤镜效果进行堆砌，平铺。类似 `<pattern>` 元素。

- `<feTurbulence>`：噪点滤镜。生成紊乱的图像，一般用于配合其他滤镜模拟云纹、大理石纹理等特效，也可配合动画生成波浪荡漾的感觉。

上述滤镜必须都定义在 `<filter>` 元素中，使用格式类似：

```xml
<defs>
	<filter id="ExFilter">
		<滤镜1 result="filter-1"></滤镜1>
		<滤镜2 in="filter-1" result="filter-2"></滤镜2>
		<滤镜3 result="filter-3"></滤镜3>
		<滤镜4 in="filter-2" in2="filter-3"></滤镜4>
	</filter>
</defs>

<图像 filter="url(#ExFilter)"></图像>
```

注意看，一般 `<filter>` 写在 `<defs>` 中，为了引用滤镜，还需要给滤镜设置一个 `id`。

在 `<filter>` 中用于设置各种滤镜的组合。**`in`、`in2` 代表滤镜的输入源，但是并不是所有滤镜都有这两个属性，部分滤镜不需要输入源。`result` 属性指定滤镜的输入源，一个输出源可以作为其他滤镜的输入源，`<filter>` 会使用最后一个滤镜作为输出源，不论是否设置 `result`。**

## filter

`<filter>` 元素用来定义一个滤镜，其他图案使用滤镜时，可以通过 `<filter>` 元素的 id 属性来引用。同时，`<filter>` 也有一个叫 `filterUnits` 滤镜单元的属性，它用来定义滤镜尺寸的大小控制。

`filterUnits` 有以下可用值：

> - `userSpaceOnUse`
>
>   x, y, width 和 height 表示当前坐标系统中的值，这些值表示 \<filter\>元素在当前用户坐标系中的位置和大小(例如通过 filter 引用该 \<filter\>元素的元素所在的坐标系系统).
>
> - `objectBoundingBox`
>
>   在这种情况下,x, y, width 和 height 表示引用 \<filter\> 元素的元素的 baow 包围盒的分数或百分比.
>
> ---[MDN][2]

其他图案引用一个滤镜使用的是 `filter` 属性，这个属性可以在 css 中使用，比如：

```xml
<svg viewBox="0 0 10 10" wdith="200" height="200" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<filter id="shadow">
			<feDropShadow dx="0.2" dy="0.4" stdDeviation="0.2" />
		</filter>
	</defs>
	<rect x="0" y="0" width="100%" height="100%" fill="white" />
	<circle cx="5" cy="50%" r="4" style="fill: pink; filter: url(#shadow)" />
</svg>
```

上面的代码中，使用了一个阴影滤镜，并绘制了一个圆来引用它，此时圆形的背部会产生一个阴影效果。效果如下：

<svg viewBox="0 0 10 10" wdith="200" height="200" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<filter id="shadow">
			<feDropShadow dx="0.2" dy="0.4" stdDeviation="0.2" />
		</filter>
	</defs>
	<rect x="0" y="0" width="100%" height="100%" fill="white" />
	<circle cx="5" cy="50%" r="4" style="fill: pink; filter: url(#shadow)" />
</svg>

> `filter` 属性用来引用滤镜，它同时是元素属性也是 css 属性，两种方式都可以使用。

**滤镜也可以设置大小和位置，通过 `x`、`y`、`height`、`width` 可以设置滤镜的位置，需要注意的是，使用偏移滤镜等效果时，需要把滤镜设置得比目标对象还大，不然会查看不到偏移后的效果。**

## filter 属性

[参考](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute#filters_attributes)

### 位置与尺寸

`filter` 元素有 4 个属性用于设置定位和大小：`x`、`y`、`width`、`height`。

**`x`、`y` 用于定义滤镜的起始位置，`width`、`height` 用于定义滤镜的大小。**

大部分情况下不需要设置，滤镜默认会填充整个作用对象，并有一定延展。但是特殊情况例外，比如设置阴影滤镜，并且阴影偏移量太大的情况，此时部分阴影因为超出了默认大小区域就发生了截断。

也有部分时候会缩小滤镜区域，根据情况而定。

### 单位 filterUnits

可以使用 `filterunits` 属性来设置 `<filter>` 元素尺寸的单位，在本文 [filter](#filter) 中有介绍。

你可以按照 svg 大小来设置滤镜的大小，这种时候单位是很直观的。比如 `viewBox="0 0 10 10"`，当 `filterUnits` 为 `userSpaceOnUse` 时，那么 `width` 和 `height` 也为 `10` 的时候，这个滤镜就正好是 svg 的大小。

你也可以按照对象大小进行单位设置，当 `filterUnits` 为 `objectBoundingBox` 时，单位会使用目标对象的大小进行百分比设置，比如此时 `width` 和 `height` 为 1，那么就正好是作用图像的大小。

### 其他属性

[参考 MDN][1]。

## 参考

- [filter][1]

- [filterUnits][2]

- [result][3]

[1]: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/filter
[2]: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/filterUnits
[3]: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/result
