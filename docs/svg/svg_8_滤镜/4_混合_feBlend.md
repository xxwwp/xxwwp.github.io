---
title: svg 混合 feBlend
createAt: 2021-08-18
slug: svg/filter/混合
publish: true
tags:
  - svg
  - 滤镜
  - 混合
  - 混合模式
  - feBlend
archives:
  - 专栏
  - svg
---

### 混合 `<feBlend>`

混合滤镜用来把两个滤镜或者输入源进行混合，混合的方式也有多种。

`<feBlend>` 滤镜有以下属性：

| 属性   | 值类型                                                                    | 描述                      |
| ------ | ------------------------------------------------------------------------- | ------------------------- |
| `in`   | [参考这里](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/in) | 输入源 1                  |
| `in2`  | 同 `in` 属性                                                              | 输入源 2                  |
| `mode` | `normal \| multiply \| screen \| darken \| lighten`                       | 混合模式，默认值 `normal` |

`in` 和 `in2` 用来设置两个输入源，通过设置 `mode` 来选择一种混合模式混合两个源，从而得到新的图像。

实际上混合的计算并不难，可[参考这里](https://www.w3.org/TR/SVG11/filters.html#feBlendModeAttribute)。

混合滤镜实际上只是在处理两个像素点上 rgba 四个值的合并计算方式。设：

- 两个输入源分别为 A 和 B ，结果为 R；
- qr = R 的不透明度
- qa = A 的不透明度
- qb = B 的不透明度
- cr = R 的颜色（预乘值）
- ca = A 的颜色（预乘值）
- cb = B 的颜色（预乘值）

混合滤镜不论什么模式，qr 的计算都如下：

$$
qr = 1 - (1-qa)*(1-qb)
$$

也就是说，两个输入源只要有一个不透明度是 1，那么结果不透明度就肯定是 1。

但是 `mode` 属性的值不同，cr 的计算就要复杂一些，参考下表：

| 混合模式   | cr 计算公式                                         | 大致效果                                                                        |
| ---------- | --------------------------------------------------- | ------------------------------------------------------------------------------- |
| `normal`   | cr = (1 - qa) \* cb + ca                            | 感觉上类似用输入源 2 图案来弥补输入源 1 的不透明部分                            |
| `multiply` | cr = (1-qa)\*cb + (1-qb)\*ca + ca\*cb               | 乘法混合，两个输入源颜色相似的地方容易保留下来，不相似的区域颜混合后偏向黑色    |
| `screen`   | cr = cb + ca - ca \* cb                             | 更偏向惯性思维上的混合，比如 `#f00` 混合 `#0f0` 得到 `#ff0`，事实上结果就是如此 |
| `darken`   | cr = Min ((1 - qa) \* cb + ca, (1 - qb) \* ca + cb) | 和 `normal` 计算方式相同，但是会交换数据源进行两组计算，选择颜色较深的结果。    |
| `lighten`  | cr = Max ((1 - qa) \* cb + ca, (1 - qb) \* ca + cb) | 同上，但是选择颜色较浅的结果                                                    |

简单理解 `normal` 的计算，观察可知，当模式为 `normal` 时，计算公式不涉及 qb，如果 qa 设置为 1，那么可得：

$$
\begin{aligned}
qr &= 1 \\
cr &= ca
\end{aligned}
$$

也就是说，`mode="normal"` 并且 qa = 1 时，B 图改什么值都和混合结果无关，来尝试一下：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="Blend-1">
			<feFlood result="Blend-1-Result-1" flood-color="#0000ff" flood-opacity="1" />
			<feFlood result="Blend-1-Result-2" flood-color="#ff0000" flood-opacity="1" />
			<feBlend in="Blend-1-Result-1" in2="Blend-1-Result-2" mode="normal" />
		</filter>
	</defs>
	<rect x="0" y="0" width="10" height="10" fill="none" filter="url(#Blend-1)" />
</svg>
```

上面的代码中，两个 `<feFlood>` 都是纯色滤镜，并且不透明度都为 1，符合 qa = 1 的条件，所以混合结果只会是输入源 1 的 `#0000ff` 蓝色。根据前面介绍，现在混合结果与输入源 2 是无关的，所以无论怎么修改第第二个输入源的滤镜颜色和透明度，最终都会渲染为一个蓝色。

所以如果想让两个不透明度均为 1 的输入源混合，一般不会使用 `normal` 模式。

来个简单的示例：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="Blend-1">
			<feImage
				result="Blend-1-Result-2"
      	xmlns:xlink="http://www.w3.org/1999/xlink"
				xlink:href="/imgs/test1.jpg"
			/>
			<feFlood result="Blend-1-Result-1" flood-color="#009000" flood-opacity="1" />
			<feBlend in="Blend-1-Result-1" in2="Blend-1-Result-2" mode="screen" />
		</filter>
	</defs>
	<rect x="0" y="0" width="10" height="10" fill="none" filter="url(#Blend-1)" />
</svg>
```

上面代码使用 `<feImage>` 元素，它用来导入一张图片作为滤镜对象，然后使用了一个泛色与其进行混合，效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="Blend-1">
			<feImage
				result="Blend-1-Result-2"
      	xmlns:xlink="http://www.w3.org/1999/xlink"
				xlink:href="/imgs/test1.jpg"
			/>
			<feFlood result="Blend-1-Result-1" flood-color="#009000" flood-opacity="1" />
			<feBlend in="Blend-1-Result-1" in2="Blend-1-Result-2" mode="screen" />
		</filter>
	</defs>
	<rect x="0" y="0" width="10" height="10" fill="none" filter="url(#Blend-1)" />
</svg>

> 可以使用 `<feImage>` 来导入图片当做输入源，从而实现两张甚至多张图片的混合。

> css 中的混合模式类型有很多，可以查看[这篇文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/blend-mode)。如果在 HTML 中使用 svg，这些 css 的混合模式类型是可以被 `<feBlend>` 使用的，比如 `<feBlend>` 滤镜的属性为 `mode="hue"`，在 HTML 中是适用的。
