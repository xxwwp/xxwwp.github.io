---
title: svg 渐变、linearGradient 与 radialGradient
createAt: 2021-08-10
slug: /docs/svg/渐变
publish: true
tags:
  - svg
  - linearGradient
  - radialGradient
  - stop
  - 线性渐变
  - 径向渐变
  - 末端处理
  - 渐变单元
archives:
  - 专栏
  - svg
---

## 线性渐变

线性渐变的描述使用 `<linearGradient>` 节点，类似这样：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="400" height="200">
	<defs>
		<style type="text/css">
			#rect-1 {
				fill: url(#Gradient-1);
			}
			.stop-1 {
				stop-color: red;
			}
			.stop-2 {
				stop-color: black;
				stop-opacity: 0;
			}
			.stop-3 {
				stop-color: blue;
			}
		</style>
		<linearGradient id="Gradient-1">
			<stop class="stop-1" offset="0%" />
			<stop class="stop-2" offset="50%" />
			<stop class="stop-3" offset="100%" />
		</linearGradient>
		<linearGradient id="Gradient-2" x1="0" x2="1" y1="0" y2="1">
			<stop stop-color="red" offset="0%" />
			<stop stop-color="black" stop-opacity="0" offset="50%" />
			<stop stop-color="blue" offset="100%" />
		</linearGradient>
	</defs>
	<rect id="rect-1" x="20" y="20" width="160" height="160" />
	<rect x="220" y="20" width="160" height="160" fill="url(#Gradient-2)" />
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="400" height="200">
	<defs>
		<style type="text/css"><![CDATA[
			#rect-1 {
				fill: url(#Gradient-1);
			}
			.stop-1 {
				stop-color: red;
			}
			.stop-2 {
				stop-color: black;
				stop-opacity: 0;
			}
			.stop-3 {
				stop-color: blue;
			}
		]]></style>
		<linearGradient id="Gradient-1">
			<stop class="stop-1" offset="0" />
			<stop class="stop-2" offset="0.5" />
			<stop class="stop-3" offset="1" />
		</linearGradient>
		<linearGradient id="Gradient-2" x1="0" x2="1" y1="0" y2="1">
			<stop stop-color="red" offset="0%" />
			<stop stop-color="black" stop-opacity="0" offset="50%" />
			<stop stop-color="blue" offset="100%" />
		</linearGradient>
	</defs>
	<rect id="rect-1" x="20" y="20" width="160" height="160" />
	<rect x="220" y="20" width="160" height="160" fill="url(#Gradient-2)" />
</svg>

线性渐变的中间节点使用 `<stop>` 元素描述，它有三个常用属性：

- `offset`：用来描述渐变的位置的百分比，可以使用小数。这个属性不能使用 css 编写。
- `stop-color`：渐变使用的颜色。
- `stop-opacity`：渐变颜色的不透明度。

**为了使用到指定的渐变，需要给每个 `<linearGradient>` 给定一个 `id`，让其他图形通过此 `id` 来引用渐变色。**

除此之外， **`<linearGradient>` 元素的 `x1`、`x2`、`y1` 和 `y2` 属性还可以定义渐变的方向。可以近似的把它们理解成渐变始末点的位置，从而得到不同方向上的渐变。**

在上面的代码中，两个矩形都分别引用了两个渐变色作为填充的颜色，并且使用了 css 和 属性两种方式设置渐变色。

可以使用 `xlink:href` 来让一个渐变色引用另一个渐变色，比如：

```xml
<linearGradient
	id="Gradient2" x1="0" x2="0" y1="0" y2="1"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xlink:href="#Gradient1"/>
```

上面的代码引用了 id 为 `#Gradient1` 的渐变色为当前描述的渐变色。

## 径向渐变

径向渐变就是圆形的渐变，从内到外或者从外到内。

镜像渐变使用 `<radialGradient>` 元素来描述，可以使用以下属性来描述圆的信息：

- `cx`、`cy` 渐变中心点位置；
- `r` 半径位置；
- `fx`、`fy` 焦点位置。

镜像渐变类似一个光点在球体上某个位置的效果，离光点越远，颜色越淡。比如：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="550" height="200">
	<defs>
		<radialGradient id="Gradient-4" cx="0.5" cy="0.5" r="0.4" fx="0.25" fy="0.25">
			<stop stop-color="white" offset="0" />
			<stop stop-color="#000" offset="1" />
		</radialGradient>
	</defs>
	<circle r="100" cx="100" cy="100" fill="url(#Gradient-4)" />
	<circle r="100" cx="350" cy="100" fill="url(#Gradient-4)" />

	<circle r="80" cx="350" cy="100" fill="none" stroke="red" />
	<Line x1="430" y1="100" x2="500" y2="50" stroke="red" />
	<text x="450" y="40" font-size="12px">径向渐变范围</text>

	<circle r="3" cx="300" cy="50" fill="red" />
	<text x="305" y="55" font-size="12px">焦点</text>

	<circle r="3" cx="350" cy="100" fill="red" />
	<text x="355" y="105" font-size="12px">中心点</text>
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="550" height="200">
	<defs>
		<radialGradient id="Gradient-4" cx="0.5" cy="0.5" r="0.4" fx="0.25" fy="0.25">
			<stop stop-color="white" offset="0" />
			<stop stop-color="#000" offset="1" />
		</radialGradient>
	</defs>
	<circle r="100" cx="100" cy="100" fill="url(#Gradient-4)" />
	<circle r="100" cx="350" cy="100" fill="url(#Gradient-4)" />
	<circle r="80" cx="350" cy="100" fill="none" stroke="red" />
	<Line x1="430" y1="100" x2="500" y2="50" stroke="red" />
	<text x="450" y="40" font-size="12px">径向渐变范围</text>
	<circle r="3" cx="300" cy="50" fill="red" />
	<text x="305" y="55" font-size="12px">焦点</text>
	<circle r="3" cx="350" cy="100" fill="red" />
	<text x="355" y="105" font-size="12px">中心点</text>
