---
title: svg 卷积矩阵 feConvolveMatrix
createAt: 2021-08-24
slug: svg/filter/卷积矩阵
publish: true
tags:
  - svg
  - 卷积矩阵
  - feConvolveMatrix
  - 压花
  - 浮雕
archives:
  - 专栏
  - svg
---

## 简介

`<feConvolveMatrix>` 为卷积矩阵滤镜，该滤镜可以让一个像素的色值与其周围的像素点进行组合，通过卷积实现一些成像操作。比如模糊、边缘检测、锐化、压花和斜角等。

卷积矩阵基于一个 n \* m 的卷积核来计算给定像素点与其相邻像素点的组合方式。每个像素点的卷积公式如下：

<pre>
COLOR<sub>X,Y</sub> = (
		SUM<sub>I=0 to [orderY - 1]</sub> {
			SUM<sub>J=0 to [orderX - 1]</sub> {
				SOURCE<sub>X-targetX+J, Y-targetY+i</sub> * kernelMatrix<sub>orderX-j-1, orderY-I-1</sub>
			}
		}
	) / divisor + bias * ALPHA<sub>X,Y</sub>
</pre>

上面公式中，`orderX`、`orderY`、`targetX`、`targetY`、`kernelMatrix`、`divisor`、`bias` 都是通过属性的方式传入到卷积矩阵滤镜之中，稍后会介绍。

先来看下默认情况。假如一张不透明的图仅有 3 \* 3 个像素点，它的其中一个颜色通道的值如下：

```
A B C
D E F
G H I
```

然后我们给出一个卷积矩阵如下：

```
1 2 3
4 5 6
7 8 9
```

那么 E 点该颜色的值为：

```
(9A + 8B + 7C + 6D + 5E + 4D + 3C + 2B + 1A) / (1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9)
```

卷积矩阵在计算时需要旋转 180 度，所以卷积矩阵的数值是反向与像素点周围的值进行相乘的。

上面的演示的就是中心点 E 于该颜色通道计算后的值，它是比较复杂的。

不过也可以看出，通过卷积矩阵，使得中心点 E 和周围的点产生了关联。

## 属性

为了灵活使用卷积矩阵滤镜，该滤镜几乎提供了全部参与计算的属性。

### order

`order` 属性用来确定计算公式中 `orderX` 与 `orderY` 的值，这个值是固定的，它代表当前矩阵的列数与行数。W3C 并没有为其定义默认值，但是在实际使用中请填清楚，因为一个 4 \* 5 与一个 5 \* 4 的矩阵数据量是一样的，如果不填清可能会造成不同预期的计算。

它的语法为：

```
order="X[,Y]"
```

当省略 `Y` 值时，会使用 `X` 代替 `Y` 。

示例：

```xml
<feConvolveMatrix
	order="3,3"
	kernelMatrix="
	1 0 0
	0 0 0
	0 0 -1"
></feConvolveMatrix>
```

像上面就定义了一个 3 \* 3 的卷积矩阵滤镜，并且通过 `order` 指明了卷积矩阵的行列数。

> 一般来说，卷积矩阵的大小 3 \* 3 是最常用的，因为过大的矩阵会造成高额的计算成本。

### kernelMatrix

`kernelMatrix` 属性用来定义卷积矩阵的数据，可以使用空白符或者逗号分割各个值，列表的的数目必须满足 `order` 属性对应的条目。

示例：

```xml
<feConvolveMatrix
	order="2,2"
	kernelMatrix="
	1  0
	0 -1"
></feConvolveMatrix>
```

也许你会有些疑惑，如果卷积矩阵是根据像素点计算的，那么上面是一个 2 \* 2 的矩阵，它如何进行像素计算。

卷积矩阵的计算会根据矩阵数据，重新在原图中建立坐标系，从而形参新的像素点。

### divisor

`divisor` 为计算公式中的除数。在卷积矩阵计算后，产生的数字会除以这个数。它作为矩阵值总和的除数一般用来调整整体颜色强度，以便产生明亮或夜间效果。除数指定为零是错误的。**默认情况下，除数是矩阵数据的总和，如果总和为 0，则除数设置为 1。**

因此在简介中，默认情况下，我们没有指定 `divisor` 的值，但是最后的结果却要除以 1 ~ 9 的总和。又比如以下代码：

```xml
<feConvolveMatrix
	order="3,3"
	kernelMatrix="
	1 0 0
	0 0 0
	0 0 -1"
></feConvolveMatrix>
```

