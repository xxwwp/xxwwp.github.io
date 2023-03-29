---
id: 549a7cba-f8e2-490f-bc33-12ac65e5c27f
title: React 如何根据外部状态进行更新
slug: /docs/blogs/React 如何根据外部状态进行更新
createAt: 2022-12-16
publish: true
tags:
  - react
  - 外部依赖
  - 外部状态
  - zustand
  - jotai
archives:
  - 博客
desc:
---

## 前言

为了更新的安全和可靠，[React][1] 的状态一直都比较封闭，不论是早期类组件的 `this.state`，还是 hook 年代的 `useState|useReducer`，React 依赖外部数据更新都不是很容易。

要使 React 订阅外部数据，外部数据的就需要有数据更新的回调，使得更新能够通知 React。

## 创建能够订阅更新的数据

一个能够订阅更新的数据一定是唯一的，并且能够在多个地方进行订阅，那么最好的方式就是使用闭包存储这个数据真实的状态，比如：

```ts
/** 创建订阅状态 */
function createSubscribeState<T>(state: T) {
  return (() => {
    /** 状态值 */
    let value: T = state;

    return {
      get: () => value,
      set: (s: T) => {
        value = s;
      },
    };
  })();
}

const count1 = createSubscribeState(0);
const count2 = createSubscribeState(0);
```

上述的 `count1` 和 `count2` 是互不干扰的，因为他们数据存储在两个不同的闭包中。

现在我们对订阅进行简单的抽象，订阅应该是开放，可以拥有多个订阅源并互不干扰，类似下面的样子：

```ts
/** 创建订阅状态 */
function createSubscribeState<T>(state: T) {
  return (() => {
    /** 状态值 */
    let value: T = state;

    /** 被订阅的列表 */
    const subscribers = new Set<Function>();

    return {
      get: () => value,
      set: (s: T) => {
        value = s;
        /** 当数据改变时，向所有订阅进行广播 */
        subscribers.forEach((fn) => fn());
      },

      /** 订阅该数据 */
      subscribe: (fn: Function) => subscribers.add(fn),
      /** 取消订阅 */
      unSubscribe: (fn: Function) => subscribers.delete(fn),
    };
  })();
}
```

此时一个简易的，能订阅更新的数据生成器完成了。

## 在 React 中订阅外部数据更新

上一节中， `subscribe` 和 `unSubscribe` 函数简直就是为 `useEffect` 而生。通过简单的处理，我们就能在 React 中订阅 `createSubscribeState` 生产出的数据。

例如：

```ts
const count = createSubscribeState(0);

/** 对 count 的更新进行订阅 */
function useOuterCount() {
  useEffect(() => {
    const listener = () => console.log("change count!");

    count.subscribe(listener);
    return () => void count.unSubscribe(listener);
  }, []);
}
```

很遗憾的是在上面代码中，我们虽然订阅了 `count` 的更新，却只能处理一些副作用代码，**不能对 React UI 进行更新**，所以我们需要一个 **强制更新** 的机制。然而在 React 中，并没有提供天然的强制更新的 API。

在 [zustand][3] 早期的 [版本][3a] 中，使用 `useReducer` 来尝试强制更新 React UI，这里我们借鉴一下：

```ts
const count = createSubscribeState(0);

/** 使用外部数据 count */
function useOuterCount() {
  // reference: https://github.com/pmndrs/zustand/blob/4d8003b363cb06ee5b1da498300a60576419485a/src/react.ts#L80
  const [, forceUpdate] = useReducer((c) => c + 1, 0) as [never, () => void];

  useEffect(() => {
    /** 通过订阅，在数据改变时，对 React UI 进行更新 */
    count.subscribe(forceUpdate);
    return () => void count.unSubscribe(forceUpdate);
  }, []);

  return [count.get(), count.set] as const;
}
```

现在我们走通所有的流程，真真切切的订阅一个外部的数据的更新，并且让这个更新来渲染了我们的 React UI。

来尝试使用下。后面三个组件中都调用 `useOuterCount`，都订阅了这一个数据，并且监听它的更新，这种更新不仅可以来自 React 内部，还可以是外部：

```tsx
/** 在 React 外更新 count */
setInterval(() => void count.set(count.get() + 1), 1000);

/** 递减 count */
function DecCount() {
  const [count, setCount] = useOuterCount();

  return <button onClick={() => setCount(count - 1)}>dec 1 ,outer count is {count}</button>;
}

/** 递增 count */
function IncCount() {
  const [count, setCount] = useOuterCount();

  return <button onClick={() => setCount(count + 1)}>inc 1 , outer count is {count}</button>;
}

const Step1 = () => {
  const [count, setCount] = useOuterCount();

  return (
    <>
      <p onClick={() => setCount(count + 10)}>outer count {count}</p>
      <DecCount />
      <IncCount />
    </>
  );
};
```

测试后你会发现，不论在定时器还是 React 内部的多个组件中，都能获取到最新的状态，并且 React 会根据这个外部数据进行更新。这样一个外部数据在 React 里面就活了过来。

然而这不是最终的结果，我不是喜欢每次都为一个外部状态写一个 hook，我们应该使用统一的 hook 来监听，所以我们对类似 `useOuterCount` 的 hook 再次进行抽象封装：

