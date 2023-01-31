---
title: 如何才能手动触发 React 表单的 onChange 事件
slug: /docs/blogs/如何才能手动触发 React 表单的 onChange 事件
createAt: 2023-01-31
publish: true
tags:
  - react
  - input
  - select
  - 原生事件
archives:
  - 博客
desc:
---

年前项目里面使用到手机号的几个接口都加了区号，就是类似“+86”这种字段，明显就是一个 select 选择器。

我预期是把一个 input 或者 select 元素进行封装后，给原生表单元素分发 input 或者 change 事件，使其触发自身被绑定的业务逻辑，这样可以让组件像原生表单元素一样进行工作，然而在进行实现的时候我却犯了难。

## 先说说派发事件

js 中每个元素都继承自 [EventTarget][1]，EventTarget 一个方法就是 `dispatchEvent`，它被用来分发一个事件给 EventTarget。

用法比如：

```js
element.dispatchEvent(new Event("click"));
```

上面一行代码会触发元素的 click 事件，如果该元素之前有绑定过 click 事件，那么相关的逻辑就会执行。

所以根据上诉的原理，我在 React 中就想通过自己触发表单的 input 或者 change 原生事件来触发 React 的 `onChange` 合成事件，可是 React 不接受这个事件。其他的比如 click 事件等，我也尝试过，React 会监听到并且执行，然而就表单事件没办法。

**总归来说，还是原生表单元素保存了自己的状态，因为就算我不在 React 里面执行，使用原生代码，虽然表单事件可以监听到，但是表单元素的数据却无法进行更新。**

> 原生表单控件自己保存了数据状态，封闭了开发对其的数据改变的分发。

## 一个偏方

发现上面的问题后，我在各大网站查询解决办法，发现没有一个答案可以从根本上解决上述问题，没有完美的方式触发表单元素 input 或者 change 事件的方式。

我想起了 Mui 中的 Select 组件，它就是自定义了选择器并且把 React 的 onChange 事件进行触发了，于是我翻了翻 [Mui Select 组件源码][2]，发现它的处理方式也很脏。

Mui Select 组件部分源码：

```js
const nativeEvent = event.nativeEvent || event;
const clonedEvent = new nativeEvent.constructor(nativeEvent.type, nativeEvent);

Object.defineProperty(clonedEvent, "target", {
  writable: true,
  value: { value: newValue, name },
});
onChange(clonedEvent, child);
```

Mui 中，在点击自定义下拉框中的选项时，把原生事件 `nativeEvent` 提了出来，然后使用其构造器进行克隆，并把克隆事件的 `target` 属性进行重新定义，之后把这个不正式的事件对象提交给了 `onChange`。

Mui 也没找到办法触发原生表单的 input 或者 change 事件，只能自定义一个事件对象进行提交。

用户从 Select 组件拿到的事件对象的确是 Event 的实例，可以对其进行 `e.target.value` 取值，不过 `e.target` 不指向 select 或 input 元素，只是一个数据对象，同时这个克隆事件不是 React 提供的合成事件。Mui 这种处理后骗过了 [react-hook-form][3] 和 [formik][4]。

## 为什么写这篇文章

如果你不在 React 中对 select 元素进行重新封装，那么几乎不会遇到这个问题，因为在目前的表单元素中，select 的 option 是非常难重新设计的，因为 option 的子节点不接受其他元素，无法自定义。

同样，如果你在设计非常规表单组件，例如滑块、级联选择器、取色器、时间日期选择器、评分等等，这些组件都会涉及这一问题，**“如何才能手动触发 React 表单的 onChange 事件”**，我想你并不想类似 Mui 一样丢一个自建事件对象给到用户。

而如果你放弃原生表单事件，那么基于原生表单封装的 headless 库用起来就会做一些额外工作，大多数表单 headless 库都遵循 React 官方文档写的，使用类似以下方式进行多字段处理：

```js
setFormFields((p) => ({
  ...p,
  [e.target.name]: e.target.value,
}));
```

这篇文章中并没有从根本上解决这个问题，因为原生层面就没有更好的解决方法。Mui 中的处理可以借鉴，不然就只有放弃原生事件的提交了。

> 在放弃表单原生事件的情况下，部分表单 headless 库的解决方案：
>
> - [react-hook-form][3]：可以尝试使用 [Controller][3a] 组件
> - [formik][4]：尝试使用 [setFieldValue][4a] 函数

## 参考与引用

- [EventTarget][1]
- [Mui Select source code][2]
- [react-hook-form][3]
- [formik][4]

[1]: https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget
[2]: https://github.com/mui/material-ui/blob/v5.11.6/packages/mui-material/src/Select/SelectInput.js#L291
[3]: https://react-hook-form.com/
[3a]: https://react-hook-form.com/api/usecontroller/controller
[4]: https://formik.org/
[4a]: https://formik.org/docs/api/formik#setfieldvalue-field-string-value-any-shouldvalidate-boolean--void
