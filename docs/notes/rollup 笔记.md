---
id: 235218aa-0fc5-4d17-8355-7c275c4c0bc6
title: rollup 笔记
slug: /docs/note/rollup
createAt: 2022-03-14
publish: true
tags:
  - rollup
  - 打包
  - 构建工具
  - babel
  - typescript
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

除此之外，rollup 还支持把文件转移成 [多种格式](https://rollupjs.org/guide/en/#outputformat)，比如把上面的的命令改为：

```shell
# 转义成 amd 格式
npx rollup packages/index.js --file dist/bundle.js --format amd
# 或者立即执行函数
npx rollup packages/index.js --file dist/bundle.js --format iife
# 或者 umd 格式
npx rollup packages/index.js --file dist/bundle.js --format umd --name "myBundle"
```

上面的命令会依次把文件构建为 amd、立即执行表达式、umd 格式。

## 使用配置文件

rollup 的配置文件是 `.js` 格式，因为 rollup 本身会处理配置文件，所以可以使用 esm 格式直接导出配置。

rollup 的配置文件一般起名为 **rollup.config.js**，假设你有多个配置文件，可以这么命名：

- rollup.config.dev.js 开发环境
- rollup.config.prod.js 生产环境

rollup 的配置文件也支持其他格式例如 _rollup.config.mjs_、_rollup.config.cjs_。

一个简单的配置文件如下：

```js
// rollup.config.js
export default {
  input: "src/main.js", // 需要构建的文件
  output: {
    // 输出
    file: "bundle.js", // 输出的文件名及路径
    format: "amd", // 输出的格式
  },
};
```

然后可以使用以下命令导入该配置文件并执行：

```shell
npx rollup -c rollup.config.js
# 或者不设置配置文件
# rollup 会按照一下顺序查找配置文件
# rollup.config.mjs -> rollup.config.cjs -> rollup.config.js
npx rollup -c
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

```shell
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

## 插件汇总

[这里有 rollup 的插件汇总。][2]

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

```shell
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

```shell
npm i the-answer
```

然后在代码中引入：

```js
import answer from "the-answer";
```

那么 rollup 就会报错，因为 rollup 无法解析该模块。

可以通过安装 @rollup/plugin-node-resolve 插件解决此问题：

```shell
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

之后再进行 rollup 构建，就不会发生错误，the-answer 模块将正常参与构建。

> 关于错误 _Unresolved dependencies_
>
> 当你未使用 @rollup/plugin-node-resolve 插件时这个错误会触发，rollup 默认是无法使用 npm package 的。
>
> 但即使你安装插件 @rollup/plugin-node-resolve，如果你未安装相关依赖包，也会出现这个错误。例如你未执行 `npm i react` 就在源代码里面使用 `import {...} from "react"` 这也会出现该错误。

### @rollup/plugin-commonjs 把 cjs 转化成 esm 格式参与构建

rollup 默认都把源文件及其依赖按照 ESM 格式进行处理，但是 npm 默认支持的是 CommonJS，所以 npm 中很大一部分包都是使用 CommonJS 格式，这会导致 rollup 无法对这部分 cjs 包进行处理。

@rollup/plugin-commonjs 插件可以对 CommonJS 的包进行预处理，将其转化为 ESM 格式再参与构建。

安装：

```shell
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

```shell
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

并且还是用了 JSX，现在执行 `npx rollup -c`，会发现代码被 babel 顺利转译。

#### rollup 会对 core-js 进行注入

需要注意的一点是，如果对 babel 使用了 core-js 对 Polyfill 进行添加，这些 Polyfill 会以裸导入的方式呈现给 rollup，rollup 默认会把它们当做依赖进行注入。

比如这么一个源代码：

```js
/** @file packages/index.js */

export function foo() {
  [..."".padEnd(100)].map((_, i) => console.log(i));
}

foo();
```

然后我们配置 babel 为：

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": 1
        },
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ]
}
```

这里我们增加了 `"useBuiltIns": "usage", "corejs": 3`，使用 corejs 来注入 Polyfill，这个时候我们如果运行 rollup，构建后的代码会含有相关的 Polyfill，大概这样：

```js
import "core-js/modules/es.array.map.js";
import "core-js/modules/es.string.pad-end.js";

//...
```

并且会收到一条控制台错误：

```shell
packages/index.tsx → ./dist/bundle.js...
(!) Unresolved dependencies
https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
core-js/modules/es.array.map.js (imported by packages/index.tsx)
core-js/modules/es.string.pad-end.js (imported by packages/index.tsx)
created ./dist/bundle.js in 2.6s
```

rollup 警告这两个依赖无法解析，这很正确，因为目前我们都没有安装 core-js，首先消除这个警告，我们来到 rollup.config.js 中，把 core-js 的所有模块视作外部依赖，因为太多了，这里需要使用正则表达式：

```js
// rollup.config.js

