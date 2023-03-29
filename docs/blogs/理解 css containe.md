---
title: 理解 css containe 属性
slug: /docs/blogs/理解 css containe 属性
createAt: 2023-03-16
publish: false
tags:
  - css
  - containe
  - content-visibility
archives:
  - 博客
---

## containe 属性

W3C containe 属性定义：

|                          |                                                                                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name 名称:               | contain                                                                                                                                                                             |
| Value 值:                | none &VerticalLine; strict &VerticalLine; content &VerticalLine; [ size &VerticalLine;&VerticalLine; layout &VerticalLine;&VerticalLine; style &VerticalLine;&VerticalLine; paint ] |
| Initial 初始值:          | none                                                                                                                                                                                |
| Applies to 适用于:       | See below （见下文）                                                                                                                                                                |
| Inherited 继承:          | no                                                                                                                                                                                  |
| Percentages 百分比:      | n/a                                                                                                                                                                                 |
| Computed value 计算值:   | the keyword none or one or more of size, layout, paint （仅为 ‘none’ 或者由 ‘size’，‘layout’，‘paint’ 组合）                                                                        |
| Canonical order:         | per grammar                                                                                                                                                                         |
| Animation type 动画类型: | not animatable （不可动画）                                                                                                                                                         |

> 目前没有明确的翻译说明该值的表示的意义，W3C 使用 “containment” 表述 containe 属性的效果，以下使用 “拦截” 来对应 “containment” 的翻译。后文说到拦截时，表示 containe 属性各个值产生的效果。也可以翻译成“包含”或“遏制”。

- none

  该值无效，元素正常呈现，没有拦截效果。

- strict

  该值会为元素打开所有拦截，根据定义是 layout paint size style 四种拦截。

- content

  该值打开 layout paint style 三种拦截，不包括 style 拦截。

- **size**

  改值打开了元素的尺寸限制，设置后元素大小不检查后代。

- **layout**

  该值打开了元素的布局拦截，其内部的布局对于外部是不透明的，外部任何东西不会影响其内部布局，反之亦然。

- **style**

  该值打开样式拦截，确定了一些会对元素及其后代产生影响的属性，不会脱离元素。

- **paint**

  该值打开了绘制拦截，确保了元素内部的绘制不会超出拦截框。

W3C 中一段话比较让人注意：

> Additionally, when any containments are active on either the HTML html or body elements, propagation of properties from the body element to the initial containing block, the viewport, or the canvas background, is disabled. Notably, this affects:
>
> writing-mode, direction, and text-orientation (see CSS Writing Modes 3 § 8 The Principal Writing Mode)
>
> overflow and its longhands (see CSS Overflow 3 § 3.3 Overflow Viewport Propagation)
>
> background and its longhands (see CSS Backgrounds 3 § 2.11.2 The Canvas Background and the HTML &lt;body&gt; Element)
>
> --- [CSS Containment Module Level 2][2]

大致翻译是任何拦截 **如果被作用到 `html` 或者 body 元素上时，那么从 body 元素到初始包含块、视口或 canvas 背景的属性将禁止传播**，这会影响到：

- writing-mode，direction，和 text-orientation
- **overflow 及其缩写**
- **background 及其缩写**

这是比较重要的一点，虽然第一条平常用不到，但是 overflow 和 background 属性禁止传播到视口的话，布局时会造成一些意外的效果。

比如：

```css
body {
  contain: layout;
  overflow: hidden;
}
```

默认情况下，overflow 作用到 html 或者 body 元素上时，会被代理到视口上，设置 `overflow: hidden` 的话，视口的滚动条会被禁用，但是上面的定义中，如果 html 或 body 元素上有 contain 拦截，那么传播会禁止，视口的 overflow 还是默认值 `auto`，页面的滚动条不会消失。

同理，background 的作用也会发生变化，当 html 或者 body 元素有 contain 拦截效果时，背景将不会作用到视口上。比如：

```css
body {
  contain: layout;
  background: red;
}
```

此时 background 不会代理到视口上，只是作用到 body 元素上。

## containe 拦截

### size

- 空大小：元素的大小忽略子节点布局（包括伪元素子节点），非替换元素宽高都变为 0（图片、视频等）。
- 原地布局：将内部元素正常布局，但是布局到原地。

总结下来，有点类似设置了 `height:0;`。

以下情况失效：

- 如果元素不生成主体框（如 display: contents 或 display: none 的情况）
- 如果它的内部显示类型是表格
- 如果它的主框是一个内部表格框，internal ruby box、非原子、内联级框。

总结下来失效的情况差不多就是 `display` 为表格相关盒子、ruby-box 相关盒子、`inline` 时，失效。

示例：

```css
#foo {
  contain: size;
  border: 2px solid red;
}
```

`#foo` 元素被声明成 size 拦截，`contain: size` 声明会忽略子级的布局，`#foo` 会像没有子级一样布局，子级依旧会渲染并溢出。

### layout

layout 拦截的要素特别多，挑几个重点说说：

- 创建独立格式化上下文。默认就是一个新的 BFC。
- 建立一个绝对定位包含块和 **固定定位包含块**。也就是内部元素进行绝对或者固定定位时，会参考 layout 拦截。
- 建立层叠上下文。可以使用 zIndex 了。
- **自身没基线**。这点很微妙，inline-block 盒子时，对齐的是 margin 底部边缘，忽略了其内部文本;inline 盒子时，又是对齐其内部文本基线。
- 失效情况同 size 拦截。
- ... [更多][2]

layout 拦截产生的效果中，很厉害的一点就是产生了一个固定定位包含块，这使得其内部元素使用固定定位的时候，会参考该包含块而不是视口。

例如如下样式：

