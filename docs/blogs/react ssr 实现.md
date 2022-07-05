---
title: react ssr 极简实现
slug: /docs/blogs/react ssr 极简实现
createAt: 2022-07-01
publish: true
tags:
  - react
  - ssr
  - server site rendering
archives:
  - 博客
desc:
---

## 思路

react 的 ssr 最低最低也要把下面几个操作完成：

1. 转化 jsx：把 jsx 或者 tsx 代码转化为普通代码
2. 模板注入：使用 react-dom 的服务器端渲染功能把组件渲染成静态文本，然后丢到 HTTP 响应报文中
3. 吸水反应：在客户端添加逻辑挂载，react 称挂载过程是 hydrate 吸水。

## 实现

实现时用到的依赖：

```json
{
  "dependencies": {
    "@types/react": "^18.0.14",
    "@types/react-dom": "^18.0.5",
    "webpack-cli": "^4.10.0",
    "webpack-node-externals": "^3.0.0",
    "express": "^4.18.1",
    "nodemon": "^2.0.18",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "ts-loader": "^9.3.1",
    "typescript": "^4.7.4",
    "webpack": "^5.73.0"
  }
}
```

可以直接全部装上，或者写到哪里装到哪里。

> 注意此用例使用的是 react18，并不兼容低版本的 react ssr。

### 先写点源码

既然是服务器端渲染，就要先装个好用的服务器，我用的是 express。

创建以下的文件：

```txt
root
├── src
│   ├── App.tsx  # 根元素
│   ├── client.tsx # 客户端代码
│   ├── HelloWorld.tsx # 一个用例组件
│   └── server.js # 服务器端代码
└── tsconfig.json
```

嗯，再来看看各个文件我都写了啥：

tsconfig.json，配置下 jsx 的转化，这段代码是我从 [webpack][3-1] 官网嫖下来的：

```json
{
  "compilerOptions": {
    "outDir": "dist",
    "noImplicitAny": true,
    "module": "esnext",
    "target": "ESNext",
    "jsx": "react-jsx",
    "allowJs": true,
    "moduleResolution": "node"
  }
}
```

其实 `outDir` 选项没啥用，但是不配置会报错我的 js 文件。

然后是 src 内的文件：

```tsx
/** @file App.tsx */
import HelloWorld from "./HelloWorld";

export default function App() {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <h1>react ssr</h1>
        <HelloWorld />
        <script src="/client.js"></script>
      </body>
    </html>
  );
}
```

App.tsx 很简单，就是一个完整的页面组件，不过引入了客户端代码，这个在服务器端没什么用处，但是在客户端用来挂载 react 组件的逻辑。

```tsx
/** @file client.tsx */
import * as ReactDOMClient from "react-dom/client";
import App from "./App";

ReactDOMClient.hydrateRoot(document, <App />);
```

client.tsx 是客户端代码，构建后会产生 client.js 文件，也就是 App.tsx 中引入的客户端代码。其实这个代码没几行，就是挂载 react 组件逻辑而已。

```tsx
/** @file HelloWorld.tsx */
export default function HelloWorld() {
  function handleClick() {
    alert("something");
  }

  return <button onClick={handleClick}>hello world</button>;
}
```

HelloWorld.tsx 文件就是一个用例组件，用来测试模块化代码有没有成功引入，还有客户端有没有成功进行 react 的逻辑挂载。

最后是 server.js：

```js
/** @file server.js */
import express from "express";
import App from "./App.tsx";
import { renderToPipeableStream } from "react-dom/server";

const server = express();

server.use(express.static("dist/static"));

server.get("/", (_, res) => {
  renderToPipeableStream(<App />).pipe(res);
  res.set("content-type", "text/html");
});

server.listen(80, () => {
  console.log(`Example app listening on port 80`);
});
```

在 server.js 中，其实我就做了两件事，一个是解析 `root/dist/static` 文件夹为静态访问，二个就是路由根路径，使用 react 进行 ssr。eszy，基本没啥逻辑。

### 转化 jsx

现在万事俱备只欠东风，我们把项目里的 jsx 元素都解析一下就行了。