```ts
interface UseSubscribeStore<T> extends ReturnType<typeof createSubscribeState<T>> {
  (): readonly [T, (s: T) => void];
}

/** 创建一个可以订阅的存储 hook */
function createSubscribeStore<T>(data: T) {
  return ((): UseSubscribeStore<T> => {
    // 对数据进行闭包
    const state = createSubscribeState(data);

    return Object.assign(() => {
      // https://github.com/pmndrs/zustand/blob/4d8003b363cb06ee5b1da498300a60576419485a/src/react.ts#L80
      const [, forceUpdate] = useReducer((c) => c + 1, 0) as [never, () => void];

      useEffect(() => {
        state.subscribe(forceUpdate);
        return () => void state.unSubscribe(forceUpdate);
      }, []);

      return [state.get(), state.set] as const;
    }, state);
  })();
}
```

啊哈！这不美哉？现在我们可以使用 `createSubscribeStore` 来创建一个 hook，它将提供一个订阅数据，无论在 React 中，还是在 React 外，我们都能对其进行订阅和更新。美哉！

你可以这样调用它：

```tsx
/** 创建一个订阅数据 */
const useCount = createSubscribeStore(0);

// 在 React 外调用递增它
setInterval(() => void useCount.set(useCount.get() + 1), 1000);

/** 在子组件递增 count */
function IncCount() {
  const [count, setCount] = useCount();

  return <button onClick={() => setCount(count + 10)}>inc 10, outer count is {count}</button>;
}

const Step2 = () => {
  const [count, setCount] = useCount();

  return (
    <>
      <p>outer count {count}</p>
      <p>
        <button onClick={() => setCount(count - 100)}>click me, dec 100</button>
      </p>
      <IncCount />
    </>
  );
};
```

它工作得得很好，这个状态在 React 内外都运作了起来。

自此，我们完成了 React 对外部数据的订阅和更新，一个本来和 React 毫不相干的数据，在 React 内部和外部，都活了起来。

## 更好的优化 useSyncExternalStore

上面一节中，我们借鉴了 zustand 旧版本的强制渲染，使得 React 根据一个外部数据的变化，更新 React UI 本身。它是不完美的，但是其中的逻辑，可以通过 `this.setState` 降级到类组件上，这是我介绍这种更新方式的理由。

在 React 18 中，提供了 [useSyncExternalStore][1a] 这个 hook，它封装了对外部数据更新的监听。

> 你不必担心 useSyncExternalStore 和 React 的版本问题，尽管 useSyncExternalStore 是在 React 18 中推出，然而 React 为低版本提供了 [垫片](https://www.npmjs.com/package/use-sync-external-store)。

使用 `useSyncExternalStore` 对上一节的 `createSubscribeStore` 进行优化：

```tsx
/** 创建一个可以订阅的存储 hook */
function createSubscribeStore<T>(data: T) {
  return ((): UseSubscribeStore<T> => {
    // 对数据进行闭包
    const state = createSubscribeState(data);

    return Object.assign(() => {
      const subscribe = useMemo(() => {
        return (forceUpdate: Function) => {
          state.subscribe(forceUpdate);
          return () => state.unSubscribe(forceUpdate);
        };
      }, []);

      return [useSyncExternalStore(subscribe, state.get), state.set] as const;
    }, state);
  })();
}
```

按照上面的逻辑更新后，其结果并不会产生变化，只是我们调用了 React 提供的 hook 来进行更新。

分析我们自定义的更新和使用 useSyncExternalStore 的更新：

```tsx
// 自定义
const [, forceUpdate] = useReducer((c) => c + 1, 0) as [never, () => void];

useEffect(() => {
  state.subscribe(forceUpdate);
  return () => void state.unSubscribe(forceUpdate);
}, []);

return [state.get(), state.set] as const;

// 使用了 useSyncExternalStore
const subscribe = useMemo(() => {
  return (forceUpdate: Function) => {
    state.subscribe(forceUpdate);
    return () => state.unSubscribe(forceUpdate);
  };
}, []);

return [useSyncExternalStore(subscribe, state.get), state.set] as const;
```

会发现实际上 `useSyncExternalStore` 实际上就是帮我们解决强制更新 React 内部 UI 的问题。

我不是很了解 `useSyncExternalStore`，在 [如何理解 React 18 中的 useSyncExternalStore ?][r2] 中，有人说到这会干扰 Concurrent 模式的执行，这不是个好兆头，我还盼望着 Concurrent 模式未来大好的发展呢。

> 我故意在 `useSyncExternalStore` 中使用 "forceUpdate" 当做参数名，然而 React 提供的名字是 "onStoreChange"，即当订阅数据更新时执行，可是我的实际测试却不是这样，它的行为就类似我们自定义中 `useEffect` 一样，不是在数据更新时订阅，而是在挂载时。同时他接受一个函数返回值，在组件被卸载时执行。

打完收工！

## 代码

[![Edit prod-leaf-dqho5w](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/prod-leaf-dqho5w?fontsize=14&hidenavigation=1&theme=dark)

<iframe src="https://codesandbox.io/embed/prod-leaf-dqho5w?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="prod-leaf-dqho5w"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 引用

- [React][1]
- [How to use useSyncExternalStore][2]
- [zustand][3]

## 参考

- [Zustand - how does it work? How does it cause a re-render?][r1]
- [如何理解 React 18 中的 useSyncExternalStore ?][r2]

[1]: https://reactjs.org/
[1a]: https://reactjs.org/docs/hooks-reference.html?#usesyncexternalstore
[2]: https://medium.com/@mrovinsky/how-to-use-usesyncexternalstore-a9926f8c7e60
[3]: https://github.com/pmndrs/zustand/
[3a]: https://github.com/pmndrs/zustand/blob/4d8003b363cb06ee5b1da498300a60576419485a/src/react.ts#L80
[r1]: https://www.reddit.com/r/reactjs/comments/v5l6f5/zustand_how_does_it_work_how_does_it_cause_a/
[r2]: https://www.zhihu.com/question/502917860
