---
title: 理解 css containe 属性
slug: /docs/blogs/理解 css containe 属性
createAt: 2023-03-16
publish: false
tags:
  - css
  - containe
archives:
  - 博客
---

## 大纲

```
此外，当任何包含在 HTMLhtml或body元素上处于活动状态时，从body元素到初始包含块、视口或画布背景的属性传播将被禁用。值得注意的是，这会影响：

writing-mode、direction和text-orientation（参见CSS Writing Modes 3 § 8 The Principal Writing Mode）

overflow及其缩写（参见CSS Overflow 3 § 3.5 Overflow Viewport Propagation）

background及其缩写（参见CSS Backgrounds 3 § 2.11.2 The Canvas Background and the HTML <body> Element）

注意：传播到元素本身设置的属性的初始包含块、视口或画布背景html不受影响。

注意：contain之外的几个属性可以为一个元素打开各种包含。这些不影响contain的价值；一个元素可以有contain: none但仍然有content-visibility打开的布局包含，例如。
```

## containe

- size

  - 空大小：元素的大小忽略子节点布局（包括伪元素子节点），非替换元素宽高都变为 0（图片、视频等）。
  - 原地布局：将内部元素正常布局，但是布局到原地。

  总结下来，有点类似设置了 `height:0;`。

  以下情况失效：

  - 如果元素不生成主体框（如 display: contents 或 display: none 的情况）
  - 如果它的内部显示类型是表格
  - 如果它的主框是一个内部表格框，internal ruby box、非原子、内联级框。

  总结下来失效的情况差不多就是 `display` 为表格相关盒子、ruby-box 相关盒子、`inline` 时，失效。

- layout

  layout-containment 的要素特别多，挑几个重点说说：

  - 创建独立格式化上下文。默认就是一个新的 BFC。
  - 建立一个绝对定位包含块和固定定位包含块。也就是内部元素进行绝对或者固定定位时，会参考 layout-comtainment。
  - 建立层叠上下文。可以使用 zIndex 了。
  - **自身没基线**。这点很微妙，inline-block 盒子时，对齐的是 margin 底部边缘，忽略了其内部文本;inline 盒子时，又是对齐其内部文本基线。
  - 失效情况同 size-contaiment。
  - ... [更多][2]

- style

  style-containment 会进行样式包裹，内部计数器 `counter` 相关属性会重置

- paint

  paint-containment 会对溢出进行剪裁，但是并不会形成滚动容器。效果类似 `overflow:clip`

  - 创建独立格式化上下文。
  - 建立一个绝对定位包含块和固定定位包含块。
  - 建立层叠上下文。
  - 失效情况同 size-contaiment。
  - ... [更多][2]

  总结，类似 layout-containment，但是会剪裁溢出部分，同时不像 layout-containment 一样没有基线。

## content-visibility

## contain-intrinsic-size

## 参考

- [mdn containe][1]
- [CSS Containment Module Level 2][2]
- [CSS Containment Module Level 3][3]

[1]: https://developer.mozilla.org/en-US/docs/Web/CSS/contain
[2]: https://w3c.github.io/csswg-drafts/css-contain-2/
[3]: https://w3c.github.io/csswg-drafts/css-contain-3/#contain-property
