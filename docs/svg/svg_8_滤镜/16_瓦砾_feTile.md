---
title: svg 瓦砾 feTile
createAt: 2021-08-27
slug: /docs/svg/filter/瓦砾
publish: true
tags:
  - svg
  - 瓦砾
  - feTile
  - 重复填充
  - 堆砌图像
archives:
  - 专栏
  - svg
---

`feTitle` 滤镜和 `pattern` 滤镜类似，用来重复填充一个图像。

`feTitle` 没有任何特殊属性，仅仅值需要一个输入源即可。使用如下：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<g id="Image">
			<image x="0" y="0" width="10" height="10"></image>
		</g>
		<filter id="Tile">
			<feImage
				xlink:href="/imgs/test1.jpg"
				result="Image"
				width="3"
				height="4"
			></feImage>
			<feTile in="Image"></feTile>
		</filter>
	</defs>
	<rect x="0" y="0" height="10" width="10" filter="url(#Tile)"></rect>
</svg>
```

上面代码使用一张图片作为 `feTitle` 的输入源，它会使用输入源的内容自动进行填充。效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<g id="Image">
			<image x="0" y="0" width="10" height="10"></image>
		</g>
		<filter id="Tile">
			<feImage xlink:href="/imgs/test1.jpg" result="Image" width="3" height="4"></feImage>
			<feTile in="Image"></feTile>
		</filter>
	</defs>
	<rect x="0" y="0" height="10" width="10" filter="url(#Tile)"></rect>
</svg>

也许你会觉得这个滤镜是不是很鸡肋，又不能跳转图像的平铺方式和大小等等效果。但是它的作用就如同它的名字一样，是把输入源当做瓦砾堆砌。如果你想旋转拉伸，应该给输入源添加其他滤镜，而不是在这个滤镜中处理。

## 参考

- [Filter primitive ‘feTile’][1]

[1]: https://www.w3.org/TR/SVG11/filters.html#feTileElement
