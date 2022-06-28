---
title: svg 泛色 feFlood
createAt: 2021-08-18
slug: /docs/svg/filter/泛色
publish: true
tags:
  - svg
  - 滤镜
  - 泛色
  - feFlood
  - flood-color
  - flood-opacity
archives:
  - 专栏
  - svg
---

使用 `<feFlood>` 滤镜可以在矩形滤镜区域内进行泛色填充，`<feFlood>` 的填充的区域始终是一个矩形。它的效果类似遮罩 `<mask>`。

它有两个属性分别是：

- `flood-color` 这个属性用来设置填充颜色；

- `flood-opacity` 这个属性用来设置填充颜色的不透明度。

示例：

```xml
<svg version="1.1"
	xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="300" viewBox="0 0 10 15">
	<defs>
		<g id="Image">
			<image
				x="0"
				y="0"
				width="10"
				height="10"
				xlink:href="/imgs/test1.jpg"
			/>
		</g>
		<filter id="Flood-1">
			<feFlood flood-color="shadow" flood-opacity=".3" />
		</filter>
	</defs>
	<use href="#Image" transform="translate(0,0)" />
	<rect x="0" y="0" width="10" height="10" filter="url(#Flood-1)" transform="translate(6,0)" />
	<path d="M 5 5 l 3 8 l -6 0 z" filter="url(#Flood-1)" />
</svg>
```

上面的代码中，使用来 `<rect>` 和 `<path>` 元素引入填充滤镜，但是最后的效果都是矩形。填充滤镜漂浮在原图上方，滤镜重叠的地方产生了叠加效果。渲染结果如下：

<svg version="1.1"	xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="300" viewBox="0 0 10 15">
	<defs>
		<g id="Image">
			<image
				x="0"
				y="0"
				width="10"
				height="10"
				xlink:href="/imgs/test1.jpg"
			/>
		</g>
		<filter id="Flood-1">
			<feFlood flood-color="shadow" flood-opacity=".3" />
		</filter>
	</defs>
	<use href="#Image" transform="translate(0,0)" />
	<rect x="0" y="0" width="10" height="10" filter="url(#Flood-1)" transform="translate(6,0)" />
	<path d="M 5 5 l 3 8 l -6 0 z" filter="url(#Flood-1)" />
</svg>

> 这个滤镜不要直接作用在目标对象上。比如一张图片，如果直接使用该滤镜，那么图片会完全被滤镜覆盖。
