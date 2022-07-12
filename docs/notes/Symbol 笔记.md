---
title: Symbol 笔记
slug: /docs/notes/Symbol 笔记
createAt: 2022-07-12
publish: true
tags:
  - JavaScript
  - js
  - Symbol
archives:
  - 笔记
desc:
---

## Symbol

[参考][1]

Symbol 是 es 新的数据类型，**最基本的功能就是生成一个唯一值**。

例如：

```js
Symbol() === Symbol(); // false
Symbol("foo") === Symbol("foo"); // false
Symbol({}) === Symbol({}); // false
```

### Symbol 特性

- Symbol 函数不能使用 new 关键字实例化

- Symbol 类型转换

  - `typeof` 关键字验证 Symbol 类型总是返回 `"symbol"`

  - Symbol 值隐式转换数字或者字符串会报错，例如：

    ```js
    +Symbol(); // error
    Symbol() + ""; //error
    ```

  - 宽松相等时，`Object(sym) == sym` 返回 true

  - Symbol 值可以显式转化为字符串，使用 `String(sym)` 类似于 `sym.toString()`

- for...in 语句不会遍历对象的 Symbol 键：

  ```js
  const foo = {
    [Symbol()]: "any",
    bar: "bar value",
  };
  for (const item in foo) {
    console.log(item); // only "bar"
  }
  ```

  但是可以使用 [Object.getOwnPropertySymbols()][2] 来获取对象的 Symbol 键。

- JSON.stringify 不会序列化 Symbol 键：

  ```js
  const foo = {
    [Symbol()]: "any",
  };
  JSON.stringify(foo); // "{}"
  ```

- [Symbol 包装器对象作为属性的键](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol#symbol_%E5%8C%85%E8%A3%85%E5%99%A8%E5%AF%B9%E8%B1%A1%E4%BD%9C%E4%B8%BA%E5%B1%9E%E6%80%A7%E7%9A%84%E9%94%AE)

## 方法（部分）

所有方法[详见][1]。

### Symbol.for(key)

因为 Symbol 生成的值是唯一的，所以在 es 模块系统中无法正常共享数据，但是 Symbol 提供两个方法来共享全局的 Symbol。

Symbol.for 使用给定的 key 一个字符串在全局注册一个 Symbol 值并返回对应的 Symbol，如果该 key 已经注册，则返回对应的 Symbol。

### Symbol.keyFor(sym)

同 Symbol.for 功能相反，通过 Symbol 查找其在全局上注册的 key 值。

使用：

```js
const globalSym = Symbol.for("global");
const globalSym2 = Symbol.for("global");
globalSym === globalSym2; // true

Symbol.keyFor(globalSym); // "global"
```

## 属性（部分）

所有属性[详见][1]。

### Symbol.hasInstance

> Symbol.hasInstance 用于判断某对象是否为某构造器的实例。

它可以被用来自定义 instanceof 行为：

```js
class NullObj {
  static [Symbol.hasInstance](instance) {
    return instance === null;
  }
}

console.log(null instanceof NullObj); // true
```

### Symbol.iterator

> Symbol.iterator 为每一个对象定义了默认的迭代器。该迭代器可以被 for...of 循环使用。

例如：

```js
Number.prototype[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

console.log([...NaN]); // [1,2,3]
```

> Symbol 还提供另一个属性模拟异步迭代器 [Symbol.asyncIterator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator)

### Symbol.toPrimitive

> Symbol.toPrimitive 是一个内置的 Symbol 值，它是作为对象的函数值属性存在的，当一个对象转换为对应的原始值时，会调用此函数。

Symbol.toPrimitive 会改变对象转化为原始值的默认行为。例如：

```js
const object1 = {
  [Symbol.toPrimitive](hint) {
    return "hello world";
  },
};

console.log(object1 + "!"); // "hello world!"
```

上述 `object1 + "!"` 表达式对 object1 进行了隐式转化，调用了 Symbol.toPrimitive 属性的函数。

> [这里](https://juejin.cn/post/7079936779914051615#heading-10) 有更有趣的玩法。

### Symbol.toStringTag

> Symbol.toStringTag 是一个内置 symbol，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型标签，通常只有内置的 Object.prototype.toString() 方法会去读取这个标签并把它包含在自己的返回值里。

例如：

```js
class ValidatorClass {
  get [Symbol.toStringTag]() {
    return "Validator";
  }
}

Object.prototype.toString.call(new ValidatorClass()); // "[object Validator]"
```

或者改变原始类：

```js
Object.defineProperty(Number.prototype, Symbol.toStringTag, {
  get() {
    return "Not a number";
  },
});
Object.prototype.toString.call(1); // '[object Not a number]'
```

## 引用

- [Symbol][1]

[1]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol
[2]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols
