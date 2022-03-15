---
title: rollup 笔记
slug: note/rollup
createAt: 2022-03-14
publish: false
tags:
  - rollup
  - 打包
  - 构建工具
archives:
  - 笔记
desc:
---

## 简介

本笔记参考 [rollup 官方文档][1] 编写，官方也有提供中文文档，但是好像没人维护了，我看到一半发现有很多插件和用法产生滞留，不太建议查看中文文档。

## 安装与 Hello World

官方推荐全局安装，这样就可以使用全局命令 `rollup`。

但是我还是喜欢局部安装，执行以下命令：

```shell
npm init -y
npm install rollup --save-dev # 或使用 `npm i rollup -D`
```

一般来说，rollup 作为开发依赖包安装。

然后在项目里面新建文件：

- ```js
  /** @file packages/index.js */
  import text from "./foo";

  function main() {
    console.log("the answer is " + text);
  }

  main();

  export default main;
  ```

- ```js
  /** @file packages/foo.js */
  export default "Foo content!";
  ```

这两个文件存在依赖关系，可以使用 rollup 来对其进行构建打包，使用命令：

```shell
npx rollup packages/index.js --file dist/bundle.js
```

上述命令会把 `packages/index.js` 文件及其依赖打包到 `dist/bundle.js` 文件中，并转义其格式为 ，该项目里就出现了一个 `dist/bundle.js` 文件，打开内容如下：

```js
/** @file packages/index.js */
var text = "Foo content!";

/** @file packages/index.js */

function main() {
  console.log("the answer is " + text);
}

main();

export { main as default };
```

两个文件被合二为一了。