export default {
  input: "packages/index.js",
  output: {
    file: "./dist/bundle.js",
    format: "esm",
    exports: "named",
  },
  plugins: [babel({ babelHelpers: "bundled", exclude: "node_modules/**" }), commonjs(), nodeResolve()],
  external: [/^core-js/],
};
```

特别需要注意的是，core-js 需要使用正则去匹配它，[external][d1] 不支持 `"core-js/**"` 这种写法去匹配。

你以为这样就完了吗？这样你的代码内部会有很多 Polyfill 的裸导入，并且这些代码并没有被加入其中，所以 core-js 应该作为 Peer dependencies 进行处理，需要在 package.json 文件的 peerDependencies 当中进行添加。

有没有直接把 这些 Polyfill 注入到源码的手段？

首先我们不能把 core-js 作为外部依赖处理，把 rollup.config.js 的 `external: [ /^core-js/]` 去掉，然后使用 `npm i core-js -D`。

此时 babel 又回到了最初的时候，把含有 Polyfill 的源码递给 rollup，rollup 进行解析后，把这些依赖作为本地依赖进行导入构建。

这样你会得到一个巨大的文件，因为包含了很多 Polyfill 的源码。

### Typescript

rollup 与 Typescript 结合有两种方式：

- 作为 rollup 的插件

  这可以体验 ts 全部的功能，比如配置文件，jsx 转换等等，这会使用 ts 引擎对 ts 或 tsx 文件进行编译，生成相应的配置文件等。

- 作为 babel 的预设

  这只可以使用少部分的功能，其中 tsconfig.json 就无法使用，babel 只是提供了转化 ts 语言的预设而已，而不是完全使用 ts 进行编译。可以理解为仅做类型检查。比较明显的一点就是，使用 babel 的 ts 预设时不用安装 ts 引擎。

#### 作为 rollup 插件进行导入

安装 rollup 的 ts 插件 [@rollup/plugin-typescript][5] 和 ts 核心：

```shell
npm i typescript @rollup/plugin-typescript -D
```

然后在 rollup.config.js 对插件进行注入：

```js
// rollup.config.js
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "packages/index.tsx",
  output: {
    file: "./dist/bundle.js",
    format: "esm",
    exports: "named",
  },
  plugins: [
    typescript({ tsconfig: "./packages/tsconfig.json" }),
    babel({ babelHelpers: "bundled", exclude: "node_modules/**", extensions: [".js" ".ts" ] }),
    commonjs(),
    nodeResolve(),
  ],
  external: [/^core-js/],
};
```

上面使用 typescript 插件时，指定了 tsconfig.json 的位置，所以需要在项目根路径创建一个 tsconfig.json 文件，我从其他地方白嫖了一份配置文件大致如下：

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "downlevelIteration": true,
    "declaration": true,
    "declarationDir": "./types",
    "outDir": "./types"
  },
  "include": ["./**/*"]
}
```

现在修改源代码为这样：

```ts
/** @file packages/index.js */

export enum State {
  one,
  tow,
}
```

然后执行 `npx rollup -c` 得到打包后的文件为：

```js
/** @file packages/index.js */
var State;

(function (State) {
  State[(State["one"] = 0)] = "one";
  State[(State["tow"] = 1)] = "tow";
})(State || (State = {}));

export { State };
```

typescript 正常工作，把 enum 类型进行转译了，因为是单独作为插件引入，所以 typescript 还生成了 .d.ts 文件。

如果你足够熟悉 ts 的话，可以看到上面的配置中还设置了 jsx，所以这个配置是支持 jsx 文件的，但是切记把 react 当做外部依赖处理，不然 typescript 在处理完 jsx 后会把代码交给 rollup，rollup 会引入所有 jsx 源码，所以需要下面的配置：

```js
export default {
  // ...
  plugins: [
    typescript({ tsconfig: "./packages/tsconfig.json" }),
    babel({ babelHelpers: "bundled", exclude: "node_modules/**", extensions: [".js", ".jsx", ".ts", ".tsx"] }),
    //...
  ],
  external: ["react", /^react\//, /^core-js/],
};
```

上面还添加了 babel，babel 默认不支持 .ts 和 .tsx 文件，所以需要额外设置。

完成上面的配置后，我们设置一个 tsx 文件如下：

```js
/** @file packages/index.tsx */

// 使用了 typescript
enum State {
  one,
  tow,
}

export default function App() {
  [..."".padEnd(100)].map((_, i) => console.log(i)); // 这一段代码会激活 babel 转移

  // 下面的代码使用了 tsx
  return (
    <div>
      <h1> a component !</h1>
      <p>State one is {State.one}</p>
      <p>State tow is {State.tow}</p>
    </div>
  );
}

```

记住把入口文件指向该 tsx 文件，然后执行 `npx rollup -c`，构建后的代码使用 ts 转译了 tsx 文件，同时使用 babel 转译了 ES6+ 代码。

#### 作为 babel 预设进行导入

因为 babel 本身支持 ts 的预设，而 rollup 又把 babel 当做插件，所以可以嵌套使用。

首先安装 babel 的 ts 预设 [@babel/preset-typescript][6]：

```shell
npm i @babel/preset-typescript -D
```

然后直接配置 .babelrc.json 文件：

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-typescript"]
}
```

很简单，已经配置完成了。

至于 tsconfig.json，你可以在任何地方编写，因为 babel 并不在乎它，也不会使用 ts 的配置文件。

如果想使用 tsx 支持，那么需要安装 [@babel/preset-react][7]：

```shell
npm i  @babel/preset-react -D
```

然后设置 .babelrc.json 为：

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": 1
        },
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ],
    [
      "@babel/preset-typescript",
      {
        "isTSX": true,
        "allExtensions": true
      }
    ],
    [
      "@babel/preset-react",
      {
        "runtime": "automatic"
      }
    ]
  ]
}
```

另外如果你的 IDE 像 vscode 一样会能检测 tsconfig.json，那么可以设置 tsconfig.json 的配置项 `"jsx":"react-jsx"`，这样就不用在每个文件都引入 react 了。

### eslint ☹

rollup 对 eslint 的支持并不是很好，至少目前是这样的。我遇到了 [这个问题][d4]，然而官方像在踢足球一样，把问题踢给了 typescript 插件，问题没有解决的同时，还关闭了。这个事让我觉得 rollup 的社区真的够操蛋。

在 rollup 提供的插件库里面，有一个叫 [@rollup/plugin-eslint][d2] 的插件，但是这个插件对最新的 eslint 版本已经不支持了，导致我在这里卡了很长的时间，它完全不能按照文档正常工作。

然后我找到了一个非官方的库 [@rbnlffl/rollup-plugin-eslint][d3]，虽然这个库的确很好的替代了 @rollup/plugin-eslint 的不足，但是它又太新了，star 也很低，我安装了试了下，暂时没有问题。

首先我们安装 eslint 的 rollup 插件：

```shell
yarn add @rbnlffl/rollup-plugin-eslint -D
```

然后使用 eslint 命令对 eslint 配置文件进行初始化：

```shell
npx eslint --init
```

结束后 eslint 会自动生成配置文件，我们只需要在 rollup.config.js 中进行配置即可：

```js
// rollup.config.js
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
// import eslint from "@rollup/plugin-eslint"; // 这就是那条坏掉的代码
import eslint from "@rbnlffl/rollup-plugin-eslint";

export default {
  input: "packages/index.tsx",
  output: {
    file: "./dist/bundle.js",
    format: "esm",
    exports: "named",
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    eslint({}),
    typescript({ tsconfig: "./packages/tsconfig.json" }),
    babel({ babelHelpers: "bundled", exclude: "node_modules/**", extensions: [".ts", ".tsx"] }),
  ],
  external: ["react", /^react\//, /^core-js/],
};
```

然而这也没有完全结束，因为这种构建实在不令人放心。如果可以，目前还是不要在 rollup 中使用 eslint 吧，直接使用 eslint 本身最好。

删掉上述的 eslint 的插件代码，直接使用 `npx eslint --ext .tsx ./packages`，很好，直接使用命令行，也产生了错误信息。

### 其他工具集成

在 [官方文档](https://rollupjs.org/guide/en/#tools) 可以找到更多其他工具集成的方式。

## 总结

rollup 的确很简单，它只是提供了一个构建的基础功能，然后依靠插件来对 TypeScript、Babel 等进行进行集成，然而实际上给我的感觉并不是那么优良。

我写这段文字的时间是 【2022 年 3 月 22 日 16:14:08】，eslint 出现问题的时间我最早找到的是 2021 年 9 月，这个问题历经半年还是没有解决，很失望。反观 Webpack 那边的社区，生龙活虎，这边感觉死气沉沉。

rollup 最早是靠着 Tree-Shaking 与 Webpack 争夺一席之地，现在 Webpack 在这方面也在齐头并进，而 rollup 进步却不那么明显。

它相比 webpack 来说，最大的优点就是简单，没有 Webpack 那么复杂繁多的配置（其实也很多，只是相比 Webpack 少很多），学习也更简单，Webpack 不看个 10 天 8 天很难入门？因为内容太多，还很难消化，学习半个月搭个环境还是跌跌撞撞。rollup 文档不多，基础扎实三四天天之内就大致能上手，搭建简单的环境。

## 参考

- [rollup.js][1]
- [rollup plugins][2]
- [rollup-react-not-compiling-jsx][3]
- [About semantic versioning][4]
- [@rollup/plugin-typescript][5]
- [@babel/preset-typescript][6]
- [@babel/preset-react][7]

[1]: https://rollupjs.org/guide/en/
[2]: https://github.com/rollup/plugins
[3]: https://stackoverflow.com/questions/52884278/rollup-react-not-compiling-jsx
[4]: https://docs.npmjs.com/about-semantic-versioning
[5]: https://github.com/rollup/plugins/tree/master/packages/typescript
[6]: https://babeljs.io/docs/en/babel-preset-typescript
[7]: https://babeljs.io/docs/en/babel-preset-react
[d1]: https://rollupjs.org/guide/en/#external
[d2]: https://github.com/robinloeffel/rollup-plugin-eslint
[d3]: https://github.com/robinloeffel/rollup-plugin-eslint
[d4]: https://github.com/rollup/plugins/issues/1010