```css
#foo {
  contain: layout;
  width: 300px;
  height: 300px;
  border: 1px solid red;
}

#foo > #bar {
  width: 50px;
  height: 30px;
  background-color: aqua;
  position: fixed;
  right: 20px;
}
```

如果没有产生 layout 拦截，那么 `#bar` 元素应该会相对视口的包含块进行定位，但是设置 layout 拦截后，`#bar` 元素就会场 `#foo` 元素产生的固定定位包含块进行定位，离谱吧。

### style

style 拦截会进行样式包裹，内部计数器 `counter` 相关属性会重置。这个点其实就是独立出了计数器计算，和外部计数器隔离。

### paint

paint 拦截会对溢出进行剪裁，但是并不会形成滚动容器。效果类似 `overflow:clip`

- 创建独立格式化上下文。
- 建立一个绝对定位包含块和固定定位包含块。
- 建立层叠上下文。
- 失效情况同 size-contaiment。
- ... [更多][2]

总结，**类似 layout 拦截，但是会剪裁溢出部分，同时不像 layout 拦截一样没有基线。**

需要注意的是，paint 拦截产生的剪裁类似 `overflow:clip`，不会对内部的粘性定位元素产生影响。

## content-visibility

content-visibility 属性也在 [CSS Containment Module Level 2][2] 规范中，这里一起总结下。

W3C 属性定义：

|                  |                                                   |
| ---------------- | ------------------------------------------------- |
| Name:            | content-visibility                                |
| Value:           | visible &VerticalLine; auto &VerticalLine; hidden |
| Initial:         | visible                                           |
| Applies to:      | elements for which size containment can apply     |
| Inherited:       | no                                                |
| Percentages:     | n/a                                               |
| Computed value:  | as specified                                      |
| Canonical order: | per grammar                                       |
| Animation type:  | not animatable                                    |

content-visibility 对盒子的内容渲染显示隐藏进行控制，相比其他显示隐藏元素的方式，content-visibility 节约了渲染成本，提高了交互体验。

### visible

默认值，正常的渲染

### hidden

设置为 hidden 时，盒子的内容会被隐藏，元素本身不会隐藏，它的 padding、margin、barder 都还会展示。

- 隐藏的子节点可以被可以被测量。例如使用 getBoundingClientRect 可以拿到元素展开后的实际位置。
- 降低切换成本，比起 `display:none` 或者直接不在页面中展示元素，content-visibility 切换显示隐藏的效率更高，成本更低。
- 隐藏后内容被跳过，使用 <kbd>Ctrl</kbd> + <kbd>F</kbd> 搜索不到被隐藏的内容，屏幕阅读器也会跳过隐藏的内容。

### auto

设置为 `auto` 时情况很复杂，元素会选择适当的时机跳过元素内容，**是跳过不是隐藏**，所以就算跳过，使用屏幕阅读器或者查找页面内容，还是可以查到跳过的内容。

> `auto` 的效果不是来回切换 `visible` 与 `hidden`，而是一种新的自动跳过渲染的效果。

跳过的内容至于会不会渲染不得而知，W3C 说的不清不楚。不过 W3C 重点强调，这可以用来实现“虚拟列表”技术。说明用户代理会跳过渲染，但不会跳过布局计算。

目前的虚拟列表技术依赖每个项目的高度，例如 [react-window][4]。也就是说，列表的每一项的高度都需要进行精确设置，如果需要自适应，那么开销是非常大的，并且也非常难以完美的实现。

`content-visibility: auto` 也没有彻底解决的虚拟列表技术，任意的高度或自适应的虚拟列表，在其中展示会有 bug，还有待加强。

例如如下代码：

```html
<style>
  #foo {
    width: 300px;
    height: 300px;
    border: 1px solid red;
    overflow: auto;
  }

  #foo > div {
    content-visibility: auto;
    /* contain-intrinsic-height: auto 1lh; */
  }
</style>

<div id="foo"></div>

<script>
  const foo = document.getElementById("foo");
  for (let i = 0; i < 10000; i++) {
    const child = document.createElement("div");
    child.innerHTML = i + "哈哈哈";
    foo.appendChild(child);
  }
</script>
```

这是一个长列表的渲染，使用 `content-visibility: auto;` 后浏览器会跳过看不到的内部 `div` 进行渲染，节省了渲染开销，但是浏览器不知道这些跳过渲染的 div 大小，所以在拖动滚动条时会出现一定程度的 bug，拖动滚动条会产生闪烁。

取消掉 `contain-intrinsic-height` 属性注释，该声明设置这些子级元素的固有高度，因为示例中文本每个容器文本只有一行，我们设置成 `1lh`，就是这些子容器原本的高度。这提供给浏览器跳过不可见元素时保留的固有高度，滚动条的渲染会正常。

现在拖动进度条，会发现元素并不是事先渲染好放在那里的，而是进入可见范围后，才进行渲染。

可以通过注释掉 `#foo > div` 的声明块进行测试。

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

## contain-intrinsic-\*

[contain-intrinsic-\*][5] 用来设置用来设置元素产生 contain 拦截时其固有大小，用以辅助浏览器排版。

## 参考

- [mdn containe][1]
- [CSS Containment Module Level 2][2]
- [CSS Containment Module Level 3][3]
- [react-window][4]
- [CSS Box Sizing Module Level 4][5]

[1]: https://developer.mozilla.org/en-US/docs/Web/CSS/contain
[2]: https://w3c.github.io/csswg-drafts/css-contain-2/
[3]: https://w3c.github.io/csswg-drafts/css-contain-3/
[4]: https://github.com/bvaughn/react-window
[5]: https://w3c.github.io/csswg-drafts/css-sizing-4/
