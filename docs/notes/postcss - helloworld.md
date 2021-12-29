---
title: postcss - helloworld
createAt: 2021-12-29
slug: notes/postcss - helloworld
publish: true
tags:
  - postcss
  - autoprefixer
  - css
archives:
  - 笔记
---

## postcss 是什么

[postcss][1] 是一个用来处理 css 的工具，支持 JavaScript 或者 NodeJS。你可能听过 [autoprefixer][2] 库，它用来给 css 代码添加兼容性前缀，然而这个库只是 postcss 的一个插件而已。

> PostCSS 接收一个 CSS 文件并提供了一个 API 来分析、修改它的规则（通过把 CSS 规则转换成一个抽象语法树的方式）。在这之后，这个 API 便可被许多插件利用来做有用的事情，比如寻错或自动添加 CSS vendor 前缀。
>
> --- 官方文档

## 理解

postcss 是靠插件撑起来的，它本身的功能就是把 css 转化为一个 **抽象语法树（Abstract Syntax Tree，AST）**。

所以 postcss 本身只是对 css 进行分析解释，不会进行额外的操作。

我看过一点点官方 API，大部分都是对 AST 的解释，如果不是想要自己开发插件，学习 postcss 的 AST 用处并不大。并且官方没有提供太多指南或教程，学习门槛较高。不过我兜兜转转看好久，发现如果不是写插件的话，根本不需要了解 postcss 底层是怎样的，只需要知道怎么使用就可以了。

它的学习是插件库，实在太多了，可以到 [官方文档][3] 或者 [官网][1] 上查看。

## 基本使用

postcss 支持在各种构建工具中引入，也支持 npm 脚本，JavaScript API，可以到 [官方文档][3] 上查看它的全部使用方法。

## 插件 autoprefixer

这在当年可谓是一个 postcss 的神级插件，作用就是自动填充 css 兼容性前缀。让的代码可以向下进行一定程度的兼容。

插件本身在 Github 上的 Star 数都和 postcss 这个库本身旗鼓相当了。不过时代终将落幕，随着技术的革新，H5 时代的已经来临，Win 11 都没有 IE 了，这个插件最高光的点已经过去了。

autoprefixer 使用 [Can I use][5] 的浏览器列表来对 css 前缀进行填充。

使用很简单，新建一个文件夹结构如下：

```
root/
  dest/
  src/
    app.css
  index.js
```

接着依次执行：

```shell
npm init -y
npm i -D autoprefixer
```

这里并不用安装 postcss，autoperfixer 已经对其进行了依赖。

接在修改 _index.js_ 中的内容如下：

```js
/** @file index.js */
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");

const fs = require("fs");

fs.readFile("src/app.css", (err, css) => {
  // 使用插件 autoprefixer
  postcss([autoprefixer])
    .process(css) // 把 src/app.css 当做输入丢给 postcss
    .then((result) => {
      fs.writeFile("dest/app.css", result.css, () => true);
    });
});
```

现在去 _src/app.css_ 里面写上一些 css 代码，比如：

```css
.root {
  transform: translate(10px);
  animation: one 3s;
}

.nav {
  display: flex;
  justify-content: space-around;
}
```

默认情况下，转化的效果会受到当时所处的环境影响，因为 autoprefixser 是根据 [Can I use][5] 来更新的，所以转化的效果可能会不太一样。

现在执行：

```shell
node index.js
```

可以在 _dest/_ 文件夹下看到产生了一个文件，点开来看，可以看到转化后的 css 代码。也许效果不是很好，可以试试添加 [browserslist][6]，它用来设置 autoprefixer 转化 css 时，参考的浏览器列表。

> 使用 browserslist 需要注意，它被多个生态共同使用，例如还有 _@babel/preset-env_，_Stylelint_ 等。

在 _package.json_ 中添加如下字段：

```json
{
  // ...
  "browserslist": "cover 99.5%"
}
```

再次运行 `node index.js`，会发现 _dest/app.css_ 变成了这样：

```css
.root {
  -webkit-transform: translate(10px);
  -moz-transform: translate(10px);
  -ms-transform: translate(10px);
  -o-transform: translate(10px);
  transform: translate(10px);
  -webkit-animation: one 3s;
  -moz-animation: one 3s;
  animation: one 3s;
}

.nav {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-justify-content: space-around;
  -ms-flex-pack: distribute;
  justify-content: space-around;
}
```

打完收工。

## 参考

[1]: https://postcss.org/
[2]: https://github.com/postcss/autoprefixer
[3]: https://github.com/postcss/postcss/blob/main/docs/README-cn.md
[4]: https://create-react-app.dev/
[5]: https://caniuse.com/
[6]: https://github.com/browserslist/browserslist
