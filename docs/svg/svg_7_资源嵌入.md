---
title: svg 资源嵌入
createAt: 2021-08-11
slug: svg/资源嵌入
publish: true
tags:
  - svg
  - 图片
  - 图像
  - 图形
  - 资源嵌入
  - image
archives:
  - 专栏
  - svg
---

[参考](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Other_content_in_SVG)

## 图像

类似于 HTML 中 的 `<img>` 元素，svg 中可以使用 `<image>` 元素插入图片，支持 PNG、JPG 和 SVG 等类型的图片。

嵌入的图片被定义为一个普通的 svg 元素，所以你可以对其进行剪裁、遮罩、变形等。

`<image/>` 元素和 `<rect/>` 的大小定位等属性相同，只是增加了 `xlink:href` 属性来设置资源的地址，资源也可以是一段 base64。

示例：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="600">
	<defs>
		<pattern id="Image-1" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
			<image
				x="0"
				y="0"
				width="200"
				height="200"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				xlink:href="/imgs/test1.jpg"
			/>
		</pattern>
	</defs>
	<rect x="0" y="0" width="200" height="200" fill="url(#Image-1)" />
	<rect x="0" y="200" width="200" height="200" fill="url(#Image-1)" />
	<rect x="0" y="200" width="200" height="200" fill="tomato" opacity=".2" />
	<rect x="0" y="400" width="200" height="200" fill="url(#Image-1)" />
	<rect x="0" y="400" width="200" height="200" fill="blue" opacity=".2" />
</svg>

## 嵌入任意 xml

[参见](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Other_content_in_SVG#%E5%B5%8C%E5%85%A5%E4%BB%BB%E6%84%8Fxml)
