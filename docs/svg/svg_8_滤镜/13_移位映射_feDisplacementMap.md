---
title: svg 移位映射 feDisplacementMap
createAt: 2021-08-26
slug: svg/filter/移位映射
publish: true
tags:
  - svg
  - 移位映射
  - feDisplacementMap
archives:
  - 专栏
  - svg
---

## 简介

`feDisplacementMap` 滤镜可以把通过一个图像的色彩来从新映射另一图像的位置。

关于这个滤镜，我并没有找到很好的示例，因为它并不是很灵活。

位置的映射公式如下：

$$
P'(x,y) = P( x + scale * (XC(x,y) - .5), y + scale * (YC(x,y) - .5)),记作 A
$$

这个公式并不是很难，_P'(x,y)_ 是新图的像素点，它由原图 _P_ 来决定，但是对应的点如上公式。

_XC_ 与 _YC_ 代表另一张图在同样像素点的某一通道色彩，默认是不透明度，当然也可以指定为其他颜色通道比如 R、G、B。

如果你指定的是一张不透明的图，那么 _XC(x,y) = YC(x,y) = 1_。也就是说，默认不透明图使用该滤镜公式可简化为：

$$
P'(x,y) = P( x + scale * .5, y + scale * .5),记作 B
$$

_scale_ 默认为 0，再简化即为：

$$
P'(x,y) = P( x , y)
$$

那不就是原图嘛。

上面的 _XC_、_YC_ 和 _scale_ 都是可以使用参数设置的，这个滤镜还有一个参数 `in2`，用了确定参考图的输入源。

## 属性

### in2

`in2` 属性用来设置参考图的输入源。

### scale

公式中的 _scale_ 常量可以通过 `scale` 属性来设置到滤镜中。

从简介中的 B 式来看，它的大小会影响到映射后的图的偏移程度，越远离 0，那么最终偏移效果就越大。

### xChannelSelector

这个属性用来设置 _XC_ 函数选择那个颜色通道的数值，默认值为 `A`，即 alpha 不透明度通道。它的可选值有：

```
xChannelSelector = "R | G | B | A"
```

如果 `in2` 源是不透明的，并且 `xChannelSelector` 属性使用默认值，那么图像就会根据 X 轴进行线性偏移。

但若参考图的某一色彩通道，并且使用该通道作为 `xChannelSelector` 属性的值，那么结果图就会在 X 轴上进行杂乱伸缩。

### yChannelSelector

这个属性用来设置 _YC_ 函数选择那个颜色通道的数值，默认值为 `A`，即 alpha 不透明度通道。它的可选值有：

```
yChannelSelector = "R | G | B | A"
```

[参考 xChannelSelector。](#xChannelSelector)

## 示例

### 示例 1 平行移动

如果使用不透明的图像作为参考图，那么计算就是采用简介中的 B 式，结果图会平行移动：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="feDisplacementMap-1">
			<feFlood flood-color="#000" result="feFlood-1"></feFlood>
			<feDisplacementMap in="SourceGraphic" in2="feFlood-1" xChannelSelector="A" yChannelSelector="A">
				<animate attributeName="scale" values="-5;5;-5" dur="10s" repeatCount="indefinite" />
			</feDisplacementMap>
		</filter>
	</defs>
	<image
		x="0"
		y="0"
		width="10"
		height="10"
		xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
		filter="url(#feDisplacementMap-1)"
	></image>
</svg>
```

为了更清楚演示效果，这里使用了一个动画 `<animate>` 元素，它的作用就是让 `feDisplacementMap` 的 `scale` 属性从 -5 过渡到 5，从而实现动画效果。最终渲染结果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="feDisplacementMap-1">
			<feFlood flood-color="#000" result="feFlood-1"></feFlood>
			<feDisplacementMap in="SourceGraphic" in2="feFlood-1" xChannelSelector="A" yChannelSelector="A">
				<animate attributeName="scale" values="-5;5;-5" dur="10s" repeatCount="indefinite" />
			</feDisplacementMap>
		</filter>
	</defs>
	<image
		x="0"
		y="0"
		width="10"
		height="10"
		xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
		filter="url(#feDisplacementMap-1)"
	></image>
</svg>

### 示例 2 利用图形自身进行位移

下面代码使用了图像自身进行位移，会得到一些稀奇古怪的效果：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="feDisplacementMap-2">
			<feDisplacementMap
				in="SourceGraphic"
				in2="SourceGraphic"
				scale="50"
				xChannelSelector="R"
				yChannelSelector="R"
			>
			</feDisplacementMap>
		</filter>
	</defs>
	<image
		x="0"
		y="0"
		width="10"
		height="10"
		xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
		filter="url(#feDisplacementMap-2)"
	></image>
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="feDisplacementMap-2">
			<feDisplacementMap
				in="SourceGraphic"
				in2="SourceGraphic"
				scale="50"
				xChannelSelector="R"
				yChannelSelector="R"
			>
			</feDisplacementMap>
		</filter>
	</defs>
	<image
		x="0"
		y="0"
		width="10"
		height="10"
		xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
		filter="url(#feDisplacementMap-2)"
	></image>
</svg>

## 小结

它的设置感觉比较局限，图像总体偏移在 X 轴与 Y 轴上，这点它是线性的。所以前面两个示例总体上都是在左上角到右下角这条对角线上进行位移，受到了公式的限制。

我尝试过使用径向来作为参考源，效果不大，结果都是扭曲的。

这个滤镜的核心就是通过另一张图片的色彩对当前图的像素点位置进行从新分配。想要合理使用该滤镜，我想应该得到不错的参考图才行。下一节介绍 `feTurbulence` 滤镜时引用了此滤镜做出了浪花效果。

## 参考

- [Filter primitive ‘feDisplacementMap’][1]

- [animate][2]

[1]: https://www.w3.org/TR/SVG11/filters.html#feDisplacementMapElement
[2]: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/animate
