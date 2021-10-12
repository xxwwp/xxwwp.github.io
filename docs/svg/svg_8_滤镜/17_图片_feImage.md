---
title: svg 图片 feImage
createAt: 2021-08-27
slug: svg/filter/图片
publish: true
tags:
  - svg
  - 图片
  - feImage
archives:
  - 专栏
  - svg
---

## 简介

`feImage` 用来在滤镜中引入一张图片，并把像素数据作为输出。

因为 `feImage` 会输出像素，所以把其他 svg 当做图片引入时就会丢失矢量性。[MDN][1] 上称这个叫做栅格化。

它有两个专有属性 `xlink:href` 和 `preserveAspectRatio`。

`xlink:href` 用来设置图形的资源路径。

`preserveAspectRatio` 用来设置资源的对其和缩放方式，这个属性并不难，但是值太多了，可以查看 [W3C][2] 或者 [MDN][3] 文档。

## 示例

该滤镜几乎没有难度，简单使用如下：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="500" height="500" viewBox="0 0 10 10">
	<defs>
		<filter id="Image-1">
			<feImage
				xlink:href="/imgs/test1.jpg"
				preserveAspectRatio="xMaxYMid slice"
			></feImage>
		</filter>
		<filter id="Image-2">
			<feImage
				xlink:href="/imgs/test1.jpg"
				width="2"
				height="8"
				preserveAspectRatio="none"
			></feImage>
		</filter>
	</defs>
	<rect x="0" y="0" height="2" width="10" filter="url(#Image-1)"></rect>
	<rect x="0" y="3" height="8" width="2" filter="url(#Image-2)"></rect>
	<rect x="3" y="3" height="8" width="8" filter="url(#Image-1)"></rect>
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="500" height="500" viewBox="0 0 10 10">
	<defs>
		<filter id="Image-1">
			<feImage
				xlink:href="/imgs/test1.jpg"
				preserveAspectRatio="xMaxYMid slice"
			></feImage>
		</filter>
		<filter id="Image-2">
			<feImage
				xlink:href="/imgs/test1.jpg"
				width="2"
				height="8"
				preserveAspectRatio="none"
			></feImage>
		</filter>
	</defs>
	<rect x="0" y="0" height="2" width="10" filter="url(#Image-1)"></rect>
	<rect x="0" y="3" height="8" width="2" filter="url(#Image-2)"></rect>
	<rect x="3" y="3" height="8" width="8" filter="url(#Image-1)"></rect>
</svg>

根据全局属性 `x`、`y`、`width`、`height` 和专有属性 `preserveAspectRatio` 的跳转，你可以使用各种方式引入一张图片。

## 参考

- [feImage][1]

- [The ‘preserveAspectRatio’ attribute][2]

- [preserveAspectRatio][3]

[1]: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feImage
[2]: https://www.w3.org/TR/SVG11/coords.html#PreserveAspectRatioAttribute
[3]: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/preserveAspectRatio
