---
title: svg 合成 feComposite
createAt: 2021-08-19
slug: svg/filter/合成
publish: true
tags:
  - svg
  - feComposite
  - operator
archives:
  - 专栏
  - svg
---

## 简介

`<feComposite>` 滤镜用来处理两个图像的智能像素组合，它和 `<feBlend>` 滤镜类似，也有两个输入源 [in][1] 和 [in2][2]。

它还有一个重要的属性 [operator][3] 来决定如何处理两个图像的组合。

> 这个滤镜的兼容性非常差，即使我在 Chrome 92.x 版本运行，这个滤镜仍不能完全正常工作，甚至连 W3C 的官方示例都跑不过。其次我还测试了 Firefox 90.0.2，使用官方示例在两个浏览器跑出来的效果居然完全不一致。万幸我找到了一种方式来验证这个滤镜。

实际上，这个滤镜给人感谢像是在求两个源的交并补集。理论上来说，你可以使用 `<circle>` 绘制两个圆，再让它们有一定交集放置，此时使用该滤镜即可过滤出其中一个圆与另一圆的交并补集区域。

## operator 属性

在 [W3C][4] 中，该属性的可用值为：

```
operator = "over | in | out | atop | xor | arithmetic"
```

> 在过滤特效草案里面还新增了 `lighter` 可用值，这个值在浏览器上已经可以使用。

下面使用两个色块进行合成处理，因为兼容性原因，示例代码并没有使用官方推荐的代码。下面代码使用 `<feImage>` 引入其他色块来与当前色块进行合成，代码如下：

