---
title: svg 简介
createAt: 2021-08-11
slug: /docs/svg/简介
nextPage: /docs/svg/线条与着色
publish: true
tags:
  - svg
  - 格式
  - xml
  - 引入方式
  - 坐标
  - viewBox
  - 内嵌
archives:
  - 专栏
  - svg
---

## 概述

svg 使用 xml 语言编写，早版本的 svg 文件需要编写 DTD，类似：

```xml
<?xml version="1.0" standalone="no"?>
```

svg 后续版本并没有这种说明，因为这样的代码无法正常嵌入到其他 xml 文档中，xml 有很多种，不同 xml 文件可能会复用同一元素名导致解析出错，比如 xhtml 和 svg 都有 `<title>` 元素，在 xhtml 中 内嵌 svg 时就有可能发生错误。所以 xml 的 DTD 不被有效用来区分不同的 xml 文件，仅做类型声明。

为了解决类似问题，xml 使用了命名空间，即在固定命名空间中的元素仅在此命名空间有效，此方法解决了不同 xml 文件的差异。所以 svg 文件中，svg 元素需要注明 `xmlns`（xml namespace）属性，比如：

```xml
<svg
	version="1.1"
	xmlns="http://www.w3.org/2000/svg"
>
</svg>
```

## 简单实例

新建一个 `xxx.svg` 文件如下：

```xml
<svg
	version="1.1"
	xmlns="http://www.w3.org/2000/svg"
	width="300" height="200"
>
	<rect width="100%" height="100%" fill="red" />
	<circle	cx="150" cy="100" r="80" fill="green" />
	<text x="150" y="125" font-size="60" text-anchor="middle" fill="white" >SVG</text>
</svg>
```

HTML 和 svg 使用的都是 xml 格式，所以 svg 代码就像元素一样，实际上 svg 内嵌到 HTML5 中时，的确是以元素的形式呈现的，可以使用 js 抓取这些 svg 元素并修改他们的属性。

上述代码中，`<rect>` 是正方形，`<circle>` 是圆形，`<text>` 可以内嵌字体，它们依次按照出现方式覆盖渲染。

## 引入方式

在 HTML5 中引入 svg 很简单，可以直接内嵌 svg 的代码，比如：

```html
<body>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="300" height="200">
    <rect width="100%" height="100%" fill="red" />
    <circle cx="150" cy="100" r="80" fill="green" />
    <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>
  </svg>
</body>
```

也可以使用 `<object>`、`<embed>`、`<iframe>` 元素引入，比如：

```html
<embed src="./demo1.svg" type="image/svg+xml" />
<object data="./demo1.svg" type="image/svg+xml"></object>
<iframe src="./demo1.svg" frameborder="0"></iframe>
```

## 文件类型

svg 文件推荐后缀是 `.svg`，当 svg 文件较大时，允许使用 gzip 来压缩文件，此时推荐使用 `.svgz` 来最为压缩后的文件后缀。另外需要注意，部分服务器对 gzip 后的 svg 文件支持并不好，[参见这里](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Getting_Started#svg_file_types)。

## 坐标定位和大小

同大部分计算机绘图，**svg 的坐标系，y 轴朝下为正方向，x 轴朝右问正方向。坐标原点为两轴交叉点。**

当新建一个 svg 如下时：

```xml
<svg
	version="1.1"
	xmlns="http://www.w3.org/2000/svg"
	width="300"
	height="200">
</svg>
```

它会生成一个 300 \* 200 的矩形区域，这个区域的左上角即为坐标原点 (0,0)。**坐标原点默认在左上角。**

因为 svg 是矢量的，所以 `width="300"` 和 `height="200"` 实际上并没有一个固定单位，在 HTML5 中，它默认单位是 1 像素。

svg 在 html 中的大小默认情况下由 svg 元素的 width、height 决定，但是也可以通过 css 来对 svg 进行缩放，例如：

```html
<style>
  #Rect {
    height: 50px;
  }
</style>
<svg id="Rect" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="500" viewBox="0 0 10 50">
  <rect width="10" height="50" fill="red" />
</svg>
```

上面的例子绘制了一个 100px \* 500px 的矩形，但是因为 css 设置了 svg 元素的高度为 50px，所以 svg 的图案进行了等比例缩小，变成了 10px \* 50px，需要注意的是，svg 盒子的宽度依旧是 100px，因为 svg 的 width 没有被覆盖。

> 上面的例子解释了，如果遇到设置了 width 和 height 属性的 svg 图案，必须同时设置宽高进行缩小或者放大，否则缩小后会出现错误。

## viewBox 属性

可以使用 `viewBox` 属性改变 svg 内部坐标，比如下面定义了 100 \* 100 个单位的坐标系，但是使用了 `viewBox="0 0 50 50"` 属性，此时坐标轴就会变成 50 \* 50 来绘制，但是 svg 的大小依旧是 100 \* 100。

也就是说，没有设置 `viewBox="0 0 50 50"` 前，需要 100 \* 100 的矩形才能填满这个 svg，设置之后只需要 50 \* 50 就能填满，并且 svg 大小不变。

```xml
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" height="100" viewBox="0 0 50 50"></svg>
```

> 在 HTML 中使用时，如果仅使用 `viewBox` 不使用 `width`、`height` 等属性，那么这个 svg 图案的宽度会根据包含块的宽度进行缩放适应。

## svg 内嵌

svg 元素是可以互相内嵌的，内嵌后命名空间和版本将会继承，如不修改的情况则可以忽略，比如：

```xml
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <svg width="100" height="100" >
		<text y="20" fill="#ff0">我一天要饿 8 次</text>
  </svg>
</svg>
```

另外，内部 svg 可以使用 `viewBox` 建立新的坐标系。
