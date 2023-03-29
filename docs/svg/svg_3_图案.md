---
id: bef88842-b614-43dc-b43f-54d0e6774526
title: svg 图案 pattern
createAt: 2021-08-10
slug: /docs/svg/图案
publish: true
tags:
  - svg
  - pattern
  - objectBoundingBox
  - patternUnits
  - userSpaceOnUse
  - patternContentUnits
archives:
  - 专栏
  - svg
---

## 简介

Patterns （图案）是 svg 对基础零件的一种组合方式，它可让使用者预先设计一些图形的组合排列，然后在后续根据不同环境多次使用。

图案使用 `<pattern>` 元素描述，它同样需要一个 id，以方便后续元素对其进行引用，除此之外，它还有以下属性：

- `width`、`height` 用于设置宽高。根据 `patternUnits` 属性的不同，值的意义也不同。

- `patternUnits` 用于设置图案单元，默认值为 `objectBoundingBox`，基于对象大小设置，可以近似理解为百分比设置；另一个可用值是 `userSpaceOnUse`，大小根据坐标单位设置。

- `patternContentUnits` 用于设置图案内容单元，同 `patternUnits`，只是它作用的是 `<pattern>` 内部的元素。**需要注意的是，这个属性的默认值为 `userSpaceOnUse`。**

尝试画一个图案：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
	<defs>
		<linearGradient id="Gradient-1" x1="0" x2="1" y1="0" y2="0">
			<stop stop-color="skyblue" offset="0%" />
			<stop stop-color="blue" offset="100%" />
		</linearGradient>
		<pattern id="Pattern-1" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
			<rect x="10" y="10" width="30" height="30" fill="url(#Gradient-1)" />
			<circle r="5" cx="25" cy="25" fill="white" />
		</pattern>
	</defs>
	<rect x="0" y="0" width="100%" height="100%" fill="url(#Pattern-1)" />
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
	<defs>
		<linearGradient id="Gradient-1" x1="0" x2="1" y1="0" y2="0">
			<stop stop-color="skyblue" offset="0%" />
			<stop stop-color="blue" offset="100%" />
		</linearGradient>
		<pattern id="Pattern-1" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
			<rect x="10" y="10" width="30" height="30" fill="url(#Gradient-1)" />
			<circle r="5" cx="25" cy="25" fill="white" />
		</pattern>
	</defs>
	<rect x="0" y="0" width="100%" height="100%" fill="url(#Pattern-1)" />
</svg>

这里 `Pattern-1` 图案全部是用了坐标单位，比较直观就可看到，`pattern` 元素描述了一个矩形和圆形，宽高为 50 \* 50 个单位。代码最后绘制了一个矩形来填充该图案，因为矩形的大小为 200 \* 200，所以就自动填充成了 4 \* 4 的图案列表。

> 注意，这里的填充是根据坐标单位填充的，也就是说，如果填充容器足够大，那么就会显示足够多的 50 \* 50 的小图案。

如果使用相对对象大小的长度来换算，上面的图案可被写为：

```xml
<pattern id="Pattern-1" x="0" y="0" width=".25" height=".25" patternContentUnits="objectBoundingBox">
	<rect x=".05" y=".05" width=".15" height=".15" fill="url(#Gradient-1)" />
	<circle r=".025" cx=".125" cy=".125" fill="white" />
</pattern>
```

**在仅改变图案的情况下，上面代码的改动不会改变最终的渲染结果。如果现在放大容器，那使用对象大小的图案就会产生拉伸效果**。比如把容器高度设置为 2 倍，会得到以下效果：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="400">
	<defs>
		<linearGradient id="Gradient-2" x1="0" x2="1" y1="0" y2="0">
			<stop stop-color="skyblue" offset="0%" />
			<stop stop-color="blue" offset="100%" />
		</linearGradient>
		<pattern id="Pattern-2" x="0" y="0" width=".25" height=".25" patternContentUnits="objectBoundingBox">
			<rect x=".05" y=".05" width=".15" height=".15" fill="url(#Gradient-2)" />
			<circle r=".025" cx=".125" cy=".125" fill="white" />
		</pattern>
	</defs>
	<rect x="0" y="0" width="100%" height="100%" fill="url(#Pattern-2)" />
</svg>

> 个人觉得两种设置长度的方式都不是最优解，但是 svg 不提供更好的图案排列方式。
>
> 另外，两种设置长度的方式可以单独使用，并不一定要一起使用。

> `pattern` 还有其他属性，[详细参考这里][2]

## 参考

- [Patterns][1]

- [pattern][2]

[1]: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Patterns
[2]: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/pattern