> Firefox 不支持 `<feImage>` 引入一个图形，所以下面代码请在 Chrome 中运行。

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="150" viewBox="0 0 100 30">
	<defs>
		<style>
			text {
				font-size: 3px;
				fill: #3f9;
				text-anchor: middle;
			}
			.text-start {
				text-anchor: start;
			}
		</style>
		<g id="Back100">
			<path d="M 0 0 l 10 0 l -10 10 z" fill="rgba(255,0,255,1)" />
		</g>
		<g id="Surface100">
			<path d="M 0 0 l 10 10 l 0 -10 z" fill="rgba(0,255,255,1)" />
		</g>
		<g id="Back50">
			<path d="M 0 0 l 10 0 l -10 10 z" fill="rgba(255,0,255,0.5)" />
		</g>
		<g id="Surface50">
			<path d="M 0 0 l 10 10 l 0 -10 z" fill="rgba(0,255,255,0.5)" />
		</g>
		<filter id="Over" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface100" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="over" />
		</filter>
		<filter id="In" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface100" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="in" />
		</filter>
		<filter id="Out" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface100" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="out" />
		</filter>
		<filter id="Atop" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface100" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="atop" />
		</filter>
		<filter id="Xor" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface100" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="xor" />
		</filter>
		<filter id="Arithmetic" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface100" result="Red" />
      <feComposite in="SourceGraphic" in2="Red" operator="arithmetic" k1="-1" k2="0" k3="1" k4="0" />
		</filter>
		<filter id="Light" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface100" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="light" />
		</filter>
		<filter id="Over50" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface50" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="over" />
		</filter>
		<filter id="In50" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface50" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="in" />
		</filter>
		<filter id="Out50" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface50" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="out" />
		</filter>
		<filter id="Atop50" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface50" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="atop" />
		</filter>
		<filter id="Xor50" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface50" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="xor" />
		</filter>
		<filter id="Arithmetic50" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface50" result="Red" />
      <feComposite in="SourceGraphic" in2="Red" operator="arithmetic" k1="-1" k2="0" k3="1" k4="0" />
		</filter>
		<filter id="Light50" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface50" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="light" />
		</filter>
	</defs>
	<text x="0" y="5" class="text-start">opacity 1.0</text>
	<use href="#Back100" transform="translate(20 0)" filter="url(#Over)" />
	<use href="#Back100" transform="translate(32 0)" filter="url(#In)" />
	<use href="#Back100" transform="translate(44 0)" filter="url(#Out)" />
	<use href="#Back100" transform="translate(56 0)" filter="url(#Atop)" />
	<use href="#Back100" transform="translate(68 0)" filter="url(#Xor)" />
	<use href="#Back100" transform="translate(80 0)" filter="url(#Arithmetic)" />
	<text x="0" y="20" class="text-start">opacity 0.5</text>
	<use href="#Back50" transform="translate(20 15)" filter="url(#Over50)" />
	<use href="#Back50" transform="translate(32 15)" filter="url(#In50)" />
	<use href="#Back50" transform="translate(44 15)" filter="url(#Out50)" />
	<use href="#Back50" transform="translate(56 15)" filter="url(#Atop50)" />
	<use href="#Back50" transform="translate(68 15)" filter="url(#Xor50)" />
	<use href="#Back50" transform="translate(80 15)" filter="url(#Arithmetic50)" />
	<text x="25" y="12.5">over</text>
	<text x="37" y="12.5">in</text>
	<text x="49" y="12.5">out</text>
	<text x="61" y="12.5">atop</text>
	<text x="73" y="12.5">xor</text>
	<text x="85" y="12.5">arithmetic</text>
	<text x="25" y="27.5">over</text>
	<text x="37" y="27.5">in</text>
	<text x="49" y="27.5">out</text>
	<text x="61" y="27.5">atop</text>
	<text x="73" y="27.5">xor</text>
	<text x="85" y="27.5">arithmetic</text>
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="150" viewBox="0 0 100 30">
	<defs>
		<style>
			text {
				font-size: 3px;
				fill: #3f9;
				text-anchor: middle;
			}
			.text-start {
				text-anchor: start;
			}
		</style>
		<g id="Back100">
			<path d="M 0 0 l 10 0 l -10 10 z" fill="rgba(255,0,255,1)" />
		</g>
		<g id="Surface100">
			<path d="M 0 0 l 10 10 l 0 -10 z" fill="rgba(0,255,255,1)" />
		</g>
		<g id="Back50">
			<path d="M 0 0 l 10 0 l -10 10 z" fill="rgba(255,0,255,0.5)" />
		</g>
		<g id="Surface50">
			<path d="M 0 0 l 10 10 l 0 -10 z" fill="rgba(0,255,255,0.5)" />
		</g>
		<filter id="Over" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface100" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="over" />
		</filter>
		<filter id="In" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface100" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="in" />
		</filter>
		<filter id="Out" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface100" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="out" />
		</filter>
		<filter id="Atop" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface100" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="atop" />
		</filter>
		<filter id="Xor" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface100" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="xor" />
		</filter>
		<filter id="Arithmetic" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface100" result="Red" />
      <feComposite in="SourceGraphic" in2="Red" operator="arithmetic" k1="-1" k2="0" k3="1" k4="0" />
		</filter>
		<filter id="Light" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface100" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="light" />
		</filter>
		<filter id="Over50" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface50" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="over" />
		</filter>
		<filter id="In50" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface50" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="in" />
		</filter>
		<filter id="Out50" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface50" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="out" />
		</filter>
		<filter id="Atop50" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface50" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="atop" />
		</filter>
		<filter id="Xor50" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface50" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="xor" />
		</filter>
		<filter id="Arithmetic50" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface50" result="Red" />
      <feComposite in="SourceGraphic" in2="Red" operator="arithmetic" k1="-1" k2="0" k3="1" k4="0" />
		</filter>
		<filter id="Light50" x="0" y="0" height="10" width="10">
			<feImage xlink:href="#Surface50" result="Red" />
			<feComposite in="SourceGraphic" in2="Red" operator="light" />
		</filter>
	</defs>
	<text x="0" y="5" class="text-start">opacity 1.0</text>
	<use href="#Back100" transform="translate(20 0)" filter="url(#Over)" />
	<use href="#Back100" transform="translate(32 0)" filter="url(#In)" />
	<use href="#Back100" transform="translate(44 0)" filter="url(#Out)" />
	<use href="#Back100" transform="translate(56 0)" filter="url(#Atop)" />
	<use href="#Back100" transform="translate(68 0)" filter="url(#Xor)" />
	<use href="#Back100" transform="translate(80 0)" filter="url(#Arithmetic)" />
	<text x="0" y="20" class="text-start">opacity 0.5</text>
	<use href="#Back50" transform="translate(20 15)" filter="url(#Over50)" />
	<use href="#Back50" transform="translate(32 15)" filter="url(#In50)" />
	<use href="#Back50" transform="translate(44 15)" filter="url(#Out50)" />
	<use href="#Back50" transform="translate(56 15)" filter="url(#Atop50)" />
	<use href="#Back50" transform="translate(68 15)" filter="url(#Xor50)" />
	<use href="#Back50" transform="translate(80 15)" filter="url(#Arithmetic50)" />
	<text x="25" y="12.5">over</text>
	<text x="37" y="12.5">in</text>
	<text x="49" y="12.5">out</text>
	<text x="61" y="12.5">atop</text>
	<text x="73" y="12.5">xor</text>
	<text x="85" y="12.5">arithmetic</text>
	<text x="25" y="27.5">over</text>
	<text x="37" y="27.5">in</text>
	<text x="49" y="27.5">out</text>
	<text x="61" y="27.5">atop</text>
	<text x="73" y="27.5">xor</text>
	<text x="85" y="27.5">arithmetic</text>
