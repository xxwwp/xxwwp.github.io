---
title: svg 形态 feMorphology
createAt: 2021-08-27
slug: svg/filter/形态
publish: true
tags:
  - svg
  - 形态
  - feMorphology
  - 轮廓增肥
  - 轮廓增粗
archives:
  - 专栏
  - svg
---

## 简介

> Morphology 被译为 “形态、形态学”。

`feMorphology` 滤镜用来修改图像的线条感，它可以让图像的轮廓 “增肥” 或者 “细化”。

如果如下几乎没有明显的轮廓，那么这个滤镜效果不大，它适合处理图像中明显的线条部分，简单的比如文字加粗，文字减细等等。

## 属性

`feMorphology` 滤镜有 `operator` 和 `radius` 两个属性，分别用来设置图形形态模式与变换大小。

### operator

`operator` 属性用来设置图像轮廓是侵蚀（变薄）还是扩张（变胖），默认值 `erode`，它有两个值：

```
operator = "erode | dilate"
```

`erode` 对应侵蚀效果，`dilate` 对应扩张效果。

### radius

`radius` 属性用来设置操作半径。如果设置两个值（用逗号隔开），那么第一个值为 X 轴半径，第二个值为 Y 轴半径，如果仅设置一个值，那么该值会同时作用 X 轴与 Y 轴。默认值为 0。

## 示例

下面示例依次演示了原图、形态腐蚀和形态扩张三种效果：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="600" viewBox="0 0 10 30">
	<defs>
		<filter id="dilate">
			<feMorphology operator="dilate" radius="0.03"></feMorphology>
		</filter>
		<filter id="erode">
			<feMorphology operator="erode" radius="0.03"></feMorphology>
		</filter>
		<g id="Image">
			<image
				x="1"
				y="1"
				width="9"
				height="9"
				xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
			></image>
		</g>
	</defs>
	<use xlink:href="#Image"></use>
	<use xlink:href="#Image" transform="translate(0 10)" filter="url(#dilate)"></use>
	<use xlink:href="#Image" transform="translate(0 20)" filter="url(#erode)"></use>
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="600" viewBox="0 0 10 30">
	<defs>
		<filter id="dilate">
			<feMorphology operator="dilate" radius="0.03"></feMorphology>
		</filter>
		<filter id="erode">
			<feMorphology operator="erode" radius="0.03"></feMorphology>
		</filter>
		<g id="Image">
			<image
				x="1"
				y="1"
				width="9"
				height="9"
				xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
			></image>
		</g>
	</defs>
	<use xlink:href="#Image"></use>
	<use xlink:href="#Image" transform="translate(0 10)" filter="url(#dilate)"></use>
	<use xlink:href="#Image" transform="translate(0 20)" filter="url(#erode)"></use>
</svg>

## 参考

- [Filter primitive ‘feMorphology’][1]

[1]: https://www.w3.org/TR/SVG11/filters.html#feMorphologyElement
