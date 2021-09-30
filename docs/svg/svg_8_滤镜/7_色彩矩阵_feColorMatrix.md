---
title: svg 色彩矩阵 feColorMatrix
createAt: 2021-08-18
slug: svg/filter/色彩矩阵
publish: true
tags:
  - svg
  - 滤镜
  - 色彩矩阵
  - feColorMatrix
  - color
  - matrix
archives:
  - 专栏
  - svg
---

## 认识

色彩矩阵采用矩阵乘法来对图案从新进行色彩计算，它可以重新计算 R、G、B、A 四个值的比重。

比如说你不想去掉蓝光，又或者希望得到一张黑白图，又或者改变明暗度等等，都可以使用色彩矩阵来实现。

`<fecolormatrix>` 接收一个矩阵值来重新计算颜色，大致长这么个样子：

```xml
<feColorMatrix
	type="matrix"
	values="
		1 0 0 0 0
		0 1 0 0 0
		0 0 1 0 0
		0 0 0 1 0"
/>
```

当然，也可以使用 `type` 属性来改变值的分配方式，在此之前，先搞清楚色彩矩阵的计算方式。

## 计算

> 色彩矩阵使用的是矩阵乘法，可以自行手术计算方式。

每个色彩由 R、G、B、A（红、绿、蓝、不透明度）四个值组成，色彩矩阵通过矩阵乘法从新计算这四种颜色在每个像素点中的比重，从而实现颜色的改变。

色彩矩阵中的颜色遵循以下计算方式：

$$
\begin{vmatrix}
	R' \\
	G' \\
	B' \\
	A' \\
	1
\end{vmatrix}
=
\begin{vmatrix}
	r_1 && r_2 && r_3 && r_4 && r_5 \\
	g_1 && g_2 && g_3 && g_4 && g_5 \\
	b_1 && b_2 && b_3 && b_4 && b_5 \\
	a_1 && a_2 && a_3 && a_4 && a_5 \\
	0 && 0 && 0 && 0 && 1 \\
\end{vmatrix}
\cdot
\begin{vmatrix}
	R \\
	G \\
	B \\
	A \\
	1
\end{vmatrix}
$$

最后计算得到的结果是：

$$
\begin{aligned}
R' &= r_1 * R + r_2 * G + r_3 * B + r_4 * A + r_5 \\
G' &= g_1 * R + g_2 * G + g_3 * B + g_4 * A + g_5 \\
B' &= b_1 * R + b_2 * G + b_3 * B + b_4 * A + b_5 \\
A' &= a_1 * R + a_2 * G + a_3 * B + a_4 * A + a_5
\end{aligned}
$$

简单拿个红色来说，新的色值中，红色 R' 的值是和原本该像素的其他颜色也挂钩的，比如你想降低红色的比重，那么 r1 的值就可以设置得小一些，那么新颜色的红色比重就会降低。假设 R' 如下：

$$
\begin{aligned}
R' &= 0.5R + 0G + 0B + 0A + 0 \\
R' &= 0.5R
\end{aligned}
$$

那么该滤镜作用后，红色的比重将会降到原来的一半。

同时我们可以改变其他矩阵值从而实现特殊的效果，比如：

$$
\begin{aligned}
R' &= 0R + 0G + 1B + 0A + 0 \\
R' &= 1B
\end{aligned}
$$

此时一个像素点中的红色完全是有蓝色比重决定的，也就是说，图案中的原本蓝色部分会泛红，同时，原本的红色将丢失。

如果你想让图案变得暖洋洋的怎么做？那就加重红色的比重，比如：

$$
\begin{aligned}
R' &= 1R + 1G + 1B + 0A + 0 \\
R' &= 1R + 1G + 1B
\end{aligned}
$$

此时一个色值中，绿色和蓝色也会增强红色调，最后就会得到暖洋洋的团。

## 简单用例

现在把上面的值带入实际效果中：