为了方便，使用 webpack 来充当构建工具，babel 就不用了，直接用 ts 来解析 jsx。

在项目根路径新建 webpack.config.js 文件如下：

```js
const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = () => {
  // tsx 配置
  const tsx = {
    resolve: {
      extensions: [".js", ".jsx", "ts", ".tsx"], // 解析 tsx 文件
    },
    module: {
      rules: [
        {
          test: /\.(tsx?|jsx?)$/, // js ts 都走一遍 ts 进行编译
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
  };

  // 服务器端代码构建
  const server = {
    ...tsx,
    mode: "development",
    entry: {
      index: "./src/server.js",
    },
    output: {
      filename: "server.js",
      path: path.join(__dirname, "dist"),
      clean: true,
    },
    externalsPresets: { node: true }, // 不打包 node 模块，什么 fs path 那些
    externals: [nodeExternals()], // 不打包 node_modules 内的模块，什么 express react react-dom 那些
  };

  // 客户端代码构建;
  const client = {
    ...tsx,
    mode: "development",
    entry: {
      client: "./src/client.tsx",
    },
    output: {
      filename: "client.js",
      path: path.join(__dirname, "dist/static"), // 输出到静态目录
    },
  };

  return [server, client];
};
```

服务器端代码就是用 ts 解析一下，不然不能引入 jsx 文件。客户端代码需要单独打包，因为要引入 react 等相关依赖。

> 服务器端也可以不使用 jsx：
>
> 首先不引入开发的 .tsx 代码，直接引入打包好的 .js 组件代码，这样就不用对服务器端代码进行转化了。
>
> 然后使用
>
> ```js
> renderToPipeableStream(React.createElement(App));
> ```
>
> 来代替：
>
> ```js
> renderToPipeableStream(<App />);
> ```
>
> 即可。

接下来干什么？当然是构建目标代码了，来到 package.json 中，在 script 内添加如下命令：

```json
{
  "scripts": {
    "build": "webpack --config webpack.config.js --watch",
    "server": "nodemon ./dist/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

`build` 命令使用 webpack 构建了服务器和客户端代码，`server` 命令启动我们的服务器并进行服务器热重载，方便我们开发用。

然后我们先打开一个终端进行 build：

```shell
npm run build
```

此时可以看到项目里出现了 dist 文件夹和相关代码，然后我们 **再新建一个终端** 使用 server 命令启动服务器：

```shell
npm run server
```

不出意外的话，打开浏览器访问 localhost 就能访问页面了，什么点击事件也能用。

## 总结和一些思考

### 总结

react 的 ssr 并没有什么难点，就只是把 [思路](#思路) 中提及实现出来。

1. 转化 jsx

   这部分在上述实现中我用到了 typescript，实际上 react 官方更建议使用 babel，babel 为转化 jsx 实现了一个预设 [@babel/preset-react][5-1]，可以很轻松的实现 jsx 转化。还可以用 babel 的预设 [@babel/preset-typescript][5-2] 来支持 ts，从而实现 tsx 转化。

2. 模板注入

   我在文中的实现其实忽略了这部分，因为我实现的 App.tsx 组件包含了一个完整的 html 结构。这种操作方式其实也没什么不妥，不过生态库视乎对此没有完善的支持。

   其实关于客户端逻辑挂载和样式表等其他资源，App.tsx 完全可以使用插槽的方式提供开发接口，让组件关注的逻辑缩小，让服务器端来执行相关客户端逻辑注入。

3. 吸水反应

   在没有完成上述的实现之前，我一直以为 [吸水][6-1] 操作会是实现的难点，结果就是我真的才写了一行代码 `ReactDOMClient.hydrateRoot(document, <App />);` 就完成这个操作，所以上文中我都找不到地方提及它的使用。

React 18：

[react 18][7] 并不仅仅改动了 react 库，还对 react-dom 库也进行了改动，重构了部分的接口，同时也提供了一些新的接口。`renderToPipeableStream` 让首屏渲染快了不少，我尝试渲染了一个 20w 项的列表进行测试，大致如下：

```jsx
<ul>
  {Array.from({ length: 200000 }).map((_, i) => (
    <li key={i}>列表渲染抗压</li>
  ))}
