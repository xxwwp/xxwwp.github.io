---
title: "markdown 编写规范"
slug: Markdown_writing_specification
nextPage:
prevPage:
publish: false
tags:
archives:
  - 文章
desc: 记录了项目的 docs 文件夹中 markdown 文档的规范，对基础规范做出示例。
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

| 字段名   | 类型     | 必填 | 默认                   | 描述                                                           |
| -------- | -------- | ---- | ---------------------- | -------------------------------------------------------------- |
| title    | string   | 是   |                        | 文章标题                                                       |
| slug     | string   | 是   |                        | 文章路径（所有文章会有基础路径 "docs/"）                       |
| nextPage | string   | 否   |                        | 下一篇文章路径，基于渲染后的 url                               |
| prevPage | string   | 否   |                        | 上一篇文章路径，基于渲染后的 url                               |
| publish  | boolean  | 是   | false                  | 是否发布，仅在设置为 true 时文章会被发布。（默认不会发布文章） |
| tags     | string[] | 否   |                        | 文章的标签，将用于页面的关键字设置，文章标签分类               |
| archives | string[] | 否   |                        | 文章归档，将用于文章分类归档                                   |
| desc     | string   | 否   | 自动选取文章前面的文本 | 文章描述，将用于文章卡片简介文本，页面描述                     |

可以复制[模板][1]快速生成新的 markdown 页面。

示例：

```yaml
---
title: 文章标题
slug: urllink
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