```xml
<svg
	version="1.1"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	width="200"
	height="400"
	viewBox="0 0 10 20">
	<defs>
		<g id="Image">
			<image
				x="0"
				y="0"
				width="9"
				height="9"
				xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
			/>
		</g>
		<filter id="ColorMatrix-1">
			<feColorMatrix
				type="matrix"
				values="
					1 1 1 0 0
					0 1 0 0 0
					0 0 1 0 0
					0 0 0 1 0"
			/>
		</filter>
	</defs>
	<use href="#Image" transform="translate(0,0)" />
	<use href="#Image" transform="translate(0,10)" filter="url(#ColorMatrix-1)" />
</svg>
```

上面我们定义了一张图片，和一个色彩矩阵滤镜，可以明显的看到色彩矩阵中加重了红色的比重，所以使用滤镜后的图片就会显得更红一些。效果如下：

<svg
	version="1.1"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	width="200"
	height="400"
	viewBox="0 0 10 20">
<defs>
<g id="Image">
<image
				x="0"
				y="0"
				width="9"
				height="9"
				xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
			/>
</g>
<filter id="ColorMatrix-1">
<feColorMatrix
				type="matrix"
				values="
					1 1 1 0 0
					0 1 0 0 0
					0 0 1 0 0
					0 0 0 1 0"
			/>
</filter>
</defs>
<use href="#Image" transform="translate(0,0)" />
<use href="#Image" transform="translate(0,10)" filter="url(#ColorMatrix-1)" />
</svg>

有一些特殊情况的举证值如下：

- 原色：

$$
\begin{vmatrix}
	1 && 0 && 0 && 0 && 0 \\
	0 && 1 && 0 && 0 && 0 \\
	0 && 0 && 1 && 0 && 0 \\
	0 && 0 && 0 && 1 && 0 \\
	0 && 0 && 0 && 0 && 0 \\
\end{vmatrix}
$$

- 黑白（会稍微偏黑一点）：

$$
\begin{vmatrix}
	0.3 && 0.3 && 0.3 && 0 && 0 \\
	0.3 && 0.3 && 0.3 && 0 && 0 \\
	0.3 && 0.3 && 0.3 && 0 && 0 \\
	0 && 0 && 0 && 1 && 0 \\
	0 && 0 && 0 && 0 && 0 \\
\end{vmatrix}
$$

上面的矩阵之所以能让图案变得黑白，是因为新颜色的 rgb 三种色彩比重是相同的，但是 (0.3 + 0.3 + 0.3) = 0.9，丢失了 0.1 的色彩的总值，导致色彩最后偏向 `#000`，所以会稍微黑一点

> 色彩矩阵的确简化了中间步骤，但是一堆数字还是很难直接对应到色彩转换上，每个矩阵的实际结果还是要思维一下。

## type 属性

色彩矩阵还有一个 `type` 属性，它用来表示矩阵运算的类型。它的值类型为：

```
type = "matrix | saturate | hueRotate | luminanceToAlpha"
```

