---
title: "markdown 编写规范"
slug: Markdown_writing_specification
createAt: 2021-09-06
---

## 元数据

元数据为 yaml 格式的数据，写在文章最开始，使用 `---\n` 与 `\n---` 进行包裹。

示例：

```yaml
---
meta: 元数据
---
```

元数据提供文章的所有基础数据，这些数据将用于渲染或标识。数据列表如下：

| 字段名   | 类型                    | 必填 | 默认                   | 描述                                                              |
| -------- | ----------------------- | ---- | ---------------------- | ----------------------------------------------------------------- |
| title    | string                  | 是   |                        | 文章标题                                                          |
| slug     | string                  | 是   |                        | 文章路径（所有文章会有基础路径 "docs/"）                          |
| publish  | soolean                 | 否   | false                  | 是否发布，仅在设置为 true 时文章会被发布。（默认不会发布文章）    |
| version  | [Version](#Version)     | 否   |                        | 版本号，可用作于设置文章版本号。                                  |
| obsolete | [Obsolete](#Obsolete)[] | 否   |                        | 历史版本链接。                                                    |
| createAt | [Date](#Date)           | 是   |                        | 文章创建日期（该日期仅在大版本发布时进行修改，格式如 YYYY-mm-dd） |
| updateAt | [Date](#Date)           | 否   |                        | 文章修改日期，仅作为小版本发布时的日期                            |
| tags     | string[]                | 否   |                        | 文章的标签，将用于页面的关键字设置，文章标签分类                  |
| archives | string[]                | 否   |                        | 文章归档，将用于文章分类归档                                      |
| desc     | string                  | 否   | 自动选取文章前面的文本 | 文章描述，将用于文章卡片简介文本，页面描述                        |

### Version

版本号格式用于文章版本，这是一个可选值，仅在需要明确记录文章版本时进行添加。

版本需要满足以下格式：

```
xx.xx.xx
```

其中 xx 为 0 到 99 的自然数，不需要前导零。三组数字依次为大中小三个版本：

- 大版本仅在文章大范围修改时更新。
- 中版本仅在文章不影响大意的修改下更新。
- 小版本仅在不影响意思的情况下，或者元数据修改是更新。

示例：

```yaml
version : 1.0.0
version : 0.0.0
version : 23.23.99
```

### Obsolete

Obsolete 为陈旧版本记录，它是一个键值列表，使用 yaml 按照一下格式编写：

```yaml
obsolete:
	"1.0.1" : "https://www.github.com/......."
	"2.2.1" : "https://www.github.com/......."
```

它的键名为版本号，值对应 git 仓库指定版本的代码。

### Date

Date 为 yaml 支持的时间格式，如 YYYY-mm-dd。

示例：

```yaml
createAt: 2021-09-03
updateAt: 2021-09-04
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

### 位置锚点

文章中的关键字可以适当注明位置，以方便它处进行引用。

位置锚点使用 a 元素进行设置，位置关键字使用 name 属性标识。切记不要使用 a 元素嵌套超链接，这会形成多重链接嵌套语病。

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
