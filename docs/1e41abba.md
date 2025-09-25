---
id: 1e41abba-bb74-45e3-afa0-614599efa6f8
title: svg 基础变形
createAt: 2021-08-11
slug: /docs/svg/基础变形
publish: true
tags:
  - svg
  - g
  - use
  - transform
archives:
  - 专栏
  - svg
---

## `<g>`、`<use />` 元素

使用 `<g>` 元素可以把属性赋给一组 svg 元素，比如：

```xml
<g fill="red">
	<circle r="20" cx="30" cy="30" />
	<rect x="80" y="20" width="20" height="20" />
</g>
```

此时圆形和矩形区域都会填充红色。

但是它的功能远不止于此，它同时还是用来组合对象的容器，你可以把一些组合放到 `<g>` 元素中，然后给 `<g>` 元素一个 id 属性，之后可以使用 `<use />` 元素引用这个组合。

比如：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<g id="Image">
			<image
				x="0"
				y="0"
				width="9"
				height="9"
				xlink:href="/imgs/test1.jpg"
			/>
		</g>
	</defs>
	<use href="#Image" transform="translate(0,0)" />
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 10 20">
	<defs>
		<g id="Image">
			<circle r="3" cx="3" cy="5" fill="silver" />
			<circle r="3" cx="7" cy="5" fill="red" />
		</g>
	</defs>
	<use href="#Image" />
	<use href="#Image" transform="translate(0,10)" />
</svg>

其中 `transform` 就是下节的变换属性，`translate(0,10)` 代表让该对象向下偏移 10 个单位。

> `<g>` 元素也可以直接渲染，不用放到 `<defs>` 中。它的主要作用是用来组合对象，如果放到 `<defs>` 则会定义该组合对象。被 `<g>` 元素定义的对象可以被 `<use>` 元素多次引用。一般常常需要配合 `transform` 变化属性来偏移图案，不然多次引用会重叠在一起。

## `transform` 属性

`<g>` 元素可以编写 `transform` 属性，这个属性和 css 中的 `transform` 属性类似，它的值可以是以下函数或者以下函数的组合：

- `translate(x,y)` 沿坐标轴平移 x 和 y 个单位；
- `rotate` 旋转；
- `skewX` 与 `skewY`，斜切一定角度；
- `scale(x[,y])` 沿坐标缩放图形尺寸的百分比，1 就是 100%。如果不写 y 值，则 x 值代表两轴等比例缩放。
- `matrix` 线性变换，[参见这里](<https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function/matrix()>)

> 如果使用了变形，你会在元素内部建立了一个新的坐标系统，应用了这些变形，你为该元素和它的子元素指定的单位可能不是 1:1 像素映射。但是依然会根据这个变形进行歪曲、斜切、转换、缩放操作。

来个示例：

```xml
<g fill="red" transform="rotate(45) scale(2,1)">
	<circle r="20" cx="50" cy="30" />
	<rect x="80" y="20" width="20" height="20" />
</g>
```

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
	<g fill="red" transform="rotate(45) scale(2,1)">
		<circle r="20" cx="50" cy="30" />
		<rect x="80" y="20" width="20" height="20" />
	</g>
</svg>