</svg>

在不透明的情况下，两个图案在合成效果上类似求交并补集一般。在具有一定透明度时，他们的处理方式又有些许差异。

`operator` 属性值解释：

- `over`：该值使用 `in` 源覆盖在 `in2` 源上。

- `in`：该值保留 `in` 源和 `in2` 源公共部分，**在结果中去除 `in2` 源，因为是在结果中去除，所以 `in2` 的透明度也会参与计算，最后的结果并不是简单的使用 `in` 源填充公共部分。** 因此在上面 0.5 不透明度的渲染结果中，`operator="in"` 的色调并不是 `in` 源中的色调，其他属性计算类似。

- `out`：该值将去除结果中 `in2` 源参与的部分。

- `atop`：该值将去除结果中 `in` 源不与 `in1` 源重叠的 `in` 源部分。

- `xor` 异或：该值表示 `in` 源 `in2` 源中非重叠区域组合在一起。重叠区域根据重叠的程度会被消除。

- `lighter`（这个值是一个草案）：该值表示 `in` 源和 `in2` 源的总和。

- `arithmetic`：这个值将使用一面公式来计算最终合成结果：

  ```
  result = k1*i1*i2 + k2*i1 + k3*i2 + k4
  ```

  其中 `k1`、`k2`、`k3` 和 `k4` 为额外属性参数，`i1` 和 `i2` 对应 `in` 源和 `in2` 源的像素通道值，另外色彩通道是单独计算的，不是整体计算。

  比如前面的半透明合成演示中：

  带入 k1 ~ k4 为 -1、0、1、0 有：

  ```
  result = -1*i1*i2 + i2
  ```

  根据色彩有：

  ```
  i1 = (255, 0, 255, 0.5) => (1, 0, 1, 0.5)，对应 R1 = 1、G1 = 0、B1 = 1、A1 = 0.5；
  i2 = (0, 255, 255, 0.5) => (0, 1, 1, 0.5)，对应 R2 = 0、G2 = 1、B2 = 1、A2 = 0.5；
  ```

  在 `in` 源独立的部分，i2 无色彩通道，有：

  ```
  R' = -1 * R1 * 0 + 0 = 0
  G' = -1 * G1 * 0 + 0 = 0
  B' = -1 * B1 * 0 + 0 = 0
  A' = -1 * A1 * 0 + 0 = 0

  色彩透明
  ```

  在 `in` 源与 `in2` 源重叠的部分有：

  ```
  R' = -1 * R1 * R2 + R2 = -1 * 1 * 0 + 0 = -1
  G' = -1 * G1 * G2 + G2 = -1 * 0 * 1 + 1 = 1
  B' = -1 * B1 * B2 + B2 = -1 * 1 * 1 + 1 = 1
  A' = -1 * A1 * A2 + A2 = -1 * 0.5 * 0.5 + 0.5 = 0.25

  超出区间区间 [0, 1] 取阈值，色彩为 (0, 1, 1, 0.25)
  ```

  在 `in2` 源独立的部分，`i1` 源无色彩通道，有：

  ```
  R' = -1 * 0 * R2 + R2 = R2
  G' = -1 * 0 * G2 + G2 = G2
  B' = -1 * 0 * B2 + B2 = B2
  A' = -1 * 0 * A2 + A2 = A2

  色彩源 i2 源色彩不变。
  ```

> 合成滤镜的透明度是参与计算的，

> 需要提醒的是，如果使用浏览器的吸色器获取半透明部分示例的颜色，会出现偏差，因为吸色器吸取的是半透明色和底色叠加的结果，就像完全透明的话，吸色器获取到的颜色就是底色。

## 参考

- [in][1]
- [in2][2]
- [operator][3]
- [Filter primitive ‘feComposite’][4]

[1]: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/in
[2]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/in2
[3]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/operator
[4]: https://www.w3.org/TR/SVG11/filters.html#feCompositeOperatorAttribute
