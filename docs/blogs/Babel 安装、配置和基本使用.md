---
id: cefcffd6-9598-493e-9124-fb20f3582b6d
title: Babel 安装、配置和基本使用
slug: /docs/blogs/Babel 安装、配置和基本使用
createAt: 2021-06-22
publish: true
tags:
  - babel
  - jsx
archives:
  - 博客
desc:
---

[Babel][1] 是一款 JavaScript 编译器，它可以把 ECMAScript 2015+ 的代码转译成低版本兼容的代码。

## 作用

1. 语法转换：Babel 会转译新版本的 ES 代码，比如箭头函数，解构，模板字符串或者类等。Babel 会把这些新语法转译成较低版本的代码。需要注意的是，Babel 会把 ES 模块转化为 CommonJS 模块，模块转化可以查看 [此文章](https://2ality.com/2017/01/babel-esm-spec-mode.html)。

1. 通过 Polyfill 添加缺失的特性，比如 `Array.protorype.includes`、`String.protorype.padEnd` 等这些方法，较早 的浏览器并不包含它们，可以通过配置 Babel，让 Babel 动态添加这些 Polyfill。一般来说，这些 Polyfill 通过 [corejs][2] 实现。

## 核心依赖和和基本配置

Babel 核心包为 `@babel/cli`、`@babel/core` 和 `@babel/preset-env`。

新建一个文件夹，然后使用 `npm init` 初始化环境，接着使用以下命令进行安装：

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

**为什么使用 `--save-dev`，Babel 只会转义代码或者填充 Polyfill，并不需要集成到最终代码中，**

安装完成后需要创建 Babel 的配置文件，在项目根目录创建 **babel.config.json** 文件，这个文件是 Babel 的根配置文件。

然后键入以下代码：

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
        "useBuiltIns": "usage",
        "corejs": "3.6.5"
      }
    ]
  ]
}
```

至此 Babel 的环境已经全部搭建完毕了。上面配置中大致可以了解到：

- `@babel/env` 是 Babel 的环境配置；
- `targets` 是目标浏览器的兼容版本号，可以看到配置了 edge、firefox、chrome 和 safari 浏览器的版本号；
- `useBuiltIns` 配置了是否构建缺失的功能，构建时会把必须的 Polyfill 插入到文件中；
- `corejs` 标记了使用的是那个版本的 `corejs` 来获取 Polyfill。

## 编译

Babel 是用来转义代码的，所以必须先准备一些源代码。比如新建 `src/app.js`，编写以下代码：

```js
function App() {
  const foo = [..."".padEnd(100)].map((_, i) => i);

  for (const iterator of foo) {
    console.log(iterator);
  }
}

