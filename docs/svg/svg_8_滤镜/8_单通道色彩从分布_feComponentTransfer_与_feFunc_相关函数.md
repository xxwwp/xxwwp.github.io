---
title: svg 单通道色彩从分布 feComponentTransfer 与 feFunc 相关函数
createAt: 2021-08-18
slug: svg/filter/单通道色彩从分布
publish: true
tags:
  - svg
  - feComponentTransfer
  - feFunc
  - table 表格分布
  - discrete 离散分布
  - linear 线性分布
  - gamma 伽马分布
archives:
  - 专栏
  - svg
---

## 介绍

**`<feComponentTransfer>` 滤镜为组件置换滤镜，它允许你配合 `<feFuncR>`、`<feFuncG>`、`<feFuncB>`、`<feFuncA>` 这些色彩通道组件对 RGBA 四个颜色通道进行色彩的重新分布。** 比如把红色整体加深，又或者去蓝光等等。

也许你会觉得这些功能 `<feColorMatrix>` 色彩矩阵滤镜就可以做，但是组件置换滤镜对单通道的支持更强，你可以使用区间、离散点、线性或者指数方式来重修某一色彩。

组件置换滤镜需要搭配 `<feFuncR>`、`<feFuncG>`、`<feFuncB>`、`<feFuncA>` 四个滤镜组件使用，这四个组件各自对应了红色、绿色、蓝色和透明度（alpha）四个颜色通道。它们的一般使用如下：

```xml
<filter id="ComponentTransfer-1">
	<feComponentTransfer>
		<feFuncR type="" />
		<feFuncG type="" />
		<feFuncB type="" />
		<feFuncA type="" />
	</feComponentTransfer>
</filter>
```

`<feComponentTransfer>` 并没有任何特殊属性，当然你也可以使用 `in`、`class` 或 `style` 等属性来修改它的输入源或者样式。

每个色彩通道组件上都有一个 `type` 属性用来标记从新分布色彩的方式。色彩通道组件的 `type` 属性可以为 `"identity | table | discrete | linear | gamma"`。

设 C' 为修改后的色彩，C 为原始色彩，在计算时，使用的是 **非预乘** 数据计算。

默认情况下，每种颜色的非预乘分布函数如下：

$$
Color(C) = C , C \in [0,1]
$$

其数据图为：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 10 10">
	<defs>
		<g id="Coordinate-base">
			<rect x="0" y="0" width="100%" height="100%" fill="white" rx="1" />
			<path
				d="
						M 0.5 7 l 9 0 l -0.2 0.1 l 0 -0.2 l 0.2 0.1 
						M 3 9.5 l 0 -9 l 0.1 0.2 l -0.2 0 l 0.1 -0.2
						M 3 3 l -0.2 0
						M 7 7 l 0 0.2 
						"
				stroke="black"
				stroke-width="0.03"
			/>
			<path d="M 3 3 l 4 0 l 0 4" fill="none" stroke-width="0.03" stroke="#444" stroke-dasharray="0.1" />
			<text x="3.1" y="7.5" text-anchor="start" font-size="0.5">0</text>
			<text x="9.5" y="7.4" text-anchor="start" font-size="0.5">x</text>
			<text x="3.2" y="0.6" text-anchor="start" font-size="0.5">y</text>
		</g>
		<g id="Coordinate-2">
			<use href="#Coordinate-base" />
			<text x="7" y="7.8" text-anchor="middle" font-size="0.5">1</text>
			<text x="2.5" y="3.2" text-anchor="middle" font-size="0.5">1</text>
			<text x="7" y="2.8" text-anchor="start" font-size="0.5" fill="silver">(1,1)</text>
		</g>
	</defs>
	<use href="#Coordinate-2" />
	<path d="M 3 7 l 4 -4" stroke="blue" stroke-width="0.03" />
</svg>

这个图就是原本的颜色分布方式，可以看到默认情况下的颜色是线性的。

## feFunc 色彩通道的 type 属性

