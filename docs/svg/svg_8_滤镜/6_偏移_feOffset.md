---
title: svg 偏移 feOffset
createAt: 2021-08-18
slug: /docs/svg/filter/偏移
publish: true
tags:
  - svg
  - 滤镜
  - 偏移
  - feOffset
archives:
  - 专栏
  - svg
---

使用 `<feOffset>` 滤镜可以设置图案的偏移量，类似 css 中的相对定位效果。

可以使用 `dx`、`dy` 属性来设置相对偏移的尺寸。比如：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 10 10">
	<defs>
		<filter id="Offset-1" width="10" height="10">
			<feOffset dx="1" dy="1" />
		</filter>
	</defs>
	<rect x="0" y="0" width="100%" height="100%" fill="blue" />
	<rect x="0" y="0" width="80%" height="80%" fill="tomato" filter="url(#Offset-1)" />
</svg>
```

上面产生两个矩形，一个为背景一个在左上角，但是因为使用了偏移滤镜，左上角的矩形偏移到了中间，最终效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 10 10">
	<defs>
		<filter id="Offset-1" width="10" height="10">
			<feOffset dx="1" dy="1" />
		</filter>
	</defs>
	<rect x="0" y="0" width="100%" height="100%" fill="blue" />
	<rect x="0" y="0" width="80%" height="80%" fill="tomato" filter="url(#Offset-1)" />
</svg>

> 需要注意的是，偏移滤镜需要足够大，不然难以查看到偏移后的效果，更甚至会丢失偏移后的图案。