App();
```

上面代码中，运用到了 `const` 声明、字符串解构、ES 方法 `padEnd`、`map`、箭头函数和 `for of` 语句。

现在我们使用 Babel 编译下，运行一下代码：

```bash
./node_modules/.bin/babel src --out-dir lib
```

上面代码执行了 `babel` 的命令，把 `src` 目录下的文件转移到 `lib` 目录，`--out-dir` 用于设置输出目录。这个命令可以简化，比如使用 npm 的 npx 命令：

```bash
npx babel src --out-dir lib
```

控制台会返回以下字样：

```bash
Successfully compiled 1 files with Babel (97ms).
```

这说明你编译成功了，打开 `lib/app.js` 你会发现编译后的文件。

此时编译后的代码和源代码并没有多大差别，因为我们设置的需要兼容的浏览器版本还是挺高的，尝试修改 **babel.config.json** 的 `"chrome"` 版本号为 `"1"`，此时再次编译，你会发现代码数量多了不止一倍。

编译后的文件并不用去理会，比较那个代码已经不是给人看的了，是给机器运行的。

## 使用编译后的代码

尝试使用 NodeJS 环境执行我们编译的代码：

```bash
node ./lib/app.js
```

执行失败，因为编译后的代码填充了集成于 CoreJS 的 Polyfill，所以还需要安装 CoreJS：

```bash
npm install --save core-js
```

需要使用 `--save`，因为 CoreJS 被我们生产环境的代码所依赖。**安装完成注意核对 `package.json` 和 `babel.config.json` 的 CoreJS 版本号**，然后执行编译后的代码：

```bash
node ./lib/app.js
```

不出意外的话，控制台输出了 0 到 99 的所有整数。

## 编译后的代码

因为 Babel 编译的代码使用的 CommonJS 模块标准，且 NodeJS 也是使用 CommonJS 标准，所以编译后的代码是可以直接在 NodeJS 中执行了。

而 JavaScript 使用的是 ESModule 模块标准，两者并不兼容，所以不要妄想把编译后的代码直接放到前端运行。

首先要明确的是，Babel 是一个编译器，并不是一个构建器，如果想要构建代码，应该使用 [webpack][3]、[rollup.js][4] 或 [Brunch][5] 等构建工具。

## 配置文件

其中 `babel.config.json` 是项目根配置，根配置支持 `.js`、`.cjs`、`.mjs` 格式。

Babel 也支持局部配置，局部配置可以让配置文件仅在当前文件夹内部生效，局部配置的文件名为：`.babelrc[.json ,.cjs ,.mjs]`。

还有一种配置方式是把配置写在 `package.json` 的 `"babel"` 键中。

那么多种配置方式，在调试时必须精准的知道加载配置的顺序才行。在使用 babel 编译时，可以使用环境变量来显示某个文件使用的配置列表，`Shell` 终端如下：

```Shell
BABEL_SHOW_CONFIG_FOR=./src/app.js npx babel src --out-dir lib
```

如果是 `PowerShell`：

```PowerShell
$env:BABEL_SHOW_CONFIG_FOR = ".\src\app.js"; npx babel  src -d dist
```

> `-d` 是 `--out-dir` 简写。

使用上述方式编译时，控制台会安装优先级从高到低显示指定文件所使用的配置文件。

### 根配置

`babel.config.json` 或其他支持扩展名的等效文件是一个根配置，这是 Babel 7.x 提出的概念。Babel 运行时，它会在当前工作目录自动搜索根配置，这种行为可以使用 [`"configFile"`](https://babeljs.io/docs/en/options#configfile) 来修改。

但是如果你有这样的结构：

```
babel.config.json
package.json
packages/
  mod1/
    main.js
    package.json
  mod2/
    main.js
    package.json
```

如果现在进入某一个模块目录，然后使用 Babel 进行编译，就会发生非预期的结果，比如：

```shell
cd packages/mod1
babel . -d dist
```

> 此处使用的是全局 babel 命令。

这次编译并不会使用上层的 `babel.config.json` 配置，因为默认情况下，Babel 只会在当前工作路径寻找根配置。

Babel 使用一种 [单一仓库](https://babeljs.io/docs/en/config-files#monorepos) 的方式来支持向上寻找根配置，在编译时，需要设置 `root-mode` 值为 `upward`，比如：

```shell
babel --root-mode upwrad . -d dist
```

### 动态配置

配置并不只能是 `.json` 文件，也可以是 `.js`、`.cjs`、`.mjs` 文件。

当使用其他格式的配置文件时，可以动态编写配置，其中 `.js` 文件时，使用 CommonJS 模块导出配置对象即可，也可以导出一个可执行函数，Babel 会使用函数的返回值充当配置。

当导出一个对象时：

```js
// 可以调用环境变量完成不同环境的编译配置
console.log(process.env);

