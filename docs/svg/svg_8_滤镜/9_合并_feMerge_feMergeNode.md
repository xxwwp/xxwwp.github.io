---
title: svg 合并 feMerge、feMergeNode
createAt: 2021-08-19
slug: /docs/svg/filter/合并
publish: true
tags:
  - svg
  - feMerge
  - feMergeNode
archives:
  - 专栏
  - svg
---

## 介绍

`<feMerge>` 滤镜允许你不按顺序应用多个滤镜效果，`<feMerge>` 滤镜本身没有任何特殊属性，它通过包裹多个 `<feMergeNode>` 元素来应用多个滤镜。

`<feMergeNode>` 节点使用 [in][1] 属性用来接收其他滤镜。

一般使用如下：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="Merge-1">
			<feFlood flood-color="red" flood-opacity="1" result="Flood-1" />
			<feFlood flood-color="blue" flood-opacity="1" result="Flood-2" />
			<feMerge>
				<feMergeNode in="Flood-2" />
				<feMergeNode in="Flood-1" />
			</feMerge>
		</filter>
	</defs>
	<rect x="0" y="0" width="10" height="10" filter="url(#Merge-1)" />
</svg>
```

默认情况下，蓝色填充滤镜在红色填充滤镜前面，最终颜色应该是红色，但是上面代码使用合并滤镜改变了两个滤镜的顺序，导致最终结果为红色。

渲染效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 10 10">
	<defs>
		<filter id="Merge-1">
			<feFlood flood-color="red" flood-opacity="1" result="Flood-1" />
			<feFlood flood-color="blue" flood-opacity="1" result="Flood-2" />
			<feMerge>
				<feMergeNode in="Flood-2" />
				<feMergeNode in="Flood-1" />
			</feMerge>
		</filter>
	</defs>
	<rect x="0" y="0" width="10" height="10" filter="url(#Merge-1)" />
</svg>

## 场景

一般来说，我们只需要值一开始按顺序编写滤镜即可，然后采用 `in` 和 `result` 进行拼接。但是一些特殊情况下，我们的输入源可能被占用了，此时无法按顺序进行滤镜设置。

比如某个滤镜使用了 `in="SourceGraphic" in2="BackgroundImage"`，此时将无法把其他滤镜排到这种滤镜的前面，这种情况下就可以使用 `feMerge` 滤镜。

## 参考

- [in][1]

[1]: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/in
