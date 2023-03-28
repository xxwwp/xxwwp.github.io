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

content-visibility 对盒子的内容渲染显示隐藏进行控制，相比其他显示隐藏元素的方式，content-visibility 节约了渲染成本，提高了交互体验。

- content-visibility: visible

  默认值，正常的渲染

- content-visibility: hidden

  设置为 hidden 时，盒子的内容会被隐藏，元素本身不会隐藏，它的 padding、margin、barder 都还会展示。

  - 隐藏的子节点可以被可以被测量。例如使用 getBoundingClientRect 可以拿到元素展开后的实际位置。
  - 降低切换成本，比起 `display:none` 或者直接不在页面中展示元素，content-visibility 切换显示隐藏的效率更高，成本更低。
  - 隐藏后内容被跳过，使用 <kbd>Ctrl</kbd> + <kbd>F</kbd> 搜索不到被隐藏的内容，屏幕阅读器也会跳过隐藏的内容。

- content-visibility: auto

  设置为 `auto` 时情况很复杂，元素会选择适当的时机跳过元素内容，**是跳过不是隐藏**，所以就算跳过，使用屏幕阅读器或者查找页面内容，还是可以查到跳过的内容。

  跳过的内容至于会不会渲染不得而知，W3C 说的不清不楚。不过 W3C 重点强调，这可以用来代替“虚拟列表”技术。说明用户代理会跳过渲染，但不会跳过布局计算。

> 目前的虚拟列表依赖每个项目的高度，也就是说，如果列表的每一项的高度都需要进行精确设置，如果需要自适应，那么开销是非常大的，并且也非常难以完美的实现。但是该技术彻底解决的虚拟列表技术，支持任意的高度且自适应的虚拟列表。

## contentvisibilityautostatechange 事件

contentvisibilityautostatechange 事件监听设置 `content-visibility: auto` 的元素，在元素内容可见性的改变时触发。

该事件携带一个只读布尔属性 **skipped**，表示当前元素是否被跳过，跳过时为 `true`，反之 `false`。

如：

```html
<div id="foo" style="content-visibility: auto"></div>

<script>
  const foo = document.getElementById("foo");

  foo.addEventListener("contentvisibilityautostatechange", (e) => {
    console.log(e.skipped);
  });
</script>
```

## contain-intrinsic-size

## 参考

- [mdn containe][1]
- [CSS Containment Module Level 2][2]
- [CSS Containment Module Level 3][3]

[1]: https://developer.mozilla.org/en-US/docs/Web/CSS/contain
[2]: https://w3c.github.io/csswg-drafts/css-contain-2/
[3]: https://w3c.github.io/csswg-drafts/css-contain-3/#contain-property
