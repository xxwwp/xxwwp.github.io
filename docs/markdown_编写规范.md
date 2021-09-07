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

| 字段名   | 类型                    | 必填 | 默认  | 描述                                                              |
| -------- | ----------------------- | ---- | ----- | ----------------------------------------------------------------- |
| title    | string                  | 是   |       | 文章标题                                                          |
| slug     | string                  | 是   |       | 文章路径（所有文章会有基础路径 "docs/"）                          |
| publish  | soolean                 | 否   | false | 是否发布，仅在设置为 true 时文章会被发布。（默认不会发布文章）    |
| version  | [Version](#Version)     | 否   |       | 版本号，可用作于设置文章版本号。                                  |
| obsolete | [Obsolete](#Obsolete)[] | 否   |       | 历史版本链接。                                                    |
| createAt | [Date](#Date)           | 是   |       | 文章创建日期（该日期仅在大版本发布时进行修改，格式如 YYYY-mm-dd） |
| updateAt | [Date](#Date)           | 否   |       | 文章修改日期，仅作为小版本发布时的日期                            |
| tags     | string[]                | 否   |       | 文章的标签                                                        |
| archives | string[]                | 否   |       | 文章归档                                                          |

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

## 标题

文章不得出现一级标题如：

```markdown
# 一级标题
```

多级标题如下：

```markdown
## 二级标题

## 三级标题

## 四级标题

## 五级标题

## 六级标题
```

## MDX

文档支持 MDX，但是不要在 markdown 中编写 JavaScript 代码，仅推荐使用组件，所有组件不要按需引入，直接使用全局导入。

详细代码可以查看 src/components/Markdown.tsx 文件。
