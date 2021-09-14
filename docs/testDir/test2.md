---
title: "test2"
slug: testDir/test.html
createAt: 2021-09-10
---

## 简介

_动画时间属性_ 指定了整个动画的运动周期，以及什么时候开始运动或者什么时候结束运动。

> 如果你不是能看懂后续的属性定义，可以查看 [FAQ](#FAQ) 部分。

## 属性列表

- [begin](#begin)，指定动画开始时间。

- [dur](#dur)，指定动画的持续时间。

- [end](#end)，限制动画持续时间的结束值。

- [min](#min)，指定动画持续时间的最小值。

- [max](#max)，指定动画持续时间的最大值。

- [restart](#restart)，设置动画重启的行为。

- [repeatCount](#repeatCount)，设置每次启动动画执行多少周期。

- [repeatDur](#repeatDur)，指定动画持续时间时间的总值。

- [fill](#fill)，指定是否保留动画停止时的效果。
  i

### begin

`begin` 属性用来确定动画是如何开始的，它的值是 `<begin-value-list>` 类型，[MDN][c1] 上有它值详细的描述，但是 MDN 上没有每种值类型进行详细的解析，你可以在 [W3C][c2] 上找到详细文档。

`<begin-value-list>` 的类型如下：

```
begin-value-list ::= begin-value (S? ";" S? begin-value-list )?
```

这个类型可能有点付费脑，解释下。简单的理解就是 begin-value-list 可有至少一个 begin-value 类型的值，如果有多个，使用 “;” 连接。其中，begin-value 可以是以下值类型：

```
begin-value ::= ( offset-value | syncbase-value | event-value | repeat-value | accessKey-value | wallclock-sync-value | "indefinite" )
```

各个类型的定义又如下：

- **offset-value ::= ( S? "+" | "-" S? )? ( [Clock-value][3] )**

  一个偏移 [时钟值][3]。就比如 `1h`、`-30min`、`30s`、`-8000ms` 等等。一般来说它是相对文档加载完成的事件时间，比如 HTML 中可能是 `DOMContentLoaded` 事件。

- **syncbase-value ::= ( Id-value "." ( "begin" | "end" ) ) ( S? ("+"|"-") S? [Clock-value][3] )?**

  该值可以同步时间到其他动画的开始或者结束时间点或其偏移量，Id-value 指定了另一个动画的 id。

  比如 A、B 两个动画元素，其中 A 与 B 为它们的 id。现在我们需要让 B 在 A 结束时播放，那么就可以设置 B 动画元素为 `begin="A.end"`，如果还需要向后偏移 3s，那么可以设置为 `begin="A.end + 3s"`。你可以查看 [Ex_offset-value_syncbase-value](#Ex_offset-value_syncbase-value) 示例。

- **event-value ::= ( Id-value "." )? ( event-ref ) ( S? ("+"|"-") S? [Clock-value][3] )?**

  该值通过其他元素的事件来设置时间，Id-value 为参考元素的 id，event-ref 为事件参考，它不一定支持所有事件，你可以在 [MDN][c1]) 上看到可用事件汇总。

  比如让你想让用户点 A 元素时执行 click 事件时调用 B 动画，就可以设置 B 动画的 `begin` 属性 为 `begin="A.click"`。可以查看 [Ex_event-value](#Ex_event-value) 示例。

- **repeat-value ::= ( Id-value "." )? "repeat(" integer ")" ( S? ("+"|"-") S? [Clock-value][3] )?**

  该值指定当前的播放参考其他动画的循环周期时间点。比如 A 动画一个周期会循环三次，我们想让 B 动画在 A 的每个周期第 2 次循环时播放，那么就可以设置 B 的属性为 `begin="A.repeat(2)"`。示例参考 [Ex_repeat-value](#Ex_repeat-value)

- accessKey-value ::= "accessKey(" character ")" ( S? ("+"|"-") S? [Clock-value][3] )?

  该值指定动画播放的快捷键，它和 HTML 属性 `accesskey` 几乎一样。**但是这个属性各大浏览器没有实现，未来也不一定实现。**

  使用比较简单，比如 `begin="accessKey(a)"`。

- wallclock-sync-value ::= "wallclock(" wallclock-value ")"

  该值使用真实世界时钟的时间进行设置。语法为 ISO8601 格式。**但是万分注意，这个东西各大主流浏览器都没有实现，未来也不一定会实现。**

  使用比如 `begin="wallclock(2021-09-01T11:17:20+08:00)"` ，这是我写到这段文字的时间。很可惜，和 accesskey-value 一样，这个功能我在 Chrome 93.0 都不支持，未来估计也不会支持。

- **"indefinite"**

  该值表示不确定开始时间。设置该值后，动画只能通过调用 DOM 接口提供的 `beginElement()` 或者点击指向该动画元素的超链接播放。

  你可以查看示例 [Ex_Indefinite](#Ex_Indefinite)

### dur

dur 用来指定动画的持续时间，也可以理解为该动画的一个周期。

类型：

- dur = [Clock-value][3] | "media" | "indefinite"

- **[Clock-value][3] 时钟值**

  类似 1h、2s、-300ms 这样的数值。例如你想让动画执行一次的周期为一秒，那么可以设置为 `dur="1s"`。

- "media" 媒介值

  该值把持续时间设置为固有媒介元素的播放时间，它仅对媒介元素有效。如果动画指定的元素是一个 svg 图形，那么该值将被忽略。

- "indefinite" 未定

  该值指定了动画的时间为无限期。意义不大。

### end

**end 用于限制动画播放持续时间的结束值。在 end 之后任何方式都不允许再启动动画，如果没有指定 min 属性，那么正在播放的动画也会在 end 时间点停止。**

类型：

- end = "end-value-list"

- end-value-list ::= end-value (S? ";" S? end-value-list )?

- end-value ::= ( offset-value | syncbase-value | event-value | repeat-value | accessKey-value | wallclock-sync-value | "indefinite" )

这些类型参见 [begin](#begin)。

比较特殊的是，当设置 `end="indefinite"` 时，你可以使用 DOM 提供的 `endElement()` 方法来终止动画。

示例：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="200" height="50" viewBox="0 0 20 5">
	<rect x="0" y="0" height="5" width="7" fill="#f0f">
		<animate attributeName="width" values="7;20" dur="3s" end="1s"></animate>
	</rect>
</svg>
```

上述代码的动画周期为 3s，但是动画播放时间被限制到了 1s 内，因为没有设置 min 属性，所以动画在 1s 时间点就会立即停止。

### min

**min 属性指定了播放持续时间的最小值，正在播放的动画在此期间会正常显示。在 min 期间正在播放的动画不会因为 end 属性的时间停止。**

类型：min = [Clock-value][3] | "media"

min 属性的默认值为 0，表示不限制播放持续时间最小值。

示例：

参考上一节示例，动画会在 1s 时停止，你可以为 animate 元素设置 `min="3s"`，那么动画在 3s 内不会因为 end 停止。

### max

**max 属性指定了播放持续时间的最大值，正在播放的动画如果超出此时间会立即停止，类似 end 属性的行为。**

类型：max = [Clock-value][3] | "media"

max 没有默认值，所以默认情况下不会限制动画的播放。

还有不要把 max 设置得比 min 还大，这根本没有意义。

它的使用参考 [end](#end) 与 [min](#min) 示例。

### restart

restart 用来设置动画第 2 次及第二次以上的启动行为。

类型：restart = "always" | "whenNotActive" | "never"

- "always"

  指定了不论动画播放期间或者停止时都可以重启动画。

- "whenNotActive"

  指定了动画仅能在停止期间重启，正在播放的动画将不能重启。

- "never"

  指定了动画无法重启。

其中默认值为 "always"。

示例：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="200" height="150" viewBox="0 0 20 15">
	<rect id="Restart1" x="0" y="0" height="5" width="7" fill="#f0f">
		<animate attributeName="width" values="7;20;7" dur="3s" begin="Restart1.click"></animate>
	</rect>
	<rect id="Restart2" x="0" y="5" height="5" width="7" fill="#0ff">
		<animate
			attributeName="width"
			values="7;20;7"
			dur="3s"
			begin="Restart2.click"
			restart="whenNotActive"
		></animate>
	</rect>
	<rect id="Restart3" x="0" y="10" height="5" width="7" fill="#ff0">
		<animate attributeName="width" values="7;20;7" dur="3s" begin="Restart3.click" restart="never"></animate>
	</rect>
</svg>
```

上面代码一次作用了三种重启行为，它们都是通过点击方块来启动，每个方块你都可以快速点击尝试，效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="200" height="150" viewBox="0 0 20 15">
	<rect id="Restart1" x="0" y="0" height="5" width="7" fill="#f0f">
		<animate attributeName="width" values="7;20;7" dur="3s" begin="Restart1.click"></animate>
	</rect>
	<rect id="Restart2" x="0" y="5" height="5" width="7" fill="#0ff">
		<animate
			attributeName="width"
			values="7;20;7"
			dur="3s"
			begin="Restart2.click"
			restart="whenNotActive"
		></animate>
	</rect>
	<rect id="Restart3" x="0" y="10" height="5" width="7" fill="#ff0">
		<animate attributeName="width" values="7;20;7" dur="3s" begin="Restart3.click" restart="never"></animate>
	</rect>
</svg>

### repeatCount

repeatCount 用来设置每次动画启动时重复的次数。

类型：repeatCount = numeric value | "indefinite"

- numeric value

  单纯的数字，比如像重复 10 次可以写为 `repeatCount="10"`。

- "indefinite"

  设置为该值时动画将无限次重复。

当没有指定该值时，默认值为 1。

下面的代码中，动画启动后将无限次循环：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="200" height="50" viewBox="0 0 20 5">
	<rect id="RepeatCount" x="0" y="0" height="5" width="7" fill="#f0f">
		<animate attributeName="width" values="7;20;7" dur="3s" repeatCount="indefinite" begin="RepeatCount.click" ></animate>
	</rect>
</svg>
```

效果如下，通过点击方块触发动画：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="200" height="50" viewBox="0 0 20 5">
	<rect id="RepeatCount" x="0" y="0" height="5" width="7" fill="#f0f">
		<animate attributeName="width" values="7;20;7" dur="3s" repeatCount="indefinite" begin="RepeatCount.click" ></animate>
	</rect>
</svg>

### repeatDur

repeatDur 用来每次动画执行后的总持续时间，超出该时间动画将自动停止。

它常常配合 `repeatCount="indefinite"` 来使用。

类型：repeatDur = [Clock-value][3] | "indefinite"

- [Clock-value][3]

  持续时间的时钟值，如 1h、30s 等等。

- "indefinite"

  动画持续时间不受到限制。

默认值为 "indefinite"。

示例：

你可以在上节 [repeatCount](#repeatCount) 的示例中设置该属性，它会限制无限次的周期动画。

### fill

fill 用来指定动画结束时效果是否保留。

有的动画并不一定是周期性的，开始和结束并不会重合，那么在动画结束后对象就会闪烁回到初始状态。如果想要保留动画停止时的状态，就可以使用该属性指定。

类型：fill = "freeze" | "remove"

- "freeze"

  该值会在动画停止时冻结当时的状态。

- "remove"

  该值会在动画停止时删除动画效果，回到对象默认状态。

默认值为 "remove"。

比如我们希望拉长一个矩形并使用动画过渡，那么 fill 属性就派上用场：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="200" height="50" viewBox="0 0 20 5">
	<rect id="RepeatCount" x="0" y="0" height="5" width="7" fill="#f0f">
		<animate attributeName="width" values="7;20" dur="3s" begin="RepeatCount.click" fill="freeze"></animate>
	</rect>
</svg>
```

你可以通过点击下方矩形来查看动画保留效果：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="200" height="50" viewBox="0 0 20 5">
	<rect id="Fill" x="0" y="0" height="5" width="7" fill="#f0f">
		<animate attributeName="width" values="7;20" dur="3s" begin="Fill.click" fill="freeze"></animate>
	</rect>
</svg>

## 示例

### Ex_offset-value_syncbase-value

下面的代码使用 `begin` 属性来演示 offset-value 与 syncbase-value 值类型的

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="200" height="200" viewBox="0 0 2.2 2.2">
	<path
		d="M 1.1 0.1 l 0.866 1.5 l -1.732 0 z M 1.1 2.1 l -0.866 -1.5 l 1.732 0 z"
		fill="black"
		stroke="skyblue"
		stroke-width="0.05"
	>
		<animateTransform
			id="ExOffsetA"
      attributeType="XML"
			attributeName="transform"
			begin="-1000ms; ExSyncbaseB.end;"
			type="rotate"
			from="0 1.1 1.1"
			to=" 360 1.1 1.1"
			dur="3s"
			repeatCount="1"
		></animateTransform>
		<animate
			id="ExSyncbaseB"
			begin="ExOffsetA.end + 1s"
			attributeName="fill"
			values="#000;#f0f;#000"
			dur="3s"
			repeatCount="1"
		></animate>
	</path>
</svg>
```

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="200" height="200" viewBox="0 0 2.2 2.2">
	<path
		d="M 1.1 0.1 l 0.866 1.5 l -1.732 0 z M 1.1 2.1 l -0.866 -1.5 l 1.732 0 z"
		fill="black"
		stroke="skyblue"
		stroke-width="0.05"
	>
		<animateTransform
			id="ExOffsetA"
      attributeType="XML"
			attributeName="transform"
			begin="-1000ms; ExSyncbaseB.end;"
			type="rotate"
			from="0 1.1 1.1"
			to=" 360 1.1 1.1"
			dur="3s"
			repeatCount="1"
		></animateTransform>
		<animate
			id="ExSyncbaseB"
			begin="ExOffsetA.end + 1s"
			attributeName="fill"
			values="#000;#f0f;#000"
			dur="3s"
			repeatCount="1"
		></animate>
	</path>
</svg>

### Ex_event-value

下面代码的动画会在圆形被点击时触发：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="200" height="200" viewBox="0 0 10 10 ">
	<circle r="3" cx="5" cy="5" fill="#f0f" id="ExEventValue1">
		<animate
			attributeName="fill"
			values="#f0f;#0ff;#ff0;#f0f"
			dur="3s"
			repeatCount="1"
			begin="ExEventValue1.click"
		></animate>
	</circle>
</svg>
```

效果如下：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="200" height="200" viewBox="0 0 10 10 ">
	<circle r="3" cx="5" cy="5" fill="#f0f" id="ExEventValue1">
		<animate
			attributeName="fill"
			values="#f0f;#0ff;#ff0;#f0f"
			dur="3s"
			repeatCount="1"
			begin="ExEventValue1.click"
		></animate>
	</circle>
</svg>

### Ex_repeat-value

下面代码演示了 repeat-value 类型的时间点。ExRepeatA 动画根据点击事件启动，它会循环 3 次。ExRepeatB 动画会在 ExRepeatA 动画每循环第 2 次的时候执行。所以下面的示例中，当你点击图形时，ExRepeatA 动画会让它旋转 3 周，ExRepeatB 动画会在旋转到第 2 周的时候执行：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="200" height="200" viewBox="0 0 10 10">
	<path
		d="M 5 9 l 0 -8 l -3 4 l 3 -1 l 3 1 l -3 -4 z"
		fill="black"
		stroke-linejoin="round"
		stroke="skyblue"
		stroke-width="0.3"
		id="ExRepeat1"
	>
		<animateTransform
			id="ExRepeatA"
			attributeType="XML"
			attributeName="transform"
			begin="ExRepeat1.click"
			type="rotate"
			from="0 5 5"
			to=" 360 5 5"
			dur="3s"
			repeatCount="3"
		></animateTransform>
		<animate
			begin="ExRepeatA.repeat(2)"
			attributeName="fill"
			values="#000;#f0f;#0ff;#ff0;#000"
			dur="3s"
			repeatCount="1"
		></animate>
	</path>
</svg>
```

效果如下，你可以尝试点击图形：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="200" height="200" viewBox="0 0 10 10">
	<path
		d="M 5 9 l 0 -8 l -3 4 l 3 -1 l 3 1 l -3 -4 z"
		fill="black"
		stroke-linejoin="round"
		stroke="skyblue"
		stroke-width="0.3"
		id="ExRepeat1"
	>
		<animateTransform
			id="ExRepeatA"
			attributeType="XML"
			attributeName="transform"
			begin="ExRepeat1.click"
			type="rotate"
			from="0 5 5"
			to=" 360 5 5"
			dur="3s"
			repeatCount="3"
		></animateTransform>
		<animate
			begin="ExRepeatA.repeat(2)"
			attributeName="fill"
			values="#000;#f0f;#0ff;#ff0;#000"
			dur="3s"
			repeatCount="1"
		></animate>
	</path>
</svg>

### Ex_Indefinite

当动画的 `begin` 设置为 `"indefinite"` 时，可以使用超链接对其进行应用，点击超链接即可执行动画：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="200" height="200" viewBox="0 0 10 10">
	<rect fill="#FFF" x="0" y="0" width="10" height="10">
		<animate
			id="Ex_Indefinite1"
			begin="indefinite"
			attributeName="fill"
			values="#fff;#f0f;#0ff;#ff0;#fff"
			dur="1s"
			repeatCount="5"
		></animate>
	</rect>
	<a xlink:href="#Ex_Indefinite1">
		<text x="50%" y="50%" text-anchor="middle" font-size="1">点我闪瞎你的双眼</text>
	</a>
</svg>
```

效果如下，你可以尝试点击中央的文字：

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="200" height="200" viewBox="0 0 10 10">
	<rect fill="#FFF" x="0" y="0" width="10" height="10">
		<animate
			id="Ex_Indefinite1"
			begin="indefinite"
			attributeName="fill"
			values="#fff;#f0f;#0ff;#ff0;#fff"
			dur="1s"
			repeatCount="5"
		></animate>
	</rect>
	<a xlink:href="#Ex_Indefinite1">
		<text x="50%" y="50%" text-anchor="middle" font-size="1">点我闪瞎你的双眼</text>
	</a>
</svg>

## FAQ

### 如何看懂属性定义？

参考 [W3C][4] 上查看属性定义的全部内容。

也许你会在 MDN 或者 W3C 上看到类似 `(S? ";" S begin-value-list)?` 的语法定义，其中的 `S` 代表可允许的空格，它的规范是 [smil-animation] 定义的，你可以在其文档中的 3.6.7 节查看定义。这里摘抄下：

> 3.6.7. Timing attribute value grammars
>
> This section is normative
>
> The syntax specifications are defined using EBNF notation as defined in [XML10]
>
> In the syntax specifications that follow, allowed white space is indicated as "S", defined as follows (taken from the [XML10] definition for "S"):
>
> S ::= (#x20 | #x9 | #xD | #xA)\*

`#x20` 这个写法有点误导，是 W3C 自己的规范，外界很少有人使用。`#x` 后面是 ascii 码，上面几个都是空白符，引用的大致意思描述了 `S` 是可以允许的空格类型。

## 参考

- [19.2.8 Attributes to control the timing of the animation][1] --- W3C

- [SVG 属性参考][2] --- MDN

- [SMIL Animation][3] --- W3C

- [Attribute-List Declarations][4] --- W3C

[1]: https://www.w3.org/TR/SVG11/animate.html#TimingAttributes
[2]: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute
[3]: https://www.w3.org/TR/2001/REC-smil-animation-20010904/
[4]: https://www.w3.org/TR/xml/#attdecls
[c1]: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/begin
[c2]: https://www.w3.org/TR/SVG11/animate.html#BeginValueListSyntax
[c3]: https://www.w3.org/TR/SVG11/animate.html#ClockValueSyntax
