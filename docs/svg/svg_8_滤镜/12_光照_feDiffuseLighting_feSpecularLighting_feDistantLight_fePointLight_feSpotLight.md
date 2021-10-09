---
title: svg 光照滤镜 feDiffuseLighting、feDistantLight、fePointLight、feSpecularLighting、feSpotLight
createAt: 2021-08-24
slug: svg/filter/光照滤镜
publish: true
tags:
  - svg
  - 光照滤镜
  - feDiffuseLighting
  - feDistantLight
  - fePointLight
  - feSpecularLighting
  - feSpotLight
  - 光照效果
  - 远光
  - 聚光
archives:
  - 专栏
  - svg
---

## 简介

> 光照这一节的计算实在太抽象了，W3C 上文档真的是能写多少写多少，几个公式就结束了。我没有去推算过，主要是无能为力，没学过计算机图形学。本节仅从效果上探讨 svg 的光照效果。

SVG 定义了三种光源和两种光照效果的光照滤镜。

三种光源分别是：

- 远光 `<feDistantLight>`，照射效果如同太阳，光束都是平行的，可以称作平行光。

- 点光 `<fePointLight>`，从一个点像四周照射，类似灯泡。

- 聚光 `<feSpotLight>`，想射线一般照射出去，和手电筒效果类似，呈现圆锥形态。

两种光照效果分别是：

- 镜面反射 `<feSpecularLighting>`，照射对象表面是光滑的，沿着表面把光反射出去。例如镜子、玻璃。

- 漫射 `<feDiffuseLighting>`，照射对象表面是粗糙的，根据粗糙程度会把光从四面八方反射出去。例如电影院的幕布。

在使用时，上面的滤镜中，光照效果为父级，光源为子级。也就是说，一种光照内可以包含多束光源，互相叠加。

光照滤镜输出的仅为光源，也就是在任何图案或者图片上直接使用光照都会被填充，所以一般使用光照滤镜时，都会配合 `<feComposite>` 合成滤镜的 _arithmetic_ 模式来使用。后面会详细介绍。

它们的一般使用如下：

```xml
<光照效果>
	<光源1>
	<光源2>
	<光源3>
</光照效果>
```

## 光源

光束这种东西是三维的，所以在使用光束时，我们定义的光源也需要三维的数据。三种光照效果都需要提供相关的三维数据和一些光照数据才能实现光照。

### feDistantLight

`feDistantLight` 滤镜用来定义远光效果，它发射的光束时平行的。这种平行光可以改变图案本身的色调，也许你会觉得这个我使用其他滤镜也能实现，但是它们的计算方式是不一样的。光照的计算要复杂得多。

要在一个三维坐标里面确定一束平行光的方位，最简单的方式就是设置两个方向角。一个是沿着 X 轴向 Y 轴的方向角，一个沿着 X 轴向 Z 轴仰角，默认情况下，方向向量指向 X 轴正方向。

具体可以查看[这篇文章][4]。

方向角和仰角的属性分别是 `azimuth` 和 `elevation`，格式数数字，单位就是度数。

用法如：

```xml
<feDistantLight azimuth="20" elevation="50">
```

> 不用为光源提供颜色，所有的光效使用 `feSpecularLighting` 和 `feDiffuseLighting` 滤镜实现，光源仅提供位置信息。

简单示例：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="feDistantLight-1">
			<feDiffuseLighting in="SourceGraphic">
				<feDistantLight azimuth="20" elevation="50">
			</feDiffuseLighting>
		</filter>
	</defs>
	<rect x="2" y="2" width="6" height="6" filter="url(#feDistantLight-1)" />
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="feDistantLight-1">
			<feDiffuseLighting in="SourceGraphic">
				<feDistantLight azimuth="20" elevation="50">
			</feDiffuseLighting>
		</filter>
	</defs>
	<rect x="2" y="2" width="6" height="6" filter="url(#feDistantLight-1)" />
</svg>

可以看到这种光照效果就是平行光，它填充了整个区域。

