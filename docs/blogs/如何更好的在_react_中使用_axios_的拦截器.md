---
title: 如何更好的在 react 中使用 axios 的拦截器
createAt: 2021-09-28
slug: /docs/blogs/如何更好的在 react 中使用 axios 的拦截器
publish: true
tags:
  - react
  - axios
  - 拦截器
  - 状态跟踪
  - 状态丢失
  - axios 拦截器封闭性
  - 请求
  - 封装
archives:
  - 博客
  - 前端
---

## 前言

[axios][1] 算是当下最热门的前端 ajax 处理库，它简单易上手，扩展性强，功能齐全。

我之前在 [react][2] 中处理 axios 的封装一直没有找到很好的方式，因为 axios 是非常独立，并且提供的各种 api 都是一次性配置，例如 `axios.create`、`axios.defaults`，这让 react 对 axios 进行封装异常麻烦。你并不是那么容易就能在 axios 中随心使用 react，反之亦然。

尽管目前已经有各种优秀的基于 react 的 ajax 封装，例如 [SWR][3]、[ahooks][4] 中的 `useRequest`，但是它们更像是对 [async_function][5] 或 [Promise][6] 进行处理，而非确切的 http 请求。简单的说，配置一个请求头前面这两个库就没有本地支持，因为它们默认都是使用 [fetch][7] 进行处理，本身对 ajax 并没有进行更深的封装。

## axios 在 react 中的定义

对于 react 来说，axios 就是一个第三方工具，或者说是服务。我们不能使用 [jQuery][8] 或者 [Vue2][9] 的思维来理解 axios 的 **所有** 使用方式，例如 axios 的拦截器。

无论是在无框架页面还是 Vue 中，我都倾向于对 axios 进行一次性配置，例如：

```js
export const ajax = axios.create({
  // ...
});

// 拦截器 - 错误请求提示
ajax.interceptors.request.use(
  (config) => config,
  (error) => {
    alert("请求出错！");
    return Promise.reject(error);
  }
);
```

这是一劳永逸的，我甚至会为 axios 的拦截器单独创建一个文件，然后为登录、请求状态 loading、日志等等做一系列的拦截器，最后使用类似下述的语法直接批量导入：

```js
export const ajax = axios.create({
  // ...
});

interceptors.forEach(({ request, response, fail }) => {
  ajax.interceptors.request.use(request, fail);
  ajax.interceptors.response.use(response, fail);
});
```

但是这种情况在 react 中就让你 GG。因为这样封装 axios，你无法享受 react 的所有功能，例如 Context、Ref、或者第三方的路由等等。（即便这些你能勉强套进去，架构也是很耦合的）

回到小节标题，这是因为 axios 本身就是作为一种工具存在，我已经习惯了这种用法。但是 **在 react 中，axios 并不是完全作为第三方工具，它的拦截器应该被定义为服务，即 react 中的副作用代码。**

## 让 axios 基于服务

把 axios 当做服务，那么它在 react 中的封装方式将迎刃而解。我的大致封装如下：

```js
import axios from "axios";
import { Fragment } from "react";

const ajax = axios.create({
  /* ... config */
});

export default ajax;

// 服务封装
function useAjaxEffect1() {}
function useAjaxEffect2() {}

// 服务钩子集合
export function useAjaxEffect() {
  useAjaxEffect1();
  useAjaxEffect2();
}

// 服务片段
export function AjaxEffectFragment() {
  useAjaxEffect();
  return <Fragment />;
}
```

上面的代码中，`useAjaxEffect` 与 `AjaxEffectFragment` 取决于你的使用场景：

- 假如你的 axios 封装是基于全局的，那么在 `index.jsx` 或者 `App.jsx` 上挂载 `useAjaxEffect` 即可。

- 假如你的 axios 封装是基于状态库，或者第三方组件，那么你应该使用服务片段 `AjaxEffectFragment`，把服务片段填充到依赖组件的内部。这是推荐的。

## 如何使用

举个两个最经典的例子：

- 在 axios 拦截器中消费上下文，使用 `useContext`

- 在 axios 中使用第三方路由 [React Router][11]

### 消费上下文

在 react 中，使用 axios 中消费上下文一直是个非常棘手的事情，但是使用了上述封装，代码会变得异常简单。这个例子中，我们模拟请求日志监听，并把监听到的请求通过 Context 进行写入，然后在应用中展示出来。

首先我们需要编写一个日志上下文如下：