</svg>

根据径向渐变的效果，可以画出一个比较立体的球体，比如：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
	<defs>
		<radialGradient id="Gradient-7" cx="0.4" cy="0.4" r="0.6" fx="0.25" fy="0.25">
			<stop stop-color="white" offset="0" />
			<stop stop-color="black" offset="1" />
		</radialGradient>
	</defs>
	<circle r="100" cx="100" cy="100" fill="url(#Gradient-7)" />
</svg>

## 末端处理

另外，可以使用 `spreadMethod` 属性来标记径向渐变的末端处理，它有三个属性：

- `pad`：默认值，在径向渐变结束后，保留最终颜色向外延伸；
- `reflect`：在径向渐变结束后，反向渐变到初值；
- `repeat`：在径向渐变结束后，重复渐变。

示例：

```xml
<svg
	version="1.1"
	xmlns="http://www.w3.org/2000/svg"
	width="200"
	height="690"
	xmlns:xlink="http://www.w3.org/1999/xlink"
>
	<defs>
		<radialGradient id="Gradient-8" cx="0.4" cy="0.4" r="0.3" fx="0.25" fy="0.25" spreadMethod="pad">
			<stop stop-color="white" offset="0" />
			<stop stop-color="black" offset="1" />
		</radialGradient>
		<radialGradient id="Gradient-9" xlink:href="#Gradient-8" spreadMethod="reflect"></radialGradient>
		<radialGradient id="Gradient-10" xlink:href="#Gradient-8" spreadMethod="repeat"></radialGradient>
	</defs>
	<rect x="0" y="0" width="200" height="200" fill="url(#Gradient-8)" />
	<text x="10" y="220">spreadMethod="pad"</text>
	<rect x="0" y="230" width="200" height="200" fill="url(#Gradient-9)" />
	<text x="10" y="450">spreadMethod="reflect"</text>
	<rect x="0" y="460" width="200" height="200" fill="url(#Gradient-10)" />
	<text x="10" y="680">spreadMethod="reflect"</text>
</svg>
```

效果图如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="690" xmlns:xlink="http://www.w3.org/1999/xlink">
	<defs>
		<radialGradient id="Gradient-8" cx="0.4" cy="0.4" r="0.3" fx="0.25" fy="0.25" spreadMethod="pad">
			<stop stop-color="white" offset="0" />
			<stop stop-color="black" offset="1" />
		</radialGradient>
		<radialGradient id="Gradient-9" xlink:href="#Gradient-8" spreadMethod="reflect"></radialGradient>
		<radialGradient id="Gradient-10" xlink:href="#Gradient-8" spreadMethod="repeat"></radialGradient>
	</defs>
	<rect x="0" y="0" width="200" height="200" fill="url(#Gradient-8)" />
	<text x="10" y="220">spreadMethod="pad"</text>
	<rect x="0" y="230" width="200" height="200" fill="url(#Gradient-9)" />
	<text x="10" y="450">spreadMethod="reflect"</text>
	<rect x="0" y="460" width="200" height="200" fill="url(#Gradient-10)" />
	<text x="10" y="680">spreadMethod="repeat"</text>
</svg>

## 渐变单元

> 两种渐变都有一个叫做 `gradientUnits`（渐变单元）的属性，它描述了用来描述渐变的大小和方向的单元系统。该属性有两个值：`userSpaceOnUse` 、`objectBoundingBox`。默认值为`objectBoundingBox`，我们目前看到的效果都是在这种系统下的，它大体上定义了对象的渐变大小范围，所以你只要指定从 0 到 1 的坐标值，渐变就会自动的缩放到对象相同大小。`userSpaceOnUse` 使用绝对单元，所以你必须知道对象的位置，并将渐变放在同样地位置上。
>
> --- MDN

也就是说，默认情况下，渐变色也是矢量的，它会根据作用对象的大小自动拉伸，

当 `gradientUnits="objectBoundingBox"` 时，渐变会根据对象大小自动拉伸。

当 `gradientUnits="userSpaceOnUse"` 时，渐变设置的大小是根据坐标拉伸的。比如你希望一个水平渐变每隔 10 个坐标就循环一次，可以这样设置：

```xml
<linearGradient
	id="Gradient-11"
	spreadMethod="reflect"
	gradientUnits="userSpaceOnUse"
	x1="0"
	x2="10"
	y1="0"
	y2="0"
>
	<stop stop-color="silver" offset="0%" />
	<stop stop-color="white" offset="100%" />
</linearGradient>
```

效果图：

<svg
	version="1.1"
	xmlns="http://www.w3.org/2000/svg"
	width="200"
	height="50"
	xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
<linearGradient
				id="Gradient-11"
				spreadMethod="reflect"
				gradientUnits="userSpaceOnUse"
				x1="0"
				x2="10"
				y1="0"
				y2="0"
			>
<stop stop-color="silver" offset="0%" />
<stop stop-color="white" offset="100%" />
</linearGradient>
</defs>
<rect x="0" y="0" width="100%" height="200" fill="url(#Gradient-11)" />
</svg>

> 你也可以利用属性 `gradientTransform` 给渐变添加额外的变化，但是因为我们还没有介绍 `transforms`，所以我们将在后续的章节中介绍它。
>
> --- MDN