</ul>
```

当我使用 `renderToString` 进行渲染时，首屏渲染大概花了七八秒，这期间屏幕处于一个请求的状态。打开 chrome 的性能测试，看到页面就进行了一次渲染，是在整个 http 响应结束之后。

而当我使用 `renderToPipeableStream` 进行渲染是，首屏在两秒内就完成渲染，感官上带来的效果极其明显。打开 chrome 性能测试，发现页面进行了多次渲染，浏览器在获取到一部分代码后，就立刻开始了渲染，渲染被分割成了多次，逐步完善了整个页面

### 一些思考

- 我能否在局部对数据进行转译并引入？

  我理想的情况是我能够编写一个 `getJSX` 函数，使用大致如下：

  ```jsx
  server.get("/", (req, res) => {
    res.send(getJSX("./App.tsx"));
  });
  ```

  getJSX 应该在内部引入 App.tsx 文件，因为没有转译，我只能通过 fs 文件系统拿到一段流，这期间我可以工具对其进行转译成 CommonJS 模块代码，问题是，我如何引入这段代码？

  一开始我设想时想到这个问题，在 NodeJS 环境中，我如何把一段流，当成代码进行执行？我也是傻，花了半天时间我才想到 eval 函数，然后找到 NodeJS 环境中的 [node-eval][2] 库，最后顺藤摸瓜找到了 NodeJS 的 [vm][1-1] 模块，vm 模块可以使用虚拟机来执行相关代码并获取输出，所以这个设想是成立的。

- express 不支持在 webpack 中打包。

  我花了大概两三天的时间实现上述 react 的 ssr 并写下这篇记录，虽然实现上并没有我想象的那么难，但是我并不是很满意。

  期间遇到一个问题 “为啥 express 不能使用 webpack 进行打包？”。我想使用 webpack 对 express 进行捆绑打包，这样得到的 server.js 仅依赖 NodeJS 环境就能运行，此时部署在服务器就非常方便，因为我不用安装 express 包来提供环境，只需要一条 `node server.js` 就可以运行。然而 express 内部并没有完美支持 webpack 打包，当我在配置文件删除 `externals: [nodeExternals()],` 时，再次打包就会产生警告：

  ```shell
  WARNING in ./node_modules/express/lib/view.js 81:13-25
  Critical dependency: the request of a dependency is an expression
  @ ./node_modules/express/lib/application.js 22:11-28
  @ ./node_modules/express/lib/express.js 18:12-36
  @ ./node_modules/express/index.js 11:0-41
  @ ./src/server.js 3:0-30 7:15-22 8:11-25

  1 warning has detailed information that is not shown.
  Use 'stats.errorDetails: true' resp. '--stats-error-details' to show it.

  webpack 5.73.0 compiled with 1 warning in 3630 ms
  ```

  运行这个 server.js 将得到一个错误并终止程序，express 在 webpack 中并不能正常运行，这是很烦躁的事情。

  很遗憾的是，这个问题我没有找到完美的解决方案，所有方案的目的地都指向 [webpack-node-externals][4] 这个库，就是让我把 express 设置成 [外部扩展][3-2]。

## 引用

- [NodeJS][1]
- [node-eval][2]
- [webpack][3]
- [webpack-node-externals][4]
- [babel][5]
- [react][6]
- [react 18][7]

[1]: http://nodejs.cn/
[1-1]: http://nodejs.cn/api/vm.html
[2]: https://github.com/pierrec/node-eval
[3]: https://webpack.docschina.org/
[3-1]: https://webpack.docschina.org/guides/typescript/#root
[3-2]: https://webpack.docschina.org/configuration/externals/
[4]: https://github.com/liady/webpack-node-externals
[5]: https://babeljs.io/
[5-1]: https://babeljs.io/docs/en/babel-preset-react
[5-2]: https://babeljs.io/docs/en/babel-preset-typescript
[6]: https://zh-hans.reactjs.org/
[6-1]: https://zh-hans.reactjs.org/docs/react-dom-client.html#hydrateroot
[7]: https://github.com/facebook/react/releases/tag/v18.0.0