```tsx
// src/lib/log.tsx
import { createContext, useContext, useEffect, useRef, useState } from "react";

// 日志模板
const logTemplate = { log: [], update: (_log: string[]) => {} };

// 日志上下文
export const LogContext = createContext(logTemplate);

// 日志供应
export default function LogProvider({ children }) {
  const [log, setLog] = useState([]);

  return <LogContext.Provider value={{ log, update: setLog }}>{children}</LogContext.Provider>;
}

// 日志服务
export function useLog() {
  const { log, update } = useContext(LogContext);
  // 写入日志的参考，写入操作可能是异步的，使用 ref 可以写入最新的日志状态
  const writeRef = useRef<(newLog: string) => void>(null);

  useEffect(() => {
    writeRef.current = (newLog: string) => void update([...log, newLog]);
  }, [log, update]);

  return { log, writeRef };
}
```

这个日志库包含了上下文供应器 `LogProvider` 和使用日志的 hook `useLog`，使用很简单。

你也许会疑问为什么要使用 `useRef` 来存储写入日志的函数，这是因为写入操作可能是异步的，特别是在 axios 的拦截器中，拦截器会和请求执行的上下文进行绑定，异步的请求可能会把日志写到旧的状态中，我习惯把这种绑定实时状态的结构称作 _状态跟踪_。详见最后一节 [axios 拦截器封闭性](<#axios 拦截器封闭性>)。

当然你也不必强制在 `useLog` 中使用 `useRef` 从而实现导出实时的更新日志功能，大可以让调用此库的服务自行进行 _状态跟踪_。

接下来我们来到 App.tsx，写入下列代码：

```tsx
import "./styles.css";
import ajax, { useAjaxEffect, AjaxEffectFragment } from "./lib/ajax";
import LogProvider, { useLog } from "./lib/log";

function Children1() {
  // 你可以使用 useAjaxEffect 来代替 <AjaxEffectFragment />，但是并不建议，因为该组件的更新会让 useAjaxEffect 产生冗余更新
  // useAjaxEffect();
  const { log } = useLog();

  async function handleFetch() {
    await ajax.get("https://raw.githubusercontent.com/facebook/react/main/README.md");
  }

  return (
    <div className="children">
      <h2>children 1</h2>
      <button onClick={handleFetch}>run axios</button>
      {log.map((v, i) => (
        <p key={i}>{v}</p>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <LogProvider>
      <AjaxEffectFragment />
      <Children1 />
    </LogProvider>
  );
}
```

**在 App.tsx 中我们应用了 `LogProvider`，请注意，在 axios 中写入日志需要消费日志库的上下文，所以必须让 axios 的副作用代码放在 `LogProvider` 中。**

> 同理，想要在 axios 中调用第三方库，例如页面路由，也需要把 `<AjaxEffectFragment />` 放在路由器中。

上述一系列的步骤和 axios 没有完全关系对吧，这是我喜欢 react 的地方，它可以让你的代码耦合度降得非常低。

现在我们需要在 axios 中监听请求，并且写入日志库中，很简单，我们重写 [上一节](<#让 axios 基于服务>) 中 `useAjaxEffect1` 如下：

```ts
// axios 请求监听
function useAjaxEffect1() {
  const { writeRef } = useLog();

  useEffect(() => {
    function request(config) {
      writeRef.current(`新请求：${config.url}`);
      return config;
    }

    function fail(error) {
      writeRef.current(`请求失败：${error.message}`);
      return Promise.reject(error);
    }

    function success(response) {
      writeRef.current(`响应成功：${response.config.url}`);
      return Promise.resolve(response);
    }

    const inter1 = ajax.interceptors.request.use(request, fail);
    const inter2 = ajax.interceptors.response.use(success, fail);

    return () => {
      ajax.interceptors.request.eject(inter1);
      ajax.interceptors.response.eject(inter2);
    };
  }, [writeRef]);
}
```

此时我们就让 axios 在 react 中活了过来，拦截器会实时把请求记录在 react 的上下文中，我们可以在 react 的任意地方调用日志上下文查看请求日志。

你可以在 [codesandbox][ex] 上查看效果。

### 在拦截器中使用路由

在 axios 的拦截器中使用路由也是非常麻烦的事情，也有一些 “[歪门邪道][a1]” 的路由处理方式，我曾经也是这样的，甚至我会粗暴的来一个：

```js
window.location.href = baseURL + "/404.html";
```

上述的处理无疑不是粗糙且死板的，你有可能没有拿到最新的路由，又或者直接放弃了 React-Router 提供的无刷新路由。总而言之，之前我在 axios 的拦截器中使用路由一直不是件光彩事。

但是现在我们可以这样做，修改 src/App.tsx 中的代码如下：

```tsx
function DefaultPage() {
  async function handleFetch() {
    // 这是一个错误的 url，github 将返回给我们 404
    await ajax.get("https://reactjs.org/123/123");
  }
  return (
    <div>
      <h3>Default Page</h3>
      <button onClick={handleFetch}>fetch 404 data</button>
    </div>
  );
}

function Status404Page() {
  const history = useHistory();
  return (
    <div>
      <h2>404 Page</h2>
      <button onClick={() => void history.goBack()}>back page</button>
    </div>
  );
}

function Children2() {
  return (
    <div className="children">
      <h2>children 2</h2>
      <Switch>
        <Route exact path="/">
          <DefaultPage />
        </Route>
        <Route path="/404">
          <Status404Page />
        </Route>
      </Switch>
    </div>
  );
}

export default function App() {
  return (
    <LogProvider>
      <BrowserRouter>
        <AjaxEffectFragment />
        <Children1 />
        <Children2 />
      </BrowserRouter>
    </LogProvider>
  );
}
```

上面代码中，我们编写添加 React-Router，并把路由器 `<BrowserRouter />` 放到了 `<AjaxEffectFragment />` 的外边，你必须那么做，不然你无法在 axios 中使用 `useHistory` 等服务，这是 react 基本概念，不详细探讨。

接着我们在 `Children2` 组件中进行了页面路由，一个 `/` 路径，一个 `/404` 路径。

在默认页面 `DefaultPage` 组件中，我们可以进行一次错误的请求，请求会返回给我们 404 的状态码，现在我们需要在 axios 中进行拦截，当请求出现 404 时，跳转到 `/404` 页面。

依旧很简单，我们重写 [上一节](<#让 axios 基于服务>) 中 `useAjaxEffect2` 如下：

```ts
// 404 请求跳转至 /404 页面
function useAjaxEffect2() {
  const history = useHistory();
  const historyRef = useRef(history);

  // 对 history 进行状态跟踪，为什么那么做参见最后一节 【axios 拦截器封闭性】，尽管 useHistory 的返回值是一个引用值不会变化，但是我依旧建议那么做
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    function success(response) {
      return Promise.resolve(response);
    }

    function check404(error) {
      // 检测到 404 请求进行页面跳转
      if (error.response && error.response.status === 404) {
        historyRef.current.push("/404");
      }
      return Promise.reject(error);
    }

    const interId = ajax.interceptors.response.use(success, check404);

    return () => void ajax.interceptors.response.eject(interId);
  }, [historyRef]);
}
```

大功告成，现在所有的 404 请求都会将页面重定向到 `/404` 页面，在 codesandbox 中错误请求会把错误信息展示到页面上，你需要手动关掉它查看最终效果，[在这里有本文的详细代码][ex]。

<iframe src="https://codesandbox.io/embed/ru-he-geng-hao-de-zai-react-zhong-shi-yong-axios-k8fl7?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="如何更好的在 react 中使用 axios"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   >
</iframe>

你现在可以尝试点击默认页中的按钮，它会进行一个 404 请求，页面将重定向到 `/404` 页面。

## axios 拦截器封闭性

axios 拦截器有个非常特殊的地方，那就是 **一个正在进行的 axios 请求，无法删除或者添加拦截器**，我把这个称作 **axios 拦截器封闭性**。

### 状态丢失

这个问题让我踩了一个大坑，例如上面两个例子中，我都对拦截器依赖的功能使用 Ref 进行参考调用，如果直接使用非引用的函数，例如日志记录例子中更新日志的 `update` 函数，或者路由跳转例子中的 `history` 对象，拦截器都会访问绑定时对它们的引用，如果在请求期间相关引用进行更新，拦截器将不会知道。

这会造成什么样的问题？

假设记 foo 与 bar 为两个请求，log 为日志信息，默认为空数组 `[]`，然后我们让 axios 的拦截器对日志数组进行 `update([...oldLog, newLog])` 的压入操作，请求开始时写入请求的名字，请求结束时写入 "请求的名字 + end"，foo 与 bar 的请求顺序如下：

1. foo 请求开始

1. bar 请求开始

1. foo 请求结束

1. bar 请求结束

针对上面的情况，我们期望的日志结果应该是 `log = [foo, bar, fooEnd, barEnd]` 对吧，然而实际并不是这样。

如果不使用 Ref 进行状态跟踪，那么实际写入的日志将为：

1. 初始状态：`log = []` 记作状态 A；

1. foo 请求开始，绑定状态 A：从 A 中压栈 `log = [...A, foo] = [foo]`，记作状态 B；

1. bar 请求开始，绑定状态 B：从 B 中压栈 `log = [...B, bar] = [foo, bar]`，记作状态 C；

1. foo 请求结束，从 A 中压栈：`log = [...A, fooEnd] = [fooEnd]`，记作状态 D；（foo 不会更新状态，因为拦截器对 A 状态形成了闭包）

1. bar 请求结束，从 B 中压栈：`log = [...B, barEnd] = [foo, barEnd]`。

最终 `[foo, barEnd]` 将作为日志记录的结果，这显然不是我们预期的值。所以我们需要使用 _状态跟踪_。

你也许不信，这是什么狗屁逻辑，我写出这个 bug 的时候也很郁闷，当时在 codesandbox 上写的，还以为是环境问题，后来发现我在第一层，axios 在第五层，人家 codesandbox 在云层。

你可以使用下面的方式复现这个 bug，我们来修改日志库文件提供的 `useLog` 服务：

```ts
// 日志钩子
export function useLog() {
  const { log, update } = useContext(LogContext);
  // 写入日志的参考，写入操作可能是异步的，使用 ref 可以写入最新的日志状态
  const writeRef = useRef<(newLog: string) => void>(null);

  useEffect(() => {
    writeRef.current = (newLog: string) => void update([...log, newLog]);
  }, [log, update]);

  const write = useCallback((newLog: string) => void update([...log, newLog]), [log, update]);

  return { log, writeRef, write };
}
```

我们添加一个 `write` 函数，它的功能和 `writeRef` 的参考值计算逻辑完全一样。拿去用吧，彦祖！你会和我一样感受 bug 带来的痛苦。

然后使用 `write` 来写入日志，修改 axios 的服务 `useAjaxEffect1` 部分代码如下：

```ts
function useAjaxEffect1() {
  // 全部使用 write 代替 writeRef
  const { write } = useLog();

  useEffect(() => {
    function request(config) {
      write(`新请求：${config.url}`);
      return config;
    }

    function fail(error) {
      write(`请求失败：${error.message}`);
      return Promise.reject(error);
    }

    function success(response) {
      write(`响应成功：${response.config.url}`);
      return Promise.resolve(response);
    }

    const inter1 = ajax.interceptors.request.use(request, fail);
    const inter2 = ajax.interceptors.response.use(success, fail);

    return () => {
      ajax.interceptors.request.eject(inter1);
      ajax.interceptors.response.eject(inter2);
    };
  }, [write]); // 依赖记得改掉
}
```

此时 bug 得以复现，管你怎么请求，日志写入总是奇形怪状。这就叫做 _状态丢失_。

### 状态跟踪

不知道是是那个团队，他们把 react 的每次执行称作 **执行帧**，把执行帧里每次使用的数据叫做 **帧数据**。我很喜欢这个叫法。

react 的帧数据总是随着执行帧进行变化的，上一帧的数据在下一帧就成为了 **过时帧数据**，上面说的状态丢失就是使用了过时的帧数据，导致 react 不能正常的工作。

axios 的拦截器会在请求开始时固定，中途无法修改，这些拦截器会和请求开始时所在执行帧的帧数据进行绑定，形成闭包，拦截器是异步的，在一个请求中不知道会执行多少帧，这就造成了状态丢失，从而无法正常更新帧数据。

不过你使用状态跟踪的方式就可以很轻松的解决这个问题，这只是用 `useRef` 对帧数据进行引用参考而已。`useRef` 的返回值本身是不会变的，我们可以把它称为 **常量帧数据**，尽管 `ref.current` 会进行改变，但是 ref 本身的引用是不变的，所以从声明 ref 的那一帧开始，这个引用就不会再发生变化。

对于 axios 拦截器的闭包，我们就使用 `useRef` 来处理，只要让 ref 成为第三方 api 的闭包，react 就可以在每一帧对其进行精准控制，从而改变第三方库的执行环境。

## 尾语

这就是我在 react 中对 axios 拦截器的新的封装雏形，如果你有更好的方法，欢迎探讨。

[1]: https://axios-http.com/
[2]: https://reactjs.org/
[3]: https://swr.vercel.app/
[4]: https://ahooks.js.org/
[5]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function
[6]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
[7]: https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API
[8]: https://jquery.com/
[9]: http://vuejs.org/
[11]: https://react-router.docschina.org/
[ex]: https://codesandbox.io/s/ru-he-geng-hao-de-zai-react-zhong-shi-yong-axios-k8fl7
[a1]: https://bilot.group/articles/using-react-router-inside-axios-interceptors/