这段代码我们同样没有指定 `divisor` 值，但是它的值为 1，因为 `kernelMatrix` 的总和为零，根据定义总和为零时除数设置为 1，所以上面代码中的 `divisor` 值为 1。

当然也可以主动指定，比如：

```xml
<feConvolveMatrix
	order="3,3"
	kernelMatrix="
	1 0 0
	0 0 0
	0 0 -1"
	divisor="2"
></feConvolveMatrix>
```

此时除数将不再使用总和计算，而是直接使用 `2` 作为除数。

### bias

`bias` 属性为卷积矩阵滤镜的偏差值。在图形通过卷积矩阵计算并除以 `divisor` 后，会加上 `bias`。如果不透明度参与计算，那么 `bias` 的值乘以不透明度。（卷积矩阵滤镜计算时，颜色通道使用的也是预乘值，范围 \[0, 1\]，所以这个值一般也比较小）。

示例：

```xml
<feConvolveMatrix
	order="3,3"
	kernelMatrix="
	0 0 0
	0 1 0
	0 0 0"
	bias="0.2"
></feConvolveMatrix>
```

看的出来上面的卷积矩阵就是原图，但是所有颜色通道的颜色都提升了 0.2，造成整体颜色偏向白色。

- 假如，某一不透明像素点的红色通道为 0.8
- 再加上 0.2 就为 1
- 最终这个颜色值会变得非常接近白色。

