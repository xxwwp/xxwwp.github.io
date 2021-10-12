---
title: svg 噪点 feTurbulence
createAt: 2021-08-27
slug: svg/filter/噪点
publish: true
tags:
  - svg
  - 噪点
  - feTurbulence
archives:
  - 专栏
  - svg
---

## 简介

> _Turbulence \[ˈtɜːrbjələns\]_ 翻译是 “湍流、紊（wěn）乱” 的意思。

`feTurbulence` 直译并不是纹理，它会通过 Perlin Turbulence 函数来生成图像，生成类似大理石、云纹的纹理。

> 关于 [Perlin Turbulence 函数][1] 函数的具体实现这里不做探讨。

Perlin 噪声算法可以生成则乱无章的噪声数据，这些数据在微观上这些像连续的，宏观上又像离散的。就如同大理石表面一样，东一条西一条纹理，细看每条纹理是连续的，宏观上又是离散的。`feTurbulence` 滤镜就是用此算法来模拟杂乱无章的纹理。

你可以在 W3C 上看到有一个[很好的示例][o1]，它方便你对该滤镜有个基本认识。

## 属性

该滤镜依赖 Perlin 噪声算法，所以该滤镜的属性也是基于此算法的。

### baseFrequency

`baseFrequency` 属性用来设置噪声的频率，这个值越大，噪声越混乱，默认值为 0。如果设置两个数字，那么第一个数字表示 X 方向的频率，第二个值表示 Y 方向的频率。如果仅设置一个值，该值会同时作用两个方向的频率。

这个值不是越大越好，熵增的会带来混乱，但是混乱到一定程度也是一种稳定。就类似一首曲子的频率，如果评率高到 0.1 秒就谈完曲子，那么这个曲子也就是一个和音而已了。

### numOctaves

`numOctaves` 用来设置噪声的八度音程数，这个值越大，噪声看起来越自然，默认值为 1。

你可以理解为几个人产生的噪声和几百个人产生的噪声，几百个人产生的听起来就更自然些。

这个属性值过大的话会严重影响性能。

### seed

`seed` 用于提供一个随机数起点，从而生成不重样的噪点滤镜。

当其他属性都一样的时候，生成的噪点图也是同样的，如果你需要在同样配置的情况下，随机生成另一个噪点滤镜，可以使用该属性。

### stitchTiles

`stitchTiles` 这个属性用来定义噪声图块在边界的处理方式，默认值 `noStitch`，它有两个值：

```
stitchTiles = "stitch | noStitch"
```

当值为 `noStitch` 时，噪点的图块边界将不尝试实现平滑过渡效果，有时会因此在图块边界处出现明显的间断现象。

当设置为 `stitch` 时，上述的现象会自动调整，从而出现平滑过渡。这会造成额外的计算开销。

虽然这个值在 W3C 中是这样定义的，但是我在实际操作中发现上述的不连续现象很难发现，主要原因则是噪点少的时候都是连续的，噪点多的时候因为太混乱又发现不到。所以如果没有出现明显的不连续现象，这个值并不用设置为 `stitch`。

### type

`type` 属性用来设置该滤镜的渲染风格，默认值 `turbulence`，它有两个值：

```
type = "fractalNoise | turbulence"
```

当设置为 `fractalNoise` 滤镜的风格会更糊一些，像加了高斯模糊一样，整体也比较平滑，就像乌云刚刚铺满天上一样的云纹效果。

当设置为 `turbulence` 时，滤镜的风格是锐利，看上去更加离散。类似老式电视出故障时满屏的雪花或者大理石纹理效果。

## 示例

### 示例 1 官方示例

W3C 官方提供了一个[很好的示例][o1]，它直观的描述了，你也可以到[官方文档][2]查看这段示例的详细代码。

### 示例 2 浪花效果

下面使用了 `feTurbulence` 滤镜配合上一节的 `feDisplacementMap` 滤镜实现了类似浪花的效果，为了使浪花效果自然涌动起来，还需要一个关于 `feColorMatrix` 色彩矩阵旋转模式的动画。

```xml
<svg version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="500" height="500" viewBox="0 0 10 10">
	<defs>
		<filter id="feTurbulence-1">
			<feTurbulence
				baseFrequency="0.2"
				numOctaves="1"
				seed="2"
				stitchTiles="noStitch"
				type="fractalNoise"
				result="turbulenceResult"
			></feTurbulence>
			<feColorMatrix in="turbulenceResult" type="hueRotate" values="0" result="hueRotateResult">
				<animate attributeName="values" from="0" to="360" dur="3s" repeatCount="indefinite" />
			</feColorMatrix>
			<feDisplacementMap
				in="SourceGraphic"
				in2="hueRotateResult"
				scale="1"
				xChannelSelector="R"
				yChannelSelector="R"
				result="dispResult"
			></feDisplacementMap>
			<feOffset in="dispResult" dx="-0.3" dy="-0.3"></feOffset>
		</filter>
	</defs>
	<image
		x="0"
		y="0"
		width="10"
		height="10"
		xlink:href="/imgs/test1.jpg"
		filter="url(#feTurbulence-1)"
	></image>
</svg>
```

渲染效果如下：

<svg version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="500" height="500" viewBox="0 0 10 10">
	<defs>
		<filter id="feTurbulence-1">
			<feTurbulence
				baseFrequency="0.2"
				numOctaves="1"
				seed="2"
				stitchTiles="noStitch"
				type="fractalNoise"
				result="turbulenceResult"
			></feTurbulence>
			<feColorMatrix in="turbulenceResult" type="hueRotate" values="0" result="hueRotateResult">
				<animate attributeName="values" from="0" to="360" dur="3s" repeatCount="indefinite" />
			</feColorMatrix>
			<feDisplacementMap
				in="SourceGraphic"
				in2="hueRotateResult"
				scale="1"
				xChannelSelector="R"
				yChannelSelector="R"
				result="dispResult"
			></feDisplacementMap>
			<feOffset in="dispResult" dx="-0.3" dy="-0.3"></feOffset>
		</filter>
	</defs>
	<image
		x="0"
		y="0"
		width="10"
		height="10"
		xlink:href="/imgs/test1.jpg"
		filter="url(#feTurbulence-1)"
	></image>
</svg>

> 其中引用到了动画 [\<animate\>][3] 元素。

## 参考

- [Perlin noise][1]

- [Filter primitive ‘feTurbulence’][2]

- [animate][3]

[1]: https://en.wikipedia.org/wiki/Perlin_noise
[2]: https://www.w3.org/TR/SVG11/filters.html#feTurbulenceElement
[3]: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/animate
[o1]: https://www.w3.org/TR/SVG11/images/filters/feTurbulence.svg