初次之外，rollup 还支持把文件转移成 [多种格式](https://rollupjs.org/guide/en/#outputformat)，比如把上面的的命令改为：

```bash
# 转义成 amd 格式
npx rollup packages/index.js --file dist/bundle.js --format amd
# 或者立即执行函数
npx rollup packages/index.js --file dist/bundle.js --format iife
# 或者 umd 格式
npx rollup packages/index.js --file dist/bundle.js --format umd --name "myBundle"
```

## 使用配置文件

rollup 的配置文件是 `.js` 格式，因为 rollup 本身会处理配置文件，所以可以使用 esm 格式直接导出配置。

rollup 的位置文件一般起名为 **rollup.config.js**，假设你有多个配置文件，可以这么命名：

- rollup.config.dev.js 开发环境
- rollup.config.prod.js 生产环境

rollup 的配置文件也支持其他格式例如 _rollup.config.mjs_、_rollup.config.cjs_。

一个简单的配置文件如下：

```js
// rollup.config.js
export default {
  input: "src/main.js",
  output: {
    file: "bundle.js",
    format: "amd",
  },
};
```

然后可以使用一下命令执行导入该配置文件：

```bash
npx rollup -c rollup.config.js
# 或者不设置配置文件
# rollup 会按照一下顺序查找配置文件
# rollup.config.mjs -> rollup.config.cjs -> rollup.config.js
rollup -c
```

此外，你还可以导出一个数组，包含多个配置，rollup 会给每个配置都进行构建：

```js
// 多个配置的数组
export default [
  {
    input: "main-a.js",
    output: {
      file: "dist/bundle-a.js",
      format: "cjs",
    },
  },
  {
    input: "main-b.js",
    output: [
      {
        file: "dist/bundle-b1.js",
        format: "cjs",
      },
      {
        file: "dist/bundle-b2.js",
        format: "es",
      },
    ],
  },
];
```

## 使用插件

rollup 使用插件来改变构建时的一些行为，例如引入 json 文件。插件同样作为开发依赖包存在，并不会构建到生产环境中。

安装可以引入 json 文件的依赖：

```bash
npm i @rollup/plugin-json -D
```

然后在配置文件中引入：

```js
// rollup.config.js
import json from "@rollup/plugin-json";

export default {
  input: "packages/index.js",
  output: {
    file: "./dist/bundle.js",
    format: "amd",
  },
  plugins: [json()],
};
```

此时在源文件中就可以引入 json 文件，比如：

```js
/** @file packages/index.js */
import { version } from "../package.json";

function main() {
  console.log("version is " + version);
}

main();
```

json 的配置会使用静态字面量进行写入，打包后的代码类似下面的样子：

```js
var version = "1.0.0";

/** @file packages/index.js */

function main() {
  console.log("version is " + version);
}

main();
```

> rollup 支持 tree-shaking（影子树），所以 json 文件的其他值并不会被导入。

## 命令行与配置文件

rollup 的部分操作都可以使用命令行来完成，配置文件是可选的。

### 配置文件

配置文件是可选的，本身是一个 ES6 模块，默认向外暴露一个的对象，一般命名为 `rollup.config.js` 并存放在根目录。

你可以参看 [文档此处](https://rollupjs.org/guide/en/#configuration-files) 来确定配置文件那些是必选的，那些事危险配置等等。

另外也可以对应详细的 [配置清单](https://rollupjs.org/guide/en/#big-list-of-options) 来确定每个配置的具体行为。

### 命令行参数

rollup 提供基本的命令行参数来进行简单开发或者测试。[查看这里](https://rollupjs.org/guide/en/#command-line-flags)

也有几个很常用的参数：

`-h/--help`

打印帮助文档。

`-w/--watch`

监听源文件是否有改动，如果有改动，重新打包

例如你想使用某一个配置文件并且监视需要构建的源文件，那么可以使用：

```bash
npx rollup -c rollup.config.js -w
```

`-w/--watch` 的热更新功能在开发时非常有效。

## JavaScript API

rollup 包提供两个函数来支持 NodeJS 的 API，对，并不是 JavaScript API 而是 NodeJS API。

- `rollup.rollup`
- `rollup.watch`

### rollup.rollup

`rollup.rollup` 返回一个 Promise，成功解析时将获得一个对象，该对象含有解析的数据和一些方法。

[官方提供的用例](https://rollupjs.org/guide/en/#rolluprollup)

### rollup.watch

`rollup.watch` 提供配置参数的 `-w/--watch` 功能，用于对一个配置进行持久化监听并输出。

[官方提供的用例](https://rollupjs.org/guide/en/#rollupwatch)

## 工具集成

官方文档上并没有标注插件汇总清单，不过我搜到了在 github 上找到了它的 [插件库][2]。

我并没有完全阅读这些插件库，内容实在有点多，要用的时候再看吧。

### @rollup/plugin-node-resolve 支持 npm package

这个插件用来支持 npm package，默认情况下，rollup 不会对 node_modules 下的库进行解析。

例如安装一个叫 `the-answer` 的库：

```bash
npm i the-answer
```

然后在代码中引入：

```js
import answer from "the-answer";
```

那么 rollup 就会报错，因为 rollup 无法解析该模块。

可以通过安装 @rollup/plugin-node-resolve 插件解决此问题：

```bash
npm i @rollup/plugin-node-resolve -D
```

然后在配置文件中进行引入：

```js
// rollup.config.js
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "packages/index.js",
  output: {
    file: "./dist/bundle.js",
    format: "amd",
  },
  plugins: [nodeResolve()],
};
```

之后在进行 rollup 构建，就不会发生错误，the-answer 模块将正常参与构建。

> 关于错误 _Unresolved dependencies_
>
> 当你未使用 @rollup/plugin-node-resolve 插件时这个错误会触发，rollup 默认是无法使用 npm package 的。
>
> 但即使你安装插件 @rollup/plugin-node-resolve，如果你未安装相关依赖包，也会出现这个错误。例如你未执行 `npm i react` 就在源代码里面使用 `import {...} from "react"` 这也会出现该错误。

### @rollup/plugin-commonjs 把 cjs 转化成 esm 格式参与构建

rollup 默认都把源文件及其依赖按照 ESM 格式进行处理，但是 npm 默认支持的是 CommonJS，所以 npm 中很大一部分包都是使用 CommonJS 格式，这会导致 rollup 无法对这部分 cjs 包进行处理。

@rollup/plugin-commonjs 插件可以对 CommonJS 的包进行预处理，将其转化为 ESM 格式再参与构建。

安装：

```bash
npm install @rollup/plugin-commonjs --save-dev
```

使用：

```js
// rollup.config.js
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.js",
  output: {
    dir: "output",
    format: "cjs",
  },
  plugins: [nodeResolve(), commonjs()],
};
```

### 在构建时去除 Peer dependencies 对等依赖的库

假如编写一个指定 React 版本的组件库，那么 React 应该作为 Peer dependencies，我们并不期望构建后的包存在 React 的源码。但是 rollup 默认还是会把 React 当做依赖进行构建，比如：

```js
import react from "react";
console.log(react);
```

上面的代码会把 react 当做源代码的依赖参与构建，就算你是使用 `--save-dev` 安装也一样。

我们只需要在配置文件里添加 `external: ["react"]` 即可，不过别忘了先对 npm package 进行支持：

```js
// rollup.config.js
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "packages/index.js",
  output: {
    file: "./dist/bundle.js",
    format: "cjs",
    exports: "default",
  },
  plugins: [nodeResolve(), commonjs()],
  external: ["react"],
};
```

这样会把 react 当做外部依赖处理，它不会被构建到最终的包当中。

### @rollup/plugin-babel 支持 babel

rollup 可以使用 @rollup/plugin-babel 插件来集成 babel。

首先需要安装 bebel 的相关依赖和插件（为了演示更多配置，这里使用 babel 转化了 jsx）：

```bash
npm install @rollup/plugin-babel @babel/core @babel/preset-env @babel/preset-react --save-dev
# 顺便安装 react，我们同样不用 --save 安装 react
npm install react --save-dev
```

然后在配置文件设置插件：

```js
// rollup.config.js
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";

export default {
  input: "packages/index.js",
  output: {
    file: "./dist/bundle.js",
    format: "cjs",
    exports: "named",
  },
  plugins: [nodeResolve(), babel({ babelHelpers: "bundled" }), commonjs()],
  external: ["react"],
};
```

然后你必须为自己的代码设置 babel 配置，例如我们需要转义的代码位于 `packages/**` 下面，那么就应该在此文件夹下面建立一个 .babelrc.json，这个 babel 默认的配置方式一样。然后键入以下代码，让环境支持 jsx：

```json
{
  "presets": ["@babel/env", "@babel/preset-react"]
}
```

很简单，项目已经可以支持 jsx 构建了，来到之前的 `packages/index.js` 文件中，修改代码如下：

```js
/** @file packages/index.js */

import { useState } from "react";

function App() {
  const [state] = useState([..."".padEnd(100)].map((_, i) => i));

  for (const iterator of foo) {
    console.log(iterator);
  }

  return (
    <div>
      <p> a component !</p>
      <p>
        <code>{JSON.stringify(state)}</code>
      </p>
    </div>
  );
}

export default App;
```

这段代码使用一些 ES6+ 的语法或函数，比如：

- 字符串展开符：`...`
- `for of` 语句
- ...

并且还是用了 JSX，现在执行 `npx rollup -c -w`，会发现代码被 babel 顺利转译。

### typescript

### 其他工具集成

在 [官方文档](https://rollupjs.org/guide/en/#tools) 可以找到更多其他工具集成的方式。

## 参考

- [rollup.js][1]
- [rollup plugins][2]
- [rollup-react-not-compiling-jsx][3]
- [About semantic versioning][4]

[1]: https://rollupjs.org/guide/en/
[2]: https://github.com/rollup/plugins
[3]: https://stackoverflow.com/questions/52884278/rollup-react-not-compiling-jsx
[4]: https://docs.npmjs.com/about-semantic-versioning