> 默认情况下光照的颜色是白色，可以使用 [lighting-color](#lighting-color) 属性来设置光照颜色。

### fePointLight

`fePointLight` 用来设置点光源。效果就像在图像中放了一个灯泡一样，光效会从光源四周蔓延开来。

在一个三维空间中设置一个灯泡，最简单的方式就是指定 X、Y、Z 轴的坐标，这个滤镜也是如此。它的一般使用如下：

```xml
<fePointLight x="2" y="2" z="1"></fePointLight>
```

三个属性对应三个坐标。

简单使用：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="fePointLight-1">
			<feDiffuseLighting in="SourceGraphic">
				<fePointLight x="2" y="2" z="1"></fePointLight>
			</feDiffuseLighting>
		</filter>
	</defs>
	<rect x="2" y="2" width="6" height="6" filter="url(#fePointLight-1)" />
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="fePointLight-1">
			<feDiffuseLighting in="SourceGraphic">
				<fePointLight x="2" y="2" z="1"></fePointLight>
			</feDiffuseLighting>
		</filter>
	</defs>
	<rect x="2" y="2" width="6" height="6" filter="url(#fePointLight-1)" />
</svg>

可以看到点光源的照射效果会从一个点扩散开来，类似径向渐变，不过径向渐变可没有 z 轴。

### feSpotLight

`feSpotLight` 聚光光源的效果类似手电筒，呈现圆锥状。

如果你不是很能理解，使用搜索引擎搜索聚光灯的图片，就可以看到各种类似的光效。

在三维空间中定义一个聚光光源，至少需要起点位置(x,y,z)，照射点位置(px,py,pz)、聚焦程度和聚光圆锥大小的，所以聚光光源总共就有 3 + 3 + 1 + 1 总共 8 个属性来决定。这些属性依次为：

- `x`、`y`、`z` 依次来定义聚光光源的起点位置，默认都为 0；

- `pointsAtX`、`pointsAtY`、`pointsAtZ` 依次来定义照射点的位置，X 和 Y 方向默认为 0，Z 方向默认朝向观察者；

- `specularExponent` 用来定义在相对照射点的的聚焦程度，默认为 1，值越大，聚焦效果越聚在单个点上，它是一个指数值。这个东西的理解类似放大镜的厚度一样，越厚聚焦效果越好。

- `limitingConeAngle` 用来限制光源圆锥的角度，单位是度，默认没有限制。它会隐藏圆锥之外的光源。它就像聚光灯的灯罩开口大小度数，开口越大的灯罩光源照射范围越多，越小的照射范围越小。

简单示例：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="feSpotLight-1">
			<feDiffuseLighting in="SourceGraphic">
				<feSpotLight
					x="5"
					y="5"
					z="1"
					pointsAtX="5"
					pointsAtY="5"
					pointsAtZ="0"
					specularExponent="3"
					limitingConeAngle="70"
				/>
			</feDiffuseLighting>
		</filter>
	</defs>
	<rect x="2" y="2" width="6" height="6" filter="url(#feSpotLight-1)" />
</svg>
```

上面代码在图像到使用者 1 个单位的地方设置了光源，并照回图像中央，因为限制了聚光的圆锥，所以这个聚光有明显的边缘。

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="feSpotLight-1">
			<feDiffuseLighting in="SourceGraphic">
				<feSpotLight
					x="5"
					y="5"
					z="1"
					pointsAtX="5"
					pointsAtY="5"
					pointsAtZ="0"
					specularExponent="3"
					limitingConeAngle="70"
				/>
			</feDiffuseLighting>
		</filter>
	</defs>
	<rect x="2" y="2" width="6" height="6" filter="url(#feSpotLight-1)" />
</svg>

## 光照效果公共属性

`feSpecularLighting` 和 `feDiffuseLighting` 滤镜类似，所以它们有一些公共属性。

### lighting-color

这个属性叫照明色，顾名思义，它被用来设置 `feSpecularLighting` 和 `feDiffuseLighting` 滤镜的光源基元颜色。

简单的说，它用来指定光的颜色。

它的值和 css 中 的颜色值一样，如 `red`、`tomato`、`#0ff`、`rgba(12,34,56,0.4)`。

### surfaceScale

`surfaceScale` 指定了图像不透明度为 1 时，原图案的高度。这个值越大，原图像的形状就会越突出，会增加一定的阴影与高光对比度。

当这个值为 0 时，原图案想到与是平的，那么光照将不会给原图带来阴影区域。

> 你可以使用光照来作用一个 `<text>`，然后修改光照滤镜的此属性，那么可以明显看到文本边缘产生的隆起。

### kernelUnitLength

`kernelUnitLength` 用于提供光照计算公式的参数。

表示表面法线计算公式中 dx 和 dy 的预期距离。第一个数字是 dx，第二个数字是 dy。只提供一个值时，它会同时作用 dx 和 dy。

> 这个属性我没有详细尝试过，主要是光照的计算公式太复杂了。如果你有兴趣，可以翻阅 [W3C][5]，上面有详细的计算公式。

## 光照效果

光照效果完全取决于 `feSpecularLighting` 和 `feDiffuseLighting` 滤镜，它们各自代表镜面反射了漫反射。

### feSpecularLighting

`feSpecularLighting` 滤镜用来模拟镜面反射光照。它有以下属性：

- `specularConstant` 镜面常量，默认值为 1，可以是任何非负数。光照计算后会乘以这个值得到最终结果，所以这个值影响光源的明暗效果。

- `specularExponent` 镜面指数，值越大光照效果越 “闪亮”。范围是 1.0 ~ 128.0，默认值为 1。

### feDiffuseLighting

`feDiffuseLighting` 滤镜用来模拟漫反射光照。

它有一个特有属性 `diffuseConstant` 扩散常数，默认为 1，可以是任何非负数。光照计算后会乘以这个值得到最终结果，所以这个值影响光源的明暗效果。

`diffuseConstant` 和 `feSpecularLighting` 滤镜的 `specularConstant` 的效果几乎是一样的。

## 示例

### 示例 1 不同光效与光源

下面示例代码演示了两种光效与三种光源组合的效果。

- 第一行是 `feDiffuseLighting` 漫反射光效；

- 第二行是 `feSpecularLighting` 镜面反射特效。

- 第一列是 `feDistantLight` 远光源，即平行光源；

- 第二列是 `fePointLight` 点光源；

- 第三列是 `feSpotLight` 聚光光源。

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 30 20">
	<defs>
		<filter id="feSpecularLighting-1">
			<feSpecularLighting in="SourceGraphic" lighting-color="#f0f" specularConstant="2">
				<feDistantLight azimuth="20" elevation="50">
			</feSpecularLighting>
		</filter>
		<filter id="feSpecularLighting-2">
			<feSpecularLighting in="SourceGraphic" lighting-color="#f0f" specularConstant="2">
				<fePointLight x="2" y="2" z="1"></fePointLight>
			</feSpecularLighting>
		</filter>
		<filter id="feSpecularLighting-3">
			<feSpecularLighting in="SourceGraphic" lighting-color="#f0f" specularConstant="2">
				<feSpotLight
					x="5"
					y="5"
					z="1"
					pointsAtX="5"
					pointsAtY="5"
					pointsAtZ="0"
					specularExponent="1"
					limitingConeAngle="70"
				/>
			</feSpecularLighting>
		</filter>
		<filter id="feDiffuseLighting-1">
			<feDiffuseLighting in="SourceGraphic" lighting-color="#f0f">
				<feDistantLight azimuth="20" elevation="50">
			</feDiffuseLighting>
		</filter>
		<filter id="feDiffuseLighting-2">
			<feDiffuseLighting in="SourceGraphic" lighting-color="#f0f">
				<fePointLight x="2" y="2" z="1"></fePointLight>
			</feDiffuseLighting>
		</filter>
		<filter id="feDiffuseLighting-3">
			<feDiffuseLighting in="SourceGraphic" lighting-color="#f0f">
				<feSpotLight
					x="5"
					y="5"
					z="1"
					pointsAtX="5"
					pointsAtY="5"
					pointsAtZ="0"
					specularExponent="1"
					limitingConeAngle="70"
				/>
			</feDiffuseLighting>
		</filter>
	</defs>
	<rect x="2" y="2" width="6" height="6" transform="translate(0 0)" filter="url(#feDiffuseLighting-1)" />
	<rect x="2" y="2" width="6" height="6" transform="translate(10 0)" filter="url(#feDiffuseLighting-2)" />
	<rect x="2" y="2" width="6" height="6" transform="translate(20 0)" filter="url(#feDiffuseLighting-3)" />
	<rect x="2" y="2" width="6" height="6" transform="translate(0 10)" filter="url(#feSpecularLighting-1)" />
	<rect x="2" y="2" width="6" height="6" transform="translate(10 10)" filter="url(#feSpecularLighting-2)" />
	<rect x="2" y="2" width="6" height="6" transform="translate(20 10)" filter="url(#feSpecularLighting-3)" />
</svg>
```

渲染效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 30 20">
	<defs>
		<filter id="feSpecularLighting-1">
			<feSpecularLighting in="SourceGraphic" lighting-color="#f0f" specularConstant="2">
				<feDistantLight azimuth="20" elevation="50">
			</feSpecularLighting>
		</filter>
		<filter id="feSpecularLighting-2">
			<feSpecularLighting in="SourceGraphic" lighting-color="#f0f" specularConstant="2">
				<fePointLight x="2" y="2" z="1"></fePointLight>
			</feSpecularLighting>
		</filter>
		<filter id="feSpecularLighting-3">
			<feSpecularLighting in="SourceGraphic" lighting-color="#f0f" specularConstant="2">
				<feSpotLight
					x="5"
					y="5"
					z="1"
					pointsAtX="5"
					pointsAtY="5"
					pointsAtZ="0"
					specularExponent="1"
					limitingConeAngle="70"
				/>
			</feSpecularLighting>
		</filter>
		<filter id="feDiffuseLighting-1">
			<feDiffuseLighting in="SourceGraphic" lighting-color="#f0f">
				<feDistantLight azimuth="20" elevation="50">
			</feDiffuseLighting>
		</filter>
		<filter id="feDiffuseLighting-2">
			<feDiffuseLighting in="SourceGraphic" lighting-color="#f0f">
				<fePointLight x="2" y="2" z="1"></fePointLight>
			</feDiffuseLighting>
		</filter>
		<filter id="feDiffuseLighting-3">
			<feDiffuseLighting in="SourceGraphic" lighting-color="#f0f">
				<feSpotLight
					x="5"
					y="5"
					z="1"
					pointsAtX="5"
					pointsAtY="5"
					pointsAtZ="0"
					specularExponent="1"
					limitingConeAngle="70"
				/>
			</feDiffuseLighting>
		</filter>
	</defs>
	<rect x="2" y="2" width="6" height="6" transform="translate(0 0)" filter="url(#feDiffuseLighting-1)" />
	<rect x="2" y="2" width="6" height="6" transform="translate(10 0)" filter="url(#feDiffuseLighting-2)" />
	<rect x="2" y="2" width="6" height="6" transform="translate(20 0)" filter="url(#feDiffuseLighting-3)" />
	<rect x="2" y="2" width="6" height="6" transform="translate(0 10)" filter="url(#feSpecularLighting-1)" />
	<rect x="2" y="2" width="6" height="6" transform="translate(10 10)" filter="url(#feSpecularLighting-2)" />
	<rect x="2" y="2" width="6" height="6" transform="translate(20 10)" filter="url(#feSpecularLighting-3)" />
</svg>

可以看到，漫反射光效更符合我们认知的光效，毕竟现实世界不存在完全的镜面反射。

> 注意，不设置 `lighting-color` 属性或设置为白色时，镜面反射效果几乎看不出来。

### 示例 2 配合 feComposite

光照效果会完全作为滤镜的输出源，也就是说，原本的输入源将不存在，就类似 `feFlood` 泛色滤镜一样。所以在使用光照时，一般配合 `feComposite` 组合滤镜一起使用。

下面示例在一张图片的左上方加了一个漫反射点光源，

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="400" viewBox="0 0 10 20">
	<defs>
		<g id="ExImage">
			<image
				x="1"
				y="1"
				width="8"
				height="8"
				xlink:href="/imgs/test1.jpg"
			/>
		</g>
		<filter id="Ex-2">
			<feDiffuseLighting in="SourceGraphic" lighting-color="rgba(0,200,255,1)" surfaceScale="1" result="Diff-1">
				<fePointLight x="3" y="3" z="0.5"></fePointLight>
			</feDiffuseLighting>
			<feComposite in="SourceGraphic" in2="Diff-1" operator="arithmetic" k1="3" k2="1" k3="0" k4="0"></feComposite>
		</filter>
	</defs>
	<use xlink:href="#ExImage" />
	<use xlink:href="#ExImage" transform="translate(0 10)" filter="url(#Ex-2)" />
</svg>
```

效果如下，光源作用在第二张图上，第一张图为对比图：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="400" viewBox="0 0 10 20">
	<defs>
		<g id="ExImage">
			<image
				x="1"
				y="1"
				width="8"
				height="8"
				xlink:href="/imgs/test1.jpg"
			/>
		</g>
		<filter id="Ex-2">
			<feDiffuseLighting in="SourceGraphic" lighting-color="rgba(0,200,255,1)" surfaceScale="1" result="Diff-1">
				<fePointLight x="3" y="3" z="0.5"></fePointLight>
			</feDiffuseLighting>
			<feComposite in="SourceGraphic" in2="Diff-1" operator="arithmetic" k1="3" k2="1" k3="0" k4="0"></feComposite>
		</filter>
	</defs>
	<use xlink:href="#ExImage" />
	<use xlink:href="#ExImage" transform="translate(0 10)" filter="url(#Ex-2)" />
</svg>

### 示例 3 光照描边

如果图形有足够多的轮廓，使用光照还能形成特殊的描边效果：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="Ex3-1">
			<feDiffuseLighting in="SourceGraphic" lighting-color="#08f" diffuseConstant="4" surfaceScale="0.5">
				<fePointLight x="0" y="2" z="0.2"></fePointLight>
			</feDiffuseLighting>
		</filter>
	</defs>
	<text x="50%" y="50%" font-size="2" text-anchor="middle" filter="url(#Ex3-1)">Lighting !</text>
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="Ex3-1">
			<feDiffuseLighting in="SourceGraphic" lighting-color="#08f" diffuseConstant="4" surfaceScale="0.5">
				<fePointLight x="0" y="2" z="0.2"></fePointLight>
			</feDiffuseLighting>
		</filter>
	</defs>
	<text x="50%" y="50%" font-size="2" text-anchor="middle" filter="url(#Ex3-1)">Lighting !</text>
</svg>

在这个示例中，你可以大胆的设置 `surfaceScale` 属性，它的大小看起来就和文本的突出度相关联。

## 参考

- [Create SVG Lighting Effects With The feDiffuseLighting Filter Primitive][1]

- [Create SVG Lighting Effects With The feSpecularLighting Filter Primitive][6]

- [An Introduction To SVG Lighting Filters And Light Sources][2]

- [MDN SVG Element][3]

- [利用方位角和仰角设置视点][4]

[1]: https://vanseodesign.com/web-design/svg-filter-primitives-fediffuselighting/
[2]: https://vanseodesign.com/web-design/svg-lighting-filters-light-sources/
[3]: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element
[4]: https://ww2.mathworks.cn/help/matlab/creating_plots/setting-the-viewpoint-with-azimuth-and-elevation.html
[5]: https://www.w3.org/TR/SVG11/filters.html#feDiffuseLightingElement
[6]: https://vanseodesign.com/web-design/svg-filter-primitives-fespecularlighting/