四种颜色通道组件都有一个 `type` 属性，用来设置各种颜色按照什么方式从新分布。根据 `type` 值的不同，新的分布可能是线性、离散或指数等形式的。

> 所有类型分布颜色的计算方式可以[参看这里](https://www.w3.org/TR/SVG11/filters.html#feComponentTransferElement)。

### identity 标识

当 `type="identity"` 时滤镜不会对颜色进行任何修改，也就是说原函数并不会改变。比如下面这个滤镜，所有通道仅做标识，所以使用该滤镜不会对原图造成任何影响。

```xml
<filter id="ComponentTransfer-identity">
	<feComponentTransfer>
		<feFuncR type="identity" />
		<feFuncG type="identity" />
		<feFuncB type="identity" />
		<feFuncA type="identity" />
	</feComponentTransfer>
</filter>
```

### table 表格分布

**`type="table"` 是通道使用表格分布。表格分布可以拼接多个不同的线性分布。表格分布需要额外设置 `tableValues` 属性，这个属性接收 n 个数据用于创建 n - 1 个区间平分颜色范围，并使用这些数据创建 n - 1 个新的区间与原本的区间一一映射，新颜色将会使用该分布重新分配颜色。**

比如：

```xml
<feFuncR type="table" tableValues="0 0.8 0.9 1" />
```

上面 `tableValues` 设置了 4 （n）个值，这 4 个值会平分颜色到 3 （n - 1）个范围中：

```
0 ~ 0.33
0.33 ~ 0.66
0.66 ~ 1
```

接着会创建 3 （n - 1）个分布范围与上面的范围产生映射：

```
0 ~ 0.8
0.8 ~ 0.9
0.9 ~ 1
```

假如原颜色为 0.5，它属于 0.33 ~ 0.66 这个区间的中点，那么计算后它就会被从新映射到 0.8 ~ 0.9 这个区间的中点，得到 0.85。

使用二次坐标系可以直观的看到新的颜色分布：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 10 10">
	<use href="#Coordinate-2" />
	<path d="M 3 7 l 1.33 -3.2 l 1.33 -0.4 l 1.34 -0.4" fill="none" stroke="blue" stroke-width="0.03" />
	<path d="M 3 7 l 1.33 -3.2 l 1.33 -0.4 l 1.34 -0.4 l 0 4 z" fill="rgba(60,220,230,0.2)"  />
	<path
		d="M 3 7 m 1.33 0 l 0 -3.2 m 1.33 -0.4 l 0 3.6"
		fill="none"
		stroke="silver"
		stroke-width="0.03"
		stroke-dasharray="0.1"
	/>
	<text x="4.33" y="3.5" font-size="0.25" text-anchor="middle" fill="#444">(0.33, 0.8)</text>
	<text x="5.66" y="4" font-size="0.25" text-anchor="middle" fill="#444">(0.66, 0.9)</text>
	<circle r="0.1" cx="3" cy="7" fill="blue" />
	<circle r="0.1" cx="4.33" cy="3.8" fill="blue" />
	<circle r="0.1" cx="5.66" cy="3.4" fill="blue" />
	<circle r="0.1" cx="7" cy="3" fill="blue" />
</svg>

因为原本颜色分布时一次函数，所以平分的范围恰好对应平分的横坐标范围。

**从图中可以看到，`tableValues` 提供的数据实际上是图中的点，它们并不一定是要递增的，你可以设置 \[0,1\] 内的任何点，并以任何方式组合，不过与之带来的图也会更加复杂。除此之外，这些点是组合的图是连续的，并没有间断，也就是说，表格分布并不会造成跳跃式的颜色断层。**

可以看到新的颜色分布加重了该通道的颜色，相比 Color(C) 函数，这个函数的颜色会更重一些。

观看以下示例：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 10 10">
	<defs>
		<linearGradient id="Red-Trans" x1="0" x2="1">
			<stop stop-color="#000000" stop-opacity="1" offset="0" />
			<stop stop-color="#ff0000" stop-opacity="1" offset="100%" />
		</linearGradient>
		<filter id="ComponentTransfer-table-2">
			<feComponentTransfer>
				<feFuncR type="table" tableValues="0 0.8 0.9 1 " />
				<feFuncG type="identity" />
				<feFuncB type="identity" />
				<feFuncA type="identity" />
			</feComponentTransfer>
		</filter>
	</defs>
	<rect x="0" y="0" width="100%" height="5" fill="url(#Red-Trans)" />
	<rect x="0" y="5" width="100%" height="5" fill="url(#Red-Trans)" filter="url(#ComponentTransfer-table-2)" />
</svg>
```

上面代码中应用了前面提到的表格分布，数值也没有改变，为了更加清楚的观看效果，使用了渐变效果，效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 20 10">
	<defs>
		<linearGradient id="Red-Trans" x1="0" x2="1">
			<stop stop-color="#000000" stop-opacity="1" offset="0" />
			<stop stop-color="#ff0000" stop-opacity="1" offset="100%" />
		</linearGradient>
		<filter id="ComponentTransfer-table-2">
			<feComponentTransfer>
				<feFuncR type="table" tableValues="0 0.8 0.9 1 " />
				<feFuncG type="identity" />
				<feFuncB type="identity" />
				<feFuncA type="identity" />
			</feComponentTransfer>
		</filter>
	</defs>
	<rect x="0" y="0" width="100%" height="5" fill="url(#Red-Trans)" />
	<rect x="0" y="5" width="100%" height="5" fill="url(#Red-Trans)" filter="url(#ComponentTransfer-table-2)" />
</svg>

可以明显的看到，使用表格分布的矩形渐变得更快，颜色更加鲜艳。

把这个图和该组件的函数图对应上，就会感觉一目了然。这些颜色是连续的，并不会产生间断，正好对应了函数图中的效果。

根据 `tableValues` 提供数据不同，可以生成的分布效果也多样，比如使用 `tableValue="1 0"`，此时颜色 \[0, 1\] 将被映射到 \[1 ,0\] 中，让颜色反向。此时新分布将变成：

$$
FuncA'(C) = -C + 1 , C \in [0, 1]
$$

有兴趣可以试一试。不过这样的线性分布最好使用后面的 `type="linear"`，它能更直观的生产新的线性分布。

### discrete 离散分布

**`type="discrete"` 时通道采用离散分布。离散分布也接收 `tableValues` 属性提供的 n 个数据，并把颜色平分为 n 个范围，同时映射到这 n 个数据对应的点上。**

比如：

```xml
<feFuncR type="discrete" tableValues="0.5 0.8 0.5 0.3" />
```

上面 `tableValues` 设置了 4 个值，这 4 个值会平分颜色到 4 个范围中：

```
0 ~ 0.25
0.25 ~ 0.5
0.5 ~ 0.75
0.75 ~ 1
```

这些范围的颜色会依次映射到值 0.5、0.8、0.5、0.3，最后得到的函数图大概如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 10 10">
	<use href="#Coordinate-2" />
	<path d="M 3 5 l 1 0 " fill="none" stroke="blue" stroke-width="0.03" />
	<path d="M 4 3.8 l 1 0 " fill="none" stroke="blue" stroke-width="0.03" />
	<path d="M 5 5 l 1 0 " fill="none" stroke="blue" stroke-width="0.03" />
	<path d="M 6 5.8 l 1 0 " fill="none" stroke="blue" stroke-width="0.03" />
	<path d="M 4 3.8 l 0 3.2" fill="none" stroke="silver" stroke-width="0.03" stroke-dasharray="0.1" />
	<path d="M 5 3.8 l 0 3.2" fill="none" stroke="silver" stroke-width="0.03" stroke-dasharray="0.1" />
	<path d="M 6 5 l 0 2" fill="none" stroke="silver" stroke-width="0.03" stroke-dasharray="0.1" />
	<path d="M 3 7 l 0 -2 l 1 0 l 0 -1.2 l 1 0 l 0 1.2 l 1 0 l 0 0.8 l 1 0 l 0 1.2 z" fill="rgba(60,220,230,0.2)" />
</svg>

使用这样的分布，表示该通道将把颜色分布到四个确切的值上。也就是说，红色现在就只剩下 4 个色值，比如 0.2 在 0 ~ 0.25 之间，那么转化后的颜色将为 0.5。

虽然 W3C 上的计算方式的确如此，但是我在实际开发效果并不如预期，比如：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 20 10">
	<defs>
		<linearGradient id="Red-Trans" x1="0" x2="1">
			<stop stop-color="#000" stop-opacity="1" offset="0" />
			<stop stop-color="#f00" stop-opacity="1" offset="100%" />
		</linearGradient>
		<filter id="ComponentTransfer-discrete-1">
			<feComponentTransfer in="SourceGraphic">
				<feFuncR type="discrete" tableValues="0.5 0.8 0.5 0.3" />
				<feFuncG type="identity" />
				<feFuncB type="identity" />
				<feFuncA type="identity" />
			</feComponentTransfer>
		</filter>
	</defs>
	<rect x="0" y="0" width="100%" height="5" fill="url(#Red-Trans)" />
	<rect x="0" y="5" width="100%" height="5" fill="url(#Red-Trans)" filter="url(#ComponentTransfer-discrete-1)" />
</svg>
```

上面代码也是对红色渐变使用了单通道滤镜，对红色通道进行 `0.5 0.8 0.5 0.3` 的离散分布，按道理说，使用该滤镜后，渐变红色将会被平分为 4 等分，并且颜色会按照离散值进行重新绘制，但是实际效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 20 10">
	<defs>
		<linearGradient id="Red-Trans" x1="0" x2="1">
			<stop stop-color="#000" stop-opacity="1" offset="0" />
			<stop stop-color="#f00" stop-opacity="1" offset="100%" />
		</linearGradient>
		<filter id="ComponentTransfer-discrete-1">
			<feComponentTransfer in="SourceGraphic">
				<feFuncR type="discrete" tableValues="0.5 0.8 0.5 0.3" />
				<feFuncG type="identity" />
				<feFuncB type="identity" />
				<feFuncA type="identity" />
			</feComponentTransfer>
		</filter>
	</defs>
	<rect x="0" y="0" width="100%" height="5" fill="url(#Red-Trans)" />
	<rect x="0" y="5" width="100%" height="5" fill="url(#Red-Trans)" filter="url(#ComponentTransfer-discrete-1)" />
</svg>

也许你会很疑惑，为什么和函数图的效果完全不一样，我们期待的应该是应该是四个平均的红色块，然后它们的红色依次是 0.5 \* 255、0.8 \* 255、0.5 \* 255 和 0.3 \* 255，但是上图不论是大小还是色彩，都存在巨大的偏差（使用吸管工具测试后色彩也对不上）。

这并不是计算错误，因为我们输入的色彩值是 sRGB，然而滤镜是根据 linear RGB 来计算，所以最后的结果出现了偏差。

物理意义上的颜色是线性的，也就是 linear RGB。也许是人日行动物，接受的光源较多，原本的 linear RGB 色彩让人感觉亮度太低了，为了迎合人心里感光方式，计算机开发商统一使用 sRGB 色值输出到屏幕，于是整体的色彩更加亮一些了。

一个色彩为 127，那么映射到 \[0 ,1\] 区间它的值约为 0.5（127 / 255），我们输入的是 sRGB，转化为 linear RGB 为：

$$
C_{linear} = \Big(\dfrac{0.5 + 0.055}{1.055}\Big)^{2.4} \approx 0.084
$$

所以 sRGB 的 0.5 转化到 linear RGB 中才 0.084，这个值属于 0 ~ 0.25，应该使用第一个离散值进行渲染，因为这种转化，导致了渐变区域并没有被平分成 4 等分。关于计算公式，可以到本节最后的参考链接中寻找。

这还没有结束，第一个离散值设置的是 0.5，这又是 linear RGB 中的值，为了渲染到显示器上，计算机又会把这个颜色转化为 sRGB，也就是反向进行之前的步骤，计算如下：

$$
C_{srgb} = 1.055*0.5^{1/2.4} - 0.055 \approx 0.735 \\
C_{srgb255} = 0.735 * 255 \approx bb_{(16)}
$$

转化后的值为 0.735，再转化为 16 进制颜色是 `bb`，如果使用吸管测试第一个部分的颜色，会发现颜色就是 `#bb0000`，和计算结果相吻合。

实际上这些计算并不用去操心，因为我们输入的离散值和颜色都是 sRGB，只是在 `<linearGradient>` 这样的线性渐变上可以看出明显的不平均处理。而在生产环境中，滤镜一般用来处理一个整体，大多时候是图片，使用 sRGB 来思维可以更好调整色彩。

### linear 线性分布

**`type="linear"` 时通道采用线性分布。线性分布非常简单，仅用一个一次函数来重新分布色彩。一次函数仅需要提供 `slope` 斜率和 `intercept` 偏移值两个属性即可。**

比如：

```xml
<feFuncR type="linear" slope="-0.5" intercept="0.5" />
```

上面代码把红色重新分布到了下面曲线上：

$$
Linear(C) = -0.5C + 0.5, C \in [0,1]
$$

大概这么条线：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 10 10">
	<use href="#Coordinate-2" />
	<path d="M 3 5 l 4 2" fill="none" stroke="blue" stroke-width="0.03" />
	<path d="M 3 5 l 4 2 l -4 0 z" fill="rgba(60,220,230,0.2)" />
</svg>

根据曲线可以明显看到，红色是反向的。

示例：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 20 10">
	<defs>
		<linearGradient id="Red-Trans" x1="0" x2="1">
			<stop stop-color="#000" stop-opacity="1" offset="0" />
			<stop stop-color="#f00" stop-opacity="1" offset="100%" />
		</linearGradient>
		<filter id="ComponentTransfer-linear-1">
			<feComponentTransfer in="SourceGraphic">
				<feFuncR type="linear" slope="-0.5" intercept="0.5" />
				<feFuncG type="identity" />
				<feFuncB type="identity" />
				<feFuncA type="identity" />
			</feComponentTransfer>
		</filter>
	</defs>
	<rect x="0" y="0" width="100%" height="5" fill="url(#Red-Trans)" />
	<rect x="0" y="5" width="100%" height="5" fill="url(#Red-Trans)" filter="url(#ComponentTransfer-linear-1)" />
</svg>
```

上面依旧使用了渐变效果，并在第二个渐变区域使用了反向的红色滤镜，导致红色的渲染翻转了，效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 20 10">
	<defs>
		<linearGradient id="Red-Trans" x1="0" x2="1">
			<stop stop-color="#000" stop-opacity="1" offset="0" />
			<stop stop-color="#f00" stop-opacity="1" offset="100%" />
		</linearGradient>
		<filter id="ComponentTransfer-linear-1">
			<feComponentTransfer in="SourceGraphic">
				<feFuncR type="linear" slope="-0.5" intercept="0.5" />
				<feFuncG type="identity" />
				<feFuncB type="identity" />
				<feFuncA type="identity" />
			</feComponentTransfer>
		</filter>
	</defs>
	<rect x="0" y="0" width="100%" height="5" fill="url(#Red-Trans)" />
	<rect x="0" y="5" width="100%" height="5" fill="url(#Red-Trans)" filter="url(#ComponentTransfer-linear-1)" />
</svg>

同上一节一样，所有 `<feComponentTransfer>` 滤镜渲染时都有 sRGB 到 linear RGB 颜色的转变，所以红色被保留的部分比较多，最大值实际上是 linear RGB 的 0.5，也就是 sRGB 的 0.735，上一节介绍过。

### gamma 伽马分布

**`type="gamma"` 时通道采用伽马分布。伽马分布类似线性分布，使用指数函数进行从分布，它提供 `amplitude` 幅度、`exponent` 指数和 `offset` 偏移三个属性来设置指数函数。**

公式如下：

$$
Gamma(C) = a * C^{exp} + o
$$

其实就是个指数函数嘛，根据指数函数的相关性质，`exponent` 为 1 时，函数呈线性，小于 1 积分面积变大，颜色会更饱和些，反之大于 1 颜色会被压缩，会暗淡些，但是这并不会影响最大最小值。

当 `offset` 为 0 ，`amplitude` 为 1 时，函数图大致如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 10 10">
	<use href="#Coordinate-2" />
	<path d="M 3 7 l 5 -5" fill="none" stroke="blue" stroke-width="0.03" />
	<path d="M 3 7 q 0 -2,4 -4 t 1 -0.5" fill="none" stroke="red" stroke-width="0.03" />
	<path d="M 3 7 q 2 0,4 -4 t 0.5 -1" fill="none" stroke="#444" stroke-width="0.03" />
</svg>

其中：

- 蓝色为 `exponent = 1` 的情况；

- 红色为 `exponent < 1` 的情况；

- 灰色为 `exponent > 1` 的情况；

明暗效果就可以用伽马分布模拟，比如：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<g id="Image">
			<image
				x="0"
				y="0"
				width="10"
				height="10"
				xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
			/>
		</g>
		<filter id="ComponentTransfer-linear-1">
			<feComponentTransfer>
				<feFuncR type="gamma" exponent="4" />
				<feFuncG type="gamma" exponent="4" />
				<feFuncB type="gamma" exponent="4" />
				<feFuncA type="identity" />
			</feComponentTransfer>
		</filter>
	</defs>
	<use href="#Image" transform="translate(0,0)" filter="url(#ComponentTransfer-linear-1)" />
</svg>
```

上面代码把三个颜色通道都设置成了相同的 gamma 分布，让图片显得更暗淡了些，效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<g id="Image">
			<image
				x="0"
				y="0"
				width="10"
				height="10"
				xlink:href="https://hbimg.huabanimg.com/21a1ea15b965125284d140d6c160b308fb6c44731b7b2-glHieg_fw658"
			/>
		</g>
		<filter id="ComponentTransfer-gamma-1">
			<feComponentTransfer>
				<feFuncR type="gamma" exponent="4" />
				<feFuncG type="gamma" exponent="4" />
				<feFuncB type="gamma" exponent="4" />
				<feFuncA type="identity" />
			</feComponentTransfer>
		</filter>
	</defs>
	<use href="#Image" transform="translate(0,0)" filter="url(#ComponentTransfer-gamma-1)" />
</svg>

## 小结

这些分布中，超过分布的范围会使用分布 0 或 1 进行阈值处理。`<feComponentTransfer>` 滤镜对单色的处理能力非常强，大部分单色需求都可以使用该滤镜处理。除此之外，对 RGB 三个颜色进行同样的分布处理，即可跳转亮度、对比度、色彩平衡或阈值处理。

相比 `<feColorMatrix>` 来说，`<feComponentTransfer>` 更注重单色处理，`<feColorMatrix>` 更注重各种颜色之间的关系。

吐槽：我比较郁闷为什么没有贝塞尔曲线分布，如果有的话色彩控制将会更强。

## 参考

- [Modify RGBA Color Channels With The feComponentTransfer Filter Primitive](https://vanseodesign.com/web-design/svg-filter-primitives-fecomponenttransfer/)

- [Filter primitive ‘feComponentTransfer’](https://www.w3.org/TR/SVG11/filters.html#feComponentTransferElement)

- [how can I calculate the steps in a discrete function of feComponentTransfer in linearRGB color space](https://stackoverflow.com/questions/50952033/how-can-i-calculate-the-steps-in-a-discrete-function-of-fecomponenttransfer-in-l)

- [sRGB 色彩空间](https://zh.wikipedia.org/wiki/SRGB%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4)

- [What are the practical differences when working with colors in a linear vs. a non-linear RGB space?](https://stackoverflow.com/questions/12524623/what-are-the-practical-differences-when-working-with-colors-in-a-linear-vs-a-no)

- [小 tip: 了解 LinearRGB 和 sRGB 以及使用 JS 相互转换](https://www.zhangxinxu.com/wordpress/2017/12/linear-rgb-srgb-js-convert/)