module.exports = {
  presets: [
    // ...
  ],
};
```

导出一个函数：

```js
module.exports = function babelrc(api) {
  console.log(api);
  return {
    // babel config ...
  };
};
```

当导出一个函数时，可以获取到 Babel 的 [API 参数](https://www.babeljs.cn/docs/config-files#config-function-api)，参数中包含以下信息和方法：

- `version` ：字符串，Babel 的版本
- `cache.forever` ：方法，永久缓存计算机配置，并且不在调用此函数
- `cache.never` ：方法，不缓存这个配置
- `cache.using(() => process.env.NODE_ENV)` ：方法，基于环境变量缓存。当回调返回预期之外的值时，比如上一次为 `"dev"` 这一次为 `"prod"`，那么配置函数将会重新执行，并把新的值写入缓存。
- `cache.invalidate(() => process.env.NODE_ENV)` ：方法，基于环境变量缓存。 任何时候 `cache.using` 的回调返回不是预期的值时，执行配置函数更新缓存。
- `cache(true)` ：方法，同 `cache.forever`
- `cache(false)` ：方法，同 `cache.never`
- `env()`：方法，切换环境变量名的方法，[详见](https://www.babeljs.cn/docs/config-files#apienv)。
- `caller(_caller => any)`：方法，包装执行，传入一个回调，回调获得访问器当做参数再执行。可用于确认当前环境的访问器。
- `api.assertVersion(range)`：方法，声明当前版本，如：`api.assertVersion(7.14.6)`。这个方法具体用途不清楚，官网并没有说声明版本后使用指定版本编译。

## 配置项

[参见](https://www.babeljs.cn/docs/options)

## 预设

Babel 提供可选的预设功能，比如 `@babel/preset-env` 就是一个预设，通过这个预设可以轻易编译出指定版本兼容的代码。除此之外，Babel 还提供了 TypeScript、React、Flow 等预设，主要用于把类型代码和 JSX 转化为普通 JS 代码。

比如编译 `.jsx` 文件，就可以使用 `@babel/preset-react` 预设，先安装：

```shell
npm install --save-dev @babel/preset-react
```

接着创建一个 `jsx/main.jsx` 随便写几行 `jsx` 代码，注意不用引入 `react`，[最新版 jsx 转化](https://zh-hans.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) 已经不需要引入 `react` 库，转换全由 Babel 实现。

然后创建 `jsx/babelrc.json` 如下：

```json
{
  "presets": ["@babel/preset-react"]
}
```

接着使用 `npx babel jsx -d jsxc`，编译结束后查看 `jsxc/main.js`，即可发现编译后的文件。

预设有很多详细的配置，[参见](https://babeljs.io/docs/en/babel-preset-env)。

> 另外预设的 [排列顺序](https://babeljs.io/docs/en/presets#preset-ordering) 是从后往前的。

## 插件

通过插件，Babel 可以转化几乎所有代码，上面的预设其实就是对多个插件的集成。

插件在配置中的键名为 `"plugins"`，使用和预设完全一样，比如：

```json
{
  "plugins": ["babel-plugin-myPlugin", "@babel/plugin-transform-runtime"]
}
```

如果需要配置参数，则为：

```json
{
  "plugins": [
    [
      "babel-plugin-myPlugin",
      {
        // ...params
      }
    ],
    "@babel/plugin-transform-runtime"
  ]
}
```

**需要注意的是，插件的前后顺序非常重要，不同的插件顺序可能导致完全不同的编译结果。**

- 插件在预设前运行。
- 插件顺序从前往后排列。
- 预设顺序是颠倒的（从后往前）。

插件使用比预设更简单，只是插件繁多，查找和参数配置上比较麻烦。[这里是插件列表](https://babeljs.io/docs/en/plugins-list)

## Assumptions

配置文件中还有一个 `"assumptions"` 选项，它用于设置一些前置假设。默认情况下，一些边缘情况的处理并不会影响到你的代码执行，一般是 ES6+ 降级后出现的问题，比如 `super` 关键字的实现，导出值枚举属性等等，如果没有触及这些边缘，那么 Babel 对这些边缘的处理就是多余的，甚至降低了代码的性能。Assumptions 就是用于减少这些不可能出现代码的编译开销。

**Assumptions 功能也很危险，因为它改变标准的编译方式，有可能会让代码无法调试的 bug，即正确的代码，经过 Babel 编译后偷工减料，导致一些边缘情况的逻辑发生错误。就连 Babel 都不是非常推荐 Assumptions 的设置，除非你对 JavaScript 足够熟悉。**

Assumptions 配置很简单，比如：

```json
{
  "assumptions": {
    "noDocumentAll": true,
    "noClassCalls": true
  }
}
```

找到配置项设置 `true` 或者 `false` 即可。[配置项参见](https://www.babeljs.cn/docs/assumptions#constantreexports)

## 其他

除了上述功能，Babel 还提供了编译的 API，也就是说 Babel 可以轻易嵌入到其他程序中，比较出名的就是 webpack 的 [babel-loader](https://webpack.js.org/loaders/babel-loader/#root)。可以在 [`@babel/core`](https://www.babeljs.cn/docs/babel-core) 中找到相关答案。

[1]: https://babeljs.io/
[2]: https://github.com/zloirock/core-js
[3]: https://webpack.js.org/
[4]: https://rollupjs.org/guide/en/
[5]: https://brunch.io/