> 在简介中的公式可以看到，该值是要乘以当前像素点的不透明度的、这个计算方式可以通过 [preserveAlpha](#preserveAlpha) 属性来修改。

### targetX

`targetX` 用来确定卷积矩阵相对提供计算的像素点的行号偏移量。矩阵的左上角列号行号都为 0，默认情况下，`targetX=floor(orderX / 2)`，设置该值时必须满足： `0 <= targetX < orderX`。

综上，默认情况下，某一像素才会相对于矩阵中心进行计算。

设下面是一堆像素点：

```
A B C D E
F G H I J
K L M N O
```

面对一个 3 \* 3 的卷积矩阵，默认情况下、每个点都是使用它们相邻的像素点进行计算。比如参与 G 点卷积计算的点就是：

```
A B C
F G H
K L M
```

当设置为 `targetX="0"` 时，每个点参与卷积矩阵计算的像素点就发生了偏移，比如此时参与 G 点卷积计算的点就为：

```
B C D
G H I
L M N
```

这个属性实用性并不强，只要图片足够大，那么此属性带来的效果就像把最终结果偏移几个像素点一样。

### targetY

`targetX` 用来确定卷积矩阵相对提供计算的像素点的列号偏移量。矩阵的左上角列号行号都为 0，默认情况下，`targetX=floor(orderX / 2)`，设置该值时必须满足： `0 <= targetX < orderX`。

> 参阅 [targetX](#targetX)。

### edgeMode

`edgeMode` 为边缘模式属性。它用来确定图像的边缘如何进行扩展计算。

这个属性的可用值如下：

```
edgeMode = "duplicate | wrap | none"
```

设一个图像素点如下：

```
a b ... c d
e f ... g h
    ...
i j ... k l
m n ... o p
```

当 `edgeMode="duplicate"`、边缘需要扩展 2 个的像素时，图像的边缘扩展如下：

```
a a a b ... c d d d
a a a b ... c d d d
a a a b ... c d d d
e e e f ... g h h h
        ...
i i i j ... k l l l
m m m n ... o p p p
m m m n ... o p p p
m m m n ... o p p p
```

**图案边缘会使用自身边缘的值进行扩展，从而实现卷积矩阵的计算，这个值是一个默认值。**

当 `edgeMode="wrap"`、边缘需要扩展 2 个的像素时，图像的边缘扩展如下：

```
k l i j ... k l i j
o p m n ... o p m n
c d a b ... c d a b
g h e f ... g h e f
        ...
k l i j ... k l i j
o p m n ... o p m n
c d a b ... c d a b
g h e f ... g h e f
```

**图案每行每列会被认为是循环的，然后使用首末进行填充。**

当 `edgeMode="none"` 时，不会使用边缘填充，不存在的像素点每个颜色通道都会使用 0 代替。

#### 论点

> 此节内容在讨论中，如果你有兴趣，欢迎在 Issues 中发起讨论。

关于 `edgeMode` 属性，我自己测试了很多次，一直不是很能理解，比如经典的压花 3 \* 3 卷积矩阵：

```
1 0  0
0 0  0
0 0 -1
```

这个矩阵的效果很不错，大概是这样的：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="100" viewBox="0 0 10 3">
	<defs>
		<filter id="feConvolveMatrix-1">
			<feConvolveMatrix
				order="3,3"
				kernelMatrix="
				1 0 0
				0 0 0
				0 0 -1"
				preserveAlpha="false"
				kernelUnitLength="100"
			></feConvolveMatrix>
		</filter>
	</defs>
	<text fill="skyblue" font-size="2" x="50%" y="50%" text-anchor="middle" filter="url(#feConvolveMatrix-1)">Convolve</text>
</svg>

如果 `edgeMode` 默认情况下是 `duplicate` 重复值，那么对于纯色区域且不透明度的区域来说，得到的结果应该都是透明的黑色。

比如 `rgba(255,255,0,0)` 这个颜色，它的边缘使用 `duplicate` 来重复填充，得到的结果应该只是扩大了一圈而已。

因为压花卷积矩阵值总和为 0，所以除数为 1，那么任意像素点的 R、G、B 通道都将是：

$$
\begin{aligned}
C' &= (-1C+C) / 1 \\
C' &= 0
\end{aligned}
$$

阿尔法不透明度通道为 1，计算后为：

$$
\begin{aligned}
A' &= (-1+1) / 1 \\
A' &= 0
\end{aligned}
$$

也就是完全透明，所以压花效果的边缘如果使用 `edgeMode="duplicate"` 模式应该是什么都看不到才对。

而且很意外的是，当我使用 `edgeMode="none"` 模式时，上面的结果是一样的，对于 `edgeMode="none"` 模式下压花的边缘特效是符合计算结果的，只是其他两个模式的渲染效果不和预期。

上述情况仅在边缘出现。

### kernelUnitLength

这个属性用于建立生成新的坐标系参与该滤镜计算，我没有找到相关示例，这个属性我在 Chrome 92+ 版本上测试也没得到实质性的效果。[详见 W3C][3]。

### preserveAlpha

`preserveAlpha` 属性用来设置是否保留 alpha 通道不参与计算，默认值为 `false`，即不透明度参与计算，你也可以设置为 `true`，此时透明度将不参与卷积计算。

当该值设置为 `false` 时，alpha 通道值计算如下：

<pre>
ALPHA<sub>X,Y</sub> = (
		SUM<sub>I=0 to [orderY - 1]</sub> {
			SUM<sub>J=0 to [orderX - 1]</sub> {
				SOURCE<sub>X-targetX+J, Y-targetY+i</sub> * kernelMatrix<sub>orderX-j-1, orderY-I-1</sub>
			}
		}
	) / divisor + bias 
</pre>

当该值为 `true` 时，不透明度将不参与计算。此时各个颜色将不进行预乘而直接进行计算，然后在最终结果中重新预乘。此时每个像素点的不透明度将不产生变化，计算公式为：

$$
ALPHA_{X,Y} = SOURCE_{X,Y}
$$

## 用例

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="Relief-1">
			<feConvolveMatrix
				order="3,3"
				kernelMatrix="
				2 2 1
				2 0 -2
				1 -2 -2"
			></feConvolveMatrix>
		</filter>
	</defs>
	<image
		x="1"
		y="1"
		width="8"
		height="8"
		xlink:href="/imgs/test1.jpg"
		filter="url(#Relief-1)"
	/>
</svg>
```

上述代码效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="Relief-1">
			<feConvolveMatrix
				order="3,3"
				kernelMatrix="
				2 2 1
				2 0 -2 
				1 -2 -2"
			></feConvolveMatrix>
		</filter>
	</defs>
	<image
		x="1"
		y="1"
		width="8"
		height="8"
		xlink:href="/imgs/test1.jpg"
		filter="url(#Relief-1)"
	/>
</svg>

## 其他

[Victor Powell][1] 上有一些卷积矩阵的样例，不过他的样例好像并没有参照 W3C 标准进行计算，但是效果差别并不大。

## 参考

- [Image Kernels][1]

- [Add Bevel And Emboss Effects With The feConvolveMatrix Filter Primitive][2]

- [Filter primitive ‘feConvolveMatrix’][3]

- [\<feConvolveMatrix\>][4]

[1]: https://setosa.io/ev/image-kernels/
[2]: https://vanseodesign.com/web-design/svg-filter-primitives-feconvolvematrix/
[3]: https://www.w3.org/TR/SVG11/filters.html#feConvolveMatrixElementDivisorAttribute
[4]: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feConvolveMatrix
