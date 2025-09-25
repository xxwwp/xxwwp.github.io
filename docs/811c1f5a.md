---
id: 811c1f5a-1a41-476e-bbc8-372fddf15f14
title: svg 线条与着色
createAt: 2021-08-08
slug: /docs/svg/线条与着色
prevPage: /docs/svg/简介
nextPage: /docs/svg/渐变
publish: true
tags:
  - svg
  - 线条
  - line
  - 着色
  - stroke
  - 矩形
  - rect
  - 圆形
  - circle
  - 椭圆
  - ellipse
  - 折线
  - polyline
  - 直线
  - 路径
  - path
  - 贝塞尔曲线
  - 弧形
  - 填充
  - 边框
  - 色值
  - 不透明度
  - 描边
  - 填充规则
  - css
archives:
  - 专栏
  - svg
---

## 基本形状

### 矩形

[矩形](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Basic_Shapes#rectangles) 由 `<rect />` 元素组成，有以下属性：

- x：矩形左上角的 x 位置
- y：矩形左上角的 y 位置
- width：矩形的宽度
- height：矩形的高度
- rx：圆角的 x 方位的半径（rx 和 ry 仅设置一个时，值会同时作用在 x 和 y 轴两个方向）
- ry：圆角的 y 方位的半径

示例：

```xml
<rect width="100%" height="100%" fill="red" />
<rect x="50" y="25" width="200" height="150"  rx="30" ry="60" fill="blue" />
```

### 圆形

[圆形](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Basic_Shapes#circle) 由 `<circle />` 元素组成，有以下属性：

- r：圆的半径
- cx：圆心的 x 位置
- cy：圆心的 y 位置

示例：

```xml
<circle r="60" cx="100" cy="100" fill="grey" />
```

### 椭圆

[椭圆](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Basic_Shapes#ellipse) 由 `<ellipse />` 元素组成，有以下属性：

- rx：椭圆的 x 半径
- ry：椭圆的 y 半径
- cx：椭圆中心的 x 位置
- cy：椭圆中心的 y 位置

示例：

```xml
<ellipse cx="75" cy="75" rx="20" ry="5" fill="skyblue" />
```

### 线条

[线条](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Basic_Shapes#%E7%BA%BF%E6%9D%A1) 由 `<line />` 元素组成，有以下属性：

- x1：起点的 x 位置
- y1：起点的 y 位置
- x2：终点的 x 位置
- y2：终点的 y 位置

示例：

```xml
<line x1="10" x2="50" y1="110" y2="150" stroke="orange" stroke-width="10" />
```

其中，`stroke` 和 `stroke-width` 属性设置了线段的颜色和宽度，这两个属性也可以用于其他图形。

### 折线

[折线](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Basic_Shapes#polyline) 由 `<polyline />` 元素组成，用于把各个点连接起来，有一个特有属性：

- points：点集数列。每个数字用空白、逗号、终止命令符或者换行符分隔开。每个点必须包含 2 个数字，一个是 x 坐标，一个是 y 坐标。所以点列表 (0,0), (1,1) 和(2,2)可以写成这样：“0 0, 1 1, 2 2”。

用例：

```xml
<polyline points="100 100,140 100,100 130" stroke="#04f" stroke-width="3" />
```

## 路径

[路径](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths) 由 `<path />` 元素组成，它可以绘制几乎所有二维线条，比如直线，折线，一次二次贝塞尔曲线等等。它有一个特有属性：

- d：一个点集数列以及其它关于如何绘制路径的信息。

属性 `d` 的值由 “命令+参数” 的序列组成。例如 “M 100 50” 这个指令，“M” 代表 “Move to”，“100 50” 是坐标 (100,50)，意思就是把笔触移动到某个点上。

需要注意的是，命令可以大写也可以小写，**大写命令采用绝对定位，小写命令采用相对定位。**

### 直线命令

- “Move to” 移动笔触

  移动笔触的命令是 `M x y` 或者 `m dx dy`。

  这个命令并不会产生新的线条，也不会绘制新的点，仅移动画笔位置，相当于设置了下个命令的起点位置。

- “Line to” 线条绘制

  线条绘制命令是 `L x y` 或者 `l dx dy`。

  这个命令会在当前位置与新位置之间画一条线段。

- “Vertical to” 和 “Horizontal to” 表示垂直绘制与水平绘制

  垂直绘制的命令是 `V y` 或者 `v dy`，水平绘制的命令式 `H y` 或者 `h dy`。

  这两个命令用于沿坐标轴表现绘制线条。是 “Line to” 命令的简写。

- 闭合路径

  闭合路径命令为 `Z` 或者 `z`，**不区分大小写**，它会在当前位置画一条线段到路径的起点，闭合路径不是必须的，并不一定需要设置。通常来说，此命令都是放在最后。

示例：

```xml
<!-- 绘制一个正方形 -->
<path d="M 100 50 h 100 v 100 h -100 z" fill="#fff" />
```

### 贝塞尔曲线

部分曲线命令涉及多个参数，需要注意的是，**小写命令的相对坐标都是基于起点，而不是曲线参数的前一个点。**

- 二次贝塞尔曲线

  二次贝塞尔曲线使用命令 `Q x1 y1, x y` 或者 `q dx1 dy1, dx dy`，其中起点为当前点，命令中第一个点为中间点，最后一个为终点。

- （二次）贝塞尔曲线连续简写

  使用命令 `T x y` 或者 `T dx dy` 可以连续创建二次贝塞尔曲线，单独使用时，它会画一条直线，一般跟在二次贝塞尔曲线后面使用。它会自动创建一个中间点，这个中间点是上一条 `Q` 命令中间点对称当前点后得到的点。

  例如 `M 0 0 Q 100 -100,200 0 T 400 0` 中，`T` 命令隐藏的中间点即为 (100,-100) 对称与 (200,0) 的点，即 (300,100)。所以最后这整条贝塞尔曲线的点依次是 (0,0)、(100,-100)、(200,0)、(300,100)、(400,0)。

- 三次贝塞尔曲线

  三次贝塞尔曲线使用命令 `C x1 y1, x2 y2, x y` 或者 `c dx1 dy1, dx2 dy2, dx dy`，其中起点为当前点，命令中的前两个点为中间点，最后一个点为终点。

- （三次）贝塞尔曲线连续简写

  使用命令 `S x2 y2, x y` 或者 `s dx2 dy2, dx dy` 也可以连续创建三次贝塞尔曲线。虽然这个命令只有一个中间点，但当 “S or s” 命令跟在一个 “C or S” 命令后面时，它会自动增加一个中间点，这个增加的中间点的位置在前一个命令最后控制点基于当前点的对称点。[参见这里](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths#bezier_curves)。

  例如命令 `M 0 0 C 100 -100,200 100,300 0 s 500 100, 600 0` 中，`s` 命令会自动增加一个中间点，这个点的位置是 (200,100) 基于 (300,0) 对称的点，即 (400,-100)。所以最后这整条贝塞尔曲线的点依次是 (0,0)、(100,-100)、(200,100)、(300,0)、(400,-100)、(500,100)、(600,0)。

示例：

```xml
<!-- 二次贝塞尔曲线 -->
<path d="M70 110 q 100 0, 100 100 " stroke="black" fill="transparent" />
<!-- 连续二次贝塞尔曲线 -->
<path d="M 0 100 q 100 -100 , 200 0 t 200 0 " stroke="blue" stroke-width="2" />
<!-- 三次贝塞尔曲线 -->
<path d="M70 110 C 70 140, 110 140, 110 110" stroke="black" fill="transparent"/>
<!-- 连续三次贝塞尔曲线 -->
<path d="M 0 100 c 100 -100 , 200 100 , 300 0 s 200 100,300 0" stroke="blue" stroke-width="2" />
```

### 弧形

[弧形](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths#arcs) 可以绘制椭圆或者圆形上的圆弧，它的命令是：

```
A rx ry x-axis-rotation large-arc-flag sweep-flag x y
a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
```

- `rx ry` 为垂直半径和水平半径。

- `x-axis-rotation` 为旋转角度。

- `large-arc-flag` 决定弧线是大于还是小于 180 度，0 表示小角度弧，1 表示大角度弧。

- `sweep-flag` 表示弧线的方向，0 表示从起点到终点沿逆时针画弧，1 表示从起点到终点沿顺时针画弧。

- `x y (or dx dy)` 为圆弧的终点位置。

示例：

```xml
<!-- 整个大波浪 -->
<path d="M 0 100 a 50 50, 0, 0, 0, 100 0 a 50 50, 0, 0, 1, 100 0" stroke="#fff" stroke-width="3" />
```

## 填充和边框

可以使用 [Fill 和 Stroke 相关属性](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Fills_and_Strokes#fill_and_stroke_attributes) 来对 svg 图形进行上色。

### 色值

`fill` 主要用于填充对象内部的颜色，比如圆形内部，矩形内部，或者路径相邻节点包裹的部分。`stroke` 用于给线条上色，比如单纯的直线，或者矩形的边，或者路径绘制的路线。

`fill` 和 `stroke` 的色值和 CSS 一样，比如 `red、green、#fff、#ff0092、rgb(200,134,219)、rgba(23,92,144,0.4)` 等等。

### 不透明度

还可以使用 `fill-opacity` 和 `stroke-opacity` 来设置上色的透明度。如果觉得麻烦，可以直接设置具有不透明度的色值，比如 rgba 颜色。

我实验过后显示效果是一致的。

### 描边

默认情况下，边框是没有宽度的，可以使用 `stroke-width` 来显示边的宽度。

当边宽到一定程度时，线的首末，拐点会出现明显的锯齿，默认情况下，它们都没有过渡，使用直角显示。

可以使用 `stroke-linecap` 来控制首末点的形状，`stroke-linecap` 有三个可能值：

- `butt` 用直边结束线段，它是常规做法，线段边界 90 度垂直于描边的方向、贯穿它的终点。

- `square` 的效果差不多，但是会稍微超出实际路径的范围，超出的大小由 `stroke-width` 控制。

- `round` 表示边框的终点是圆角，圆角的半径也是由 `stroke-width` 控制的。

示例：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="300" height="230">
  <rect width="100%" height="100%" fill="silver" rx="5" />
  <text x="50" y="25" font-size="20px" fill="white">stroke-linecap="butt"</text>
  <path d="M 50 50 l 100 0" stroke="black" stroke-width="20" stroke-linecap="butt" />
  <path d="M 50 50 l 100 0" stroke="white" stroke-width="1" />
  <text x="50" y="100" font-size="20px" fill="white">stroke-linecap="square"</text>
  <path d="M 60 125 l 100 0" stroke="black" stroke-width="20" stroke-linecap="square" />
  <path d="M 60 125 l 100 0" stroke="white" stroke-width="1" />
  <text x="50" y="175" font-size="20px" fill="white">stroke-linecap="butt"</text>
  <path d="M 60 200 l 100 0" stroke="black" stroke-width="20" stroke-linecap="round" />
  <path d="M 60 200 l 100 0" stroke="white" stroke-width="1" />
</svg>

还可以使用 `stroke-linejoin` 来控制线条连接处的形状，`stroke-linejoin` 也有三个可能值：

- `miter` 用一个角处理连接处。

- `round` 用圆角处理连接处。

- `bevel` 用两个角处理连接处，看上去会比 `miter` 更加自然些。

示例：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="300" height="400">
  <rect width="100%" height="100%" fill="silver" rx="5" />
  <text x="50" y="25" font-size="20px" fill="white">stroke-linejoin="miter"</text>
  <path
    d="M 100 100 l 50 -50 l 50 50"
    stroke="black"
    stroke-width="20"
    fill="transparent"
    stroke-linejoin="miter"
  />
  <path d="M 100 100 l 50 -50 l 50 50" stroke="white" stroke-width="1" fill="transparent" />
  <text x="50" y="150" font-size="20px" fill="white">stroke-linejoin="round"</text>
  <path
    d="M 100 225 l 50 -50 l 50 50"
    stroke="black"
    stroke-width="20"
    fill="transparent"
    stroke-linejoin="round"
  />
  <path d="M 100 225 l 50 -50 l 50 50" stroke="white" stroke-width="1" fill="transparent" />
  <text x="50" y="275" font-size="20px" fill="white">stroke-linejoin="bevel"</text>
  <path
    d="M 100 350 l 50 -50 l 50 50"
    stroke="black"
    stroke-width="20"
    fill="transparent"
    stroke-linejoin="bevel"
  />
  <path d="M 100 350 l 50 -50 l 50 50" stroke="white" stroke-width="1" fill="transparent" />
</svg>

**还可以使用 `stroke-dasharray` 指定虚线类型的描边，这个属性的值由数字和逗号组成。描边时，会依次按照值的顺序交替着色。**

比如：

```xml
<path d="M 0 50 c 100 -100,200 100,300 0" stroke-dasharray="3,4,5" fill="transparent" stroke="blue" />
```

上面代码产生的蓝色线条如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="300" height="100">
  <rect width="100%" height="100%" fill="silver" rx="5" />
  <path d="M 0 50 c 100 -100,200 100,300 0" stroke-dasharray="3,4,5" fill="transparent" stroke="blue" />
</svg>

虚线的值设置为 `3,4,5`，虚线着色顺序如下：

| 着色 | 不着色 | 着色 | 不着色 | 着色 | 不着色 | 着色 | ... |
| ---- | ------ | ---- | ------ | ---- | ------ | ---- | --- |
| 3    | 4      | 5    | 3      | 4    | 5      | 3    | ... |

> 另外还有一些关于边框的属性，[stroke-miterlimit](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/stroke-miterlimit)，定义什么情况下绘制或不绘制边框连接的 miter 效果；还有 [stroke-dashoffset](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/stroke-dashoffset)，定义虚线开始的位置。

### 填充规则 fill-rule

`fill-rule` 属性用来决定如何判断一个点在图形的内部还是外部，只有内部区域的点才会被 `fill` 属性上色。

它有两个值：

- `nonzero`：

  > 这个值确定了某点属于该形状的“内部”还是“外部”：从该点向任意方向的无限远处绘制射线，然后检测形状与射线相交的位置。从 0 开始统计，路径上每一条从左到右（顺时针）跨过射线的线段都会让结果加 1，每条从右向左（逆时针）跨过射线的线段都会让结果减 1。当统计结束后，如果结果为 0，则点在外部；如果结果不为 0，则点在内部。

  可以理解为在在图形里任取一点向外作射线，射线会穿过图形的路径，路径是有方向的。如果射线两侧穿过射线线条数量相同，则这个点在外部。

- `evenodd`：

  > 这个值用确定了某点属于该形状的“内部”还是“外部”：从该点向任意方向无限远处绘制射线，并统计这个形状所有的路径段中，与射线相交的路径段的数量。如果有奇数个路径段与射线相交，则点在内部；如果有偶数个，则点在外部。

  类似上面个属性，该属性通过射线穿过路径的奇偶性来判断一个点是否在内部。

示例：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="380" height="160">
  <rect width="100%" height="100%" fill="silver" rx="5" />
  <!-- 两个顺时针 -->
  <path
    d="M 20 20 h 100 v 100 h -100 v -100 m 15 15 h 70 v 70 h -70 v -70"
    fill="tomato"
    stroke="blue"
    fill-rule="nonzore"
  />
  <text x="40" y="140">nonzore</text>
  <!-- 外层顺时针，内层逆时针 -->
  <path
    d="M 140 20 h 100 v 100 h -100 v -100 m 15 15 v 70 h 70 v -70 h -70"
    fill="tomato"
    stroke="blue"
    fill-rule="nonzore"
  />
  <text x="160" y="140">nonzore</text>
  <!-- 奇偶区域 -->
  <path
    d="M 260 20 h 100 v 100 h -100 v -100 m 15 15 h 70 v 70 h -70 v -70 m 15 15 h 40 v 40 h -40 v -40"
    fill="tomato"
    stroke="blue"
    fill-rule="evenodd"
  />
  <text x="280" y="140">evenodd</text>
</svg>
```

绘制样式如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="380" height="160">
  <rect width="100%" height="100%" fill="silver" rx="5" />
  <!-- 两个顺时针 -->
  <path
    d="M 20 20 h 100 v 100 h -100 v -100 m 15 15 h 70 v 70 h -70 v -70"
    fill="tomato"
    stroke="blue"
    fill-rule="nonzore"
  />
  <text x="40" y="140">nonzore</text>
  <!-- 外层顺时针，内层逆时针 -->
  <path
    d="M 140 20 h 100 v 100 h -100 v -100 m 15 15 v 70 h 70 v -70 h -70"
    fill="tomato"
    stroke="blue"
    fill-rule="nonzore"
  />
  <text x="160" y="140">nonzore</text>
  <!-- 奇偶区域 -->
  <path
    d="M 260 20 h 100 v 100 h -100 v -100 m 15 15 h 70 v 70 h -70 v -70 m 15 15 h 40 v 40 h -40 v -40"
    fill="tomato"
    stroke="blue"
    fill-rule="evenodd"
  />
  <text x="280" y="140">evenodd</text>
</svg>

- 第一个图形

  可以看到两个顺时针矩形包裹时，最里面的区域任意一点向外做射线，均为顺时针方向线条穿过射线，所以最里面区域为 “内部”。

- 第二个图形

  因为内层的框是逆时针绘制，最里面的区域任意一点向外做射线，穿过射线的线条顺时针方向与逆时针方向的数量相同，所以最里面区域为 “外部”。

- 第三个图形

  这个很容易理解，射线穿出时，穿过奇数数量的线条的区域即是内部，所以只有中间层被称为 “外部”。

## 使用 CSS

> [SVG](https://www.w3.org/TR/SVG/propidx.html) 规范将属性区分成 properties 和其他 attributes，前者是可以用 CSS 设置的，后者不能。

定义位置大小路径等等的属性是不能使用 css 设置的，但是填充和描边的相关属性就可以。

在 svg 中使用 css 和 HTML 中类似，比如 **内联方式**：

```xml
<rect style="fill: silver" width="100%" height="100%" rx="5" />
```

**如果使用内部样式表，可以把样式写在 `<defs>` 元素内，这个元素在 svg 中代表定义**，如：

```html
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="160" height="160">
  <defs>
    <style type="text/css">
      <![CDATA[
            .rect-bg {
              fill: silver;
            }
            .path-s {
              fill: tomato;
              stroke: blue;
              fill-rule: evenodd;
            }
          ]]>
    </style>
  </defs>
  <rect style="fill: silver" width="100%" height="100%" rx="5" />
  <path
    d="M 30 30 h 100 v 100 h -100 v -100 m 15 15 h 70 v 70 h -70 v -70 m 15 15 h 40 v 40 h -40 v -40"
    class="path-s"
  />
</svg>
```

还可以是外部样式表，比如：

```xml
<?xml version="1.0" standalone="no"?>
<?xml-stylesheet type="text/css" href="style.css"?>

<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect height="10" width="10" id="MyRect"/>
</svg>
```

但是切记，`width`、`height`、`x`、`y`、`d` 等等属性是不能使用 css 设置的。
