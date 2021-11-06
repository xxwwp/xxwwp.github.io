---
title: vue2 与 vue3 变化总结
slug: notes/vue2 与 vue3 变化总结
createAt: 2021-11-06
# nextPage: nextlink
# prevPage: lastlink
publish: false
tags:
  - vue2
  - vue3
  - 版本迁移
archives:
  - 笔记
desc:
---

## 脚手架安装

我比较喜欢使用 vue-cli，在 vue3 中，使用安装脚手架比较简单，使用以下命令：

```sh
yarn global add @vue/cli
# 或
npm install -g @vue/cli
```

当然也有很多其他安装方式，比如 Vite，cdn，或者直接获取 vue 的库安装，[详见官网](https://v3.cn.vuejs.org/guide/installation.html#%E5%AE%89%E8%A3%85)

## 应用

### 创建

不同于 vue2 版本的 `new Vue` 语句，vue3 中创建应用实例如下：

```js
const app = Vue.createApp({
  /* 选项 */
});
```

后续的注册全局指令，全局组件，或者使用路由和状态机都是链式调用，比如：

```js
const instance = Vue.createApp({})
  .component("SearchInput", SearchInputComponent) // 全局组件
  .directive("focus", FocusDirective) // 全局指令
  .use(LocalePlugin) // 插件
  .use(router) // 路由，现在路由和状态机被当做插件使用
  .use(store) // 状态机
  .mount("#app"); // 挂载
```

### 生命周期

vue3 的声明周期相对 vue2 进行了一些修改，明显的就是 `destory` 被重命名为 `unmount`。

[官网图示](https://v3.cn.vuejs.org/images/lifecycle.svg)：

![](https://v3.cn.vuejs.org/images/lifecycle.svg)

## 模板语法

### v-if 和 v-for 优先级更改

在 vue2 中，`v-if` 和 `v-for` 同时作用一个元素时，`v-for` 的优先级更高，在 vue3 中正好反过来。这对我影响倒是不大，因为 vue 任何版本都不推荐二者同时写到同一个元素上，所以我都是拆开写的。

### 多事件处理器

在迁移文档到我还没看到这个，vue3 中支持对一个事件传入多个处理器，使用逗号分开：

```html
<!-- 这两个 one() 和 two() 将执行按钮点击事件 -->
<button @click="one($event), two($event)">Submit</button>
```

### 按键修饰符

vue3 中：

> - 非兼容：不再支持使用数字 (即键码) 作为 `v-on` 修饰符
>
> - 非兼容：不再支持 `config.keyCodes`

不在支持键码了，现在你如果想监听字母 q 键，可以这么写：

```html
<input type="text" @keypress.q="inputQ" />
```

当用户输入 <kbd>q</kbd> 时，将执行 `inputQ` 方法。

vue3 中按键修饰符语法是 _kebab-cased (短横线) 名称_，[官网示例](https://v3.cn.vuejs.org/guide/migration/keycode-modifiers.html#_3-x-%E8%AF%AD%E6%B3%95)很多。

用法还挺小清新，比如：

```html
<!-- Vue 3 在 v-on 上使用按键修饰符 -->
<input v-on:keyup.page-down="nextPage" />

<!-- 同时匹配 q 和 Q -->
<input v-on:keypress.q="quit" />
```

### v-model

`v-model` 指令也大修了，如果在原生组件上使用 `v-model`，比如：

```html
<input v-model="searchText" />
```

依旧和 vue2 一样，等价于：

```html
<input :value="searchText" @input="searchText = $event.target.value" />
```

但是，在 vue3 中，如果在组件上使用 `v-model`，比如：

```html
<my-input v-model="searchText" />
```

将变为：

```html
<my-input :model-value="searchText" @update:model-value="searchText = $event"></my-input>
```

组件内需要绑定 `v-model` 将执行 `$emit("update:modelValue",$event)` 语法。

官网推荐这样写：

```js
app.component("custom-input", {
  props: ["modelValue"],
  emits: ["update:modelValue"],
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  `,
});
```

### 移除 v-on.native 修饰符

在 vue3 中，修改了[属性继承](https://v3.cn.vuejs.org/guide/component-attrs.html#attribute-%E7%BB%A7%E6%89%BF)的定义。原生事件会直接透传到组件内部的根组件，不在使用 `native` 修饰符。[详见](https://v3.cn.vuejs.org/guide/migration/v-on-native-modifier-removed.html#_3-x-%E8%AF%AD%E6%B3%95)。

多个根节点的话就查看[多个根节点上的 Attribute 继承](https://v3.cn.vuejs.org/guide/component-attrs.html#%E5%A4%9A%E4%B8%AA%E6%A0%B9%E8%8A%82%E7%82%B9%E4%B8%8A%E7%9A%84-attribute-%E7%BB%A7%E6%89%BF)。

## 组件

### emits 属性

`emits` 属性是新增的，类似 `props`，用来标记子组件可以香父组件传递的事件列表。

[官网示例](https://v3.cn.vuejs.org/guide/migration/emits-option.html#_3-x-%E7%9A%84%E8%A1%8C%E4%B8%BA)

### 自定义事件

自定义事件需要在 `emits` 属性中定义，参考 [emits 属性](#emits%20属性)

#### 事件验证

自定义事件现在提供了验证功能，比如表单提交，你现在可以直接在用户点击提交按钮后触发自定义表单提交事件，验证部分可以交由事件验证功能处理。[官网示例 验证抛出的事件](https://v3.cn.vuejs.org/guide/component-custom-events.html#%E9%AA%8C%E8%AF%81%E6%8A%9B%E5%87%BA%E7%9A%84%E4%BA%8B%E4%BB%B6)。

但是官网是这样说的：

> 验证函数应返回布尔值，以表示事件参数是否有效。

也就是不能异步验证，不能返回一个 `Promise` 当做验证结果，验证函数也不能是一个 async_function。

### v-model 参数

> 默认情况下，组件上的 `v-model` 使用 `modelValue` 作为 prop 和 `update:modelValue` 作为事件。

这个默认 prop 名和事件名是可以修改的，例如：

```html
<my-component v-model:attrname="bookTitle"></my-component>
```

`:attrname` 将双向绑定的属性设置为 `attrname`，现在 `attrname` 将作为 prop 传给子组件，子组件可以通过 `update:attrname` 事件来修改该值。

子组件内：

```js
import { defineComponent } from "vue";
export default defineComponent({
  name: "ChildComponent",
  emits: ['update:attrname']
  props: {
    attrname: String,
  },
  created() {
    this.$emit("update:attrname", "返给你一个初始值");
  },
});
```

[官网示例示例](https://v3.cn.vuejs.org/guide/component-custom-events.html#v-model-%E5%8F%82%E6%95%B0)。

### v-model 修饰符

vue3 中 v-model 也可以自定义修饰符了。

v-model 的修饰符将以 prop 的形式传递给子组件，类型例子如下：

```ts
// 修饰符例子
type ModifierExamples = "upper" | "lower";

// 默认 v-model 的修饰符 prop 名
type DefaultModifierProp = "modelModifiers";

// 默认 v-model 的修饰符 prop 值
type DefaultModifierPropValue = {
  [key in ModifierExamples]?: true;
};

// 自定义 v-model 的修饰符 prop 名，例如 v-model:custom
type CustomModifier = "custom";
type CustomModifierProp = `${CustomModifier}Modifiers`;

// 自定义 v-model:custom 的修饰符 prop 值
type CustomModifierPropValue = {
  [key in ModifierExamples]?: true;
};
```

例如上面的例子，我们传递给子组件的上下绑定如下：

```html
<custome-el v-model.upper.lower="value" v-model:title.upper="title" />
```

那么在子组件中接收到的值为：

```js
import { defineComponent } from "vue";

export default defineComponent({
  name: "CustomeEl",
  emits: {
    "update:modelValue": null,
    "update:title": null,
  },
  props: {
    modelValue: String,
    title: String,
    // v-model 的修饰符
    modelModifiers: {
      default: () => ({}),
    },
    // v-model:title 的修饰符
    titleModifiers: {
      default: () => ({}),
    },
  },
  created() {
    console.log(this.modelModifiers, this.titleModifiers);
    // 将会打印 {upper: true, lower: true} {upper: true}
  },
});
```

注意，没有传递的修饰符是接收不到的，接收到的必定是 `true`。