它们各自的矩阵计算方式可以在 [W3C](https://www.w3.org/TR/SVG11/filters.html#feColorMatrixTypeAttribute) 中查看。

### matrix 默认值

`matrix` 是 `type` 属性的默认值。表示需要提供一个完整的 5 \* 4 的矩阵。其他关键字是一些特殊矩阵值的快捷方式，其他矩阵值允许不指定完整矩阵的情况下完成矩阵运算工作。矩阵每个值使用空白符分割，可以是空格符，也可以是换行符制表符等。

### saturare 饱和度

`saturare` 值代表饱和度，使用这个值时，`values` 属性只需要传入一个数值即可，若是想把图案颜色更鲜艳一些，可以把 `values` 设置成大于 1 的值，比如：

```xml
<!--  -->
<feColorMatrix type="saturate" values="0" />
```

### hueRotate 色彩旋转

`hueRotate` 为色彩旋转矩阵，它使用三角函数对矩阵进行重新计算。色彩矩阵旋转基于色环旋转原图中的色彩。

色彩旋转会根据某个[色环（色轮）](https://zh.wikipedia.org/wiki/%E8%89%B2%E7%92%B0)进行颜色的旋转，使用不同的色环旋转之后的色彩并不一定相同，在 Adobe Color 有通过色环选择颜色的[工具](https://color.adobe.com/zh/create/color-wheel)，可以更直观的了解色环。

该矩阵和 css 中的 `filter:hue-rotate(x)` 功能类似，都是旋转色彩，[详见这里](https://www.quackit.com/css/functions/css_hue-rotate_function.cfm)。但是 css 使用的色环和 svg 中不同，所以旋转后的颜色不完全相同，只是类似。

`type="hueRotate"` 时，`values` 属性将设定会一个角度值，类型为一个数字，比如 `180` 就代表旋转 180°。

示例，把一张图片和一个纯色矩形区域进行 180° 的色彩旋转：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="600" viewBox="0 0 10 30">
	<defs>
		<g id="Image">
			<image
				x="0"
				y="0"
				width="9"
				height="9"
				xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
			/>
		</g>
		<filter id="HueRotate-1">
			<feColorMatrix type="hueRotate" values="180" />
		</filter>
	</defs>
	<use href="#Image" transform="translate(0,0)" />
	<use href="#Image" transform="translate(0,10)" filter="url(#HueRotate-1)" />
	<rect x="0" y="20" width="5" height="5" fill="red" />
	<rect x="0" y="25" width="5" height="5" fill="red" filter="url(#HueRotate-1)" />
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="600" viewBox="0 0 10 30">
	<defs>
		<g id="Image">
			<image
				x="0"
				y="0"
				width="9"
				height="9"
				xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
			/>
		</g>
		<filter id="HueRotate-1">
			<feColorMatrix type="hueRotate" values="180" />
		</filter>
	</defs>
	<use href="#Image" transform="translate(0,0)" />
	<use href="#Image" transform="translate(0,10)" filter="url(#HueRotate-1)" />
	<rect x="0" y="20" width="5" height="5" fill="red" />
	<rect x="0" y="25" width="5" height="5" fill="red" filter="url(#HueRotate-1)" />
</svg>

### luminanceToAlpha 阿尔法亮度

`luminanceToAlpha` 是阿尔法亮度，该矩阵会丢失所有颜色，原图颜色深浅与结果图的不透明度成正比，类似胶片相机的底片效果。这个矩阵类型不需要使用 `values` 属性。

尝试对一张图片使用该矩阵，会发现丢失所有颜色，并且浅色的区域会透明：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="400" viewBox="0 0 10 20">
	<defs>
		<g id="Image">
			<image
				x="0"
				y="0"
				width="9"
				height="9"
				xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
			/>
		</g>
		<filter id="luminanceToAlpha-1">
			<feColorMatrix type="luminanceToAlpha" values="180" />
		</filter>
	</defs>
	<use href="#Image" transform="translate(0,0)" />
	<use href="#Image" transform="translate(0,10)" filter="url(#luminanceToAlpha-1)" />
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="400" viewBox="0 0 10 20">
	<defs>
		<g id="Image">
			<image
				x="0"
				y="0"
				width="9"
				height="9"
				xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
			/>
		</g>
		<filter id="luminanceToAlpha-1">
			<feColorMatrix type="luminanceToAlpha" values="180" />
		</filter>
	</defs>
	<use href="#Image" transform="translate(0,0)" />
	<use href="#Image" transform="translate(0,10)" filter="url(#luminanceToAlpha-1)" />
</svg>

## 小结

色彩矩阵十分复杂，但是功能也非常强大，对亮度、饱和度、明暗、色彩旋转等做了很好的支持。
