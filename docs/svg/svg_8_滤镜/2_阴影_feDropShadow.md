---
title: svg 阴影滤镜 feDropShadow
createAt: 2021-08-18
slug: /docs/svg/filter/阴影滤镜
publish: true
tags:
  - svg
  - 阴影滤镜
  - feDropShadow
  - 泛色
  - flood-color
  - flood-opacity
archives:
  - 专栏
  - svg
---

## 简介

[`<feDropShadow>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDropShadow) 阴影滤镜非常简单，它只有三个属性：

- `dx`：投影的 x 偏移。

- `dy`：投影的 y 偏移。

- `stdDeviation`：该属性定义了阴影中模糊操作的标准偏差。数值越大，图案立体效果越明显，值为 0 时阴影和图案尺寸完全相同。

例如

```xml
<svg viewBox="0 0 30 10" width="600" height="200" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<filter id="shadow">
			<feDropShadow dx="0.2" dy="0.4" stdDeviation="0.2" />
		</filter>
		<filter id="shadow2">
			<feDropShadow dx="0" dy="0" stdDeviation="0.5" flood-color="cyan" />
		</filter>
		<filter id="shadow3">
			<feDropShadow dx="-0.8" dy="-0.8" stdDeviation="0" flood-color="pink" flood-opacity="0.5" />
		</filter>
	</defs>
	<circle cx="5" cy="50%" r="4" style="fill: pink; filter: url(#shadow)" />
	<circle cx="15" cy="50%" r="4" style="fill: pink; filter: url(#shadow2)" />
	<circle cx="25" cy="50%" r="4" style="fill: pink; filter: url(#shadow3)" />
</svg>
```

效果如下：

<svg viewBox="0 0 30 10" width="600" height="200" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<filter id="shadow">
			<feDropShadow dx="0.2" dy="0.4" stdDeviation="0.2" />
		</filter>
		<filter id="shadow2">
			<feDropShadow dx="0" dy="0" stdDeviation="0.5" flood-color="cyan" />
		</filter>
		<filter id="shadow3">
			<feDropShadow dx="-0.8" dy="-0.8" stdDeviation="0" flood-color="pink" flood-opacity="0.5" />
		</filter>
	</defs>
	<circle cx="5" cy="50%" r="4" style="fill: pink; filter: url(#shadow)" />
	<circle cx="15" cy="50%" r="4" style="fill: pink; filter: url(#shadow2)" />
	<circle cx="25" cy="50%" r="4" style="fill: pink; filter: url(#shadow3)" />
</svg>

> 可以使用 `flood-color` 和 `flood-opacity` 来改变阴影的颜色和不透明度，这两个属性不是阴影滤镜特有的。

## `flood-color` 与 `flood-opacity` 泛色

`flood-color` 与 `flood-opacity` 属性用来设置泛色的颜色与不透明度。它们一般作用到 `<feDropShadow>` 滤镜和 `<feFlood>` 滤镜中。

- 在 `<feFlood>` 滤镜中，泛色会 **覆盖** 整个区域，不透明度会改变颜色色调。详见 【滤镜】 - 【阴影 `<feDropShadow>`】 一节。

- 在 `<feDropShadow>` 滤镜中，`flood-color` 用来修改阴影的颜色，`flood-opacity` 用来修改阴影的不透明度。例如设置一个蓝色不透明度为 50% 的阴影滤镜，可以这样实现：

  ```xml
  <feDropShadow dx="1" dy="1" stdDeviation="0.1" flood-color="blue" flood-opacity="0.5" />
  ```
