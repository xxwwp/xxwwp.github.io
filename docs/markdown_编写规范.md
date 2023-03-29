---
id: 971f3446-c798-4828-b675-3dac03aac775
title: "markdown 编写规范"
slug: /docs/Markdown_writing_specification
createAt: 2021-09-10
publish: false
obsolete: false
archives:
  - 文章
---

## 元数据

元数据为 yaml 格式的数据，写在文章最开始，使用 `---\n` 与 `\n---` 进行包裹。**yaml 格式非常严格，缩进使用两个空格而不是 tab 缩进。**

示例：

```yaml
---
meta: 元数据
---
```

元数据提供文章的所有基础数据，这些数据将用于渲染或标识。数据列表如下：

- _title = string_

  文章标题

- _slug = string_

  文章路径（所有文章会有基础路径 "docs/"）

- _createAt = string_

  一个 [ISO 8601](https://zh.wikipedia.org/wiki/ISO_8601) 格式的时间字符串，指定文档是与哪一天创建的。

- _nextPage ::= string_

  下一篇文章路径，基于渲染后的 url

- _prevPage ::= string_

  上一篇文章路径，基于渲染后的 url

- _publish ::= boolean 默认 false_

  是否发布，仅在设置为 true 时文章会被发布。（默认不会发布文章）

- _obsolete ::= boolean_

  是否废弃，仅在设置为 true 时文章被废弃。

- _tags ::= string[]_

  文章的标签，将用于页面的关键字设置，文章标签分类

- _archives ::= string[]_

  文章归档，将用于文章分类归档

- _desc ::= string_

  文章描述，将用于文章卡片简介文本，页面描述。如果没有设置该值，会使用 [gatsby-transform-remark](https://www.gatsbyjs.com/plugins/gatsby-transformer-remark/) 插件提供的 [excerpt](https://using-remark.gatsbyjs.org/excerpts/) 数据。

> 上面描述中，`=` 代表必填，`::=` 代表非必填。**必须填入 `title`、`slug` 与 `createAt` 三个字段程序才会处理 md 文件。**

可以复制[模板][1]快速生成新的 markdown 页面。

示例：

```yaml
---
title: 文章标题
slug: /docs/urllink
createAt: 2021-09-10
nextPage: nextlink
prevPage: lastlink
publish: false
tags:
  - svg
  - html
  - tag3
archives:
  - 文章
  - archives2
desc: 这里是文章表述
---
```

## markdown

### 标题

文章不得出现一级标题如：

```markdown
# 一级标题
```

一级标题全部使用[元数据](#元数据)的 title 键进行设置。

多级标题如下：

```markdown
## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题
```

## 表格

重要区分列表和表格的语义区别，我曾多个地方使用表格代替列表，导致渲染和语义都不好。

如果是描述性列表，可以直接使用 `<dl>` 元素。

### 注释

注释使用以下格式进行：

```markdown
[//]: # "这是一条 markdown 注释"
```

参见 [stack overflow](https://stackoverflow.com/questions/4823468/comments-in-markdown)。

### 超链接

针对重复冗长的超链接地址，应该尽可能设置地址别名并放到文章最后，以增强源码可读性。

示例：

```markdown
## 简介

[svg][1] 为动画提供了完整的支持，[svg][1] 动画可以让 [svg][1] 元素的属性产生周期性的过渡，旋转、平移或者沿路径运动也手到擒来，甚至有自己的事件支持。

...

[//]: # "这里是文章末尾部分"
[1]: https://developer.mozilla.org/en-US/docs/Web/SVG
```

别名应该尽量简短，例如上述直接使用数字。

部分时候可能需要为链接分类，可以在别名中插入字母，例如：

```markdown
[1]: https://link...
[2]: https://link...
[3]: https://link...
[a1]: https://link...
[a2]: https://link...
[a3]: https://link...
[b1]: https://link...
[b2]: https://link...
[b3]: https://link...
```

### 位置和锚点

文章中的关键字可以适当注明位置，以方便它处进行引用。

位置使用 a 元素进行设置，位置关键字使用 name 属性标识。切记不要使用 a 元素嵌套超链接，这会形成多重链接嵌套语病。

例如：

```markdown
## 硬件

家用电脑一般由下列硬件组成：

- 主板：用来连接其他硬件。
- cpu<a name="cpu"></a>：计算机的处理器，用来处理数字计算。

...

## 缓存

[cpu](#cpu) 自带闪存进行撞击，从而实现快速的数字计算。

...
```

点击缓存部分的 `cpu` 链接文章将自动定位到前文的指定位置。

另外，包含空格的锚点使用 `<>` 对链接进行固定，例如：

```markdown
<h2 id="间隙 锚点">间隙 锚点</h2>

[点击这里去间隙 锚点](<#间隙 锚点>)
```

### 其他格式

其他格式按照 vscode 的[默认格式](https://code.visualstudio.com/docs/languages/markdown#_does-vs-code-support-github-flavored-markdown)编写。

## MDX

文档支持 MDX，但是不要在 markdown 中编写 JavaScript 代码，仅推荐使用组件，所有组件不要按需引入，直接使用全局导入。

详细代码可以查看 src/components/Markdown.tsx 文件。

## git 版本

git 版本提交使用 [commitizen](https://github.com/commitizen/cz-cli) 来进行提交，具体使用查看[这篇文章](#http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)。

提交指令 `git commit` 将使用 `git cz` 代替：

```shell
git cz
```

## 参考

- [markdown 模板][1]

[1]: https://github.com/xxwwp/xxwwp.github.io/blob/main/docs/markdown_template.md
