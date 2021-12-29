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

### 移除 $listeners

vue3 中奖不再有 `$listeners`，同样在模板中不能使用这个特殊变量。事件监听器现在是 `$attrs` 的一部分，万事大喜，以后 _透传_ 只需要用 `v-bind="$attrs"` 方式即可：

```html
<div v-bind="$attrs"></div>
```

不过这个还是不够灵活，比较很多时候我并不希望传递整个 `$attrs`。

> vue3 组件中的 `this` 和`$attrs` 都使用的是 Proxy 类型哦！不再是 `Object.defineProperties` 了。

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

多个根组件还有个特殊情况

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

### Provide / Inject

这两个东西类似 react 中的上下文 Context，父组件可以使用 Provide 提供数据，子组件中可以使用 Inject 来注入数据。

[官方文档](https://v3.cn.vuejs.org/guide/component-provide-inject.html)在 vue 传统使用中对这个功能介绍很少，而且使用很变扭。

官方更推荐在[响应式计算和侦听](https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#%E8%AE%A1%E7%AE%97%E5%80%BC)和[组合式 API 部分](https://v3.cn.vuejs.org/guide/composition-api-provide-inject.html#%E5%93%8D%E5%BA%94%E6%80%A7)学习。

我在传统模式中使用了下，甚至有些意外的行为。而且传统模式下使用也很局限，还不如 vuex 方便。

### 异步组件

和 vue2 其实差别不大，不过现在的异步组件使用 `defineAsyncComponent` 来定义，比如：

```js
import { createApp, defineAsyncComponent } from "vue";

createApp({
  // ...
  components: {
    AsyncComponent: defineAsyncComponent(() => import("./components/AsyncComponent.vue")),
  },
});
```

另外特别重要的一点是，未来将推出 `Suspense` 功能，这个东西可以用来处理异步组件未加载完成时默认展示的内容，不过就是一个烟雾弹，看这里 [Suspense](#Suspense)

### Suspense

这是一个实验性的功能，是拿来处理异步组件的。

react 的 concurrent 模式也是早就提出，一直没有落实下来，本来说 2020 年底推出，结果特么的现在都 2021 年 11 月了，还没推出。

vue3 的 Suspense 就是和 react 的 concurrent 差不多一个东西。

Suspense 就是用来处理异步组件的，不过看目前的进度，vue3 要等到 react 推出了 concurrent 模式，观摩之后再推出 Supense 吧。

## 组合式 API

现在每个组件都增加了一个叫 `setup` 的函数属性。

**`setup` 会在组件未创建前执行，在 `setup` 内部，`data`、`computed`、`methods`、`refs` 都不可以使用。**

### 返回一个对象

`setup` 可以返回一个对象，对象内部的属性都可以在 `template` 中使用。

示例：

```html
<template>
  <div>
    <!-- 使用 setup return 对象的 count 属性 -->
    {{ count }}
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    setup() {
      // return 一个对象，其值可以在模板中使用
      return { count: 1 };
    },
  });
</script>
```

**默认情况下，`setup` 中的数据不是响应式的**，比如：

```ts
export default defineComponent({
  setup() {
    let count = 0;
    setInterval(() => count++, 1000);
    return { count };
  },
});
```

上面的代码中，在模板中使用 `count` 并不会更新。

### 返回渲染函数

`setup` 函数还可以返回一个渲染函数，如果使用 `.vue` 文件，那么在使用渲染函数的情况下，template 会失效，

渲染函数示例：

```js
import { h, defineComponent } from "vue";

export default defineComponent({
  setup() {
    return () => h("div", {}, ["翻译翻译，什么叫惊喜？"]);
  },
});
```

你还可以使用 vue 官方提供的 [jsx](https://github.com/vuejs/jsx-next/blob/dev/packages/babel-plugin-jsx/README-zh_CN.md) ：

```tsx
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return () => <div>翻译翻译，什么叫惊喜？</div>;
  },
});
```

啊这，好像很牛逼的样子。而且而且而且，在 vue3 中使用 jsx 还能使用 css scoped。这在 vue2 都没实现。

```html
<script lang="tsx">
  import { defineComponent } from "vue";

  export default defineComponent({
    setup(props, context) {
      return () => <div class="root">翻译翻译，什么叫惊喜？</div>;
    },
  });
</script>
<style lang="sass" scoped>
  .root
    background: red
    color: white
</style>
```

> 不过我还是希望开放 jss，如果 [emotion](https://emotion.sh/docs/introduction)、[styled-components](https://styled-components.com/)、[mui](https://mui.com/) 能够来 vue3 大显身手，岂不美哉。

### setup 参数

`setup` 函数接收两个参数 `props` 和 `context`

- `props`：一个 Proxy 对象，内容是组件的 prop 所有值，**不能直接解构**，需要借助 `toRef` 或者 `toRefs`。

- `context`：一个普通对象，内容是组件上下文需要用到数据或函数，含有四个东西：

  - `context.attrs`：等同于 `$attrs`，**Proxy 类型，不要解构使用。**
  - `context.slots`：等同于 `$slots`，**Proxy 类型，不要解构使用。**
  - `context.emit`：等同于 `$emit`
  - `context.expose`：**暴露**公共 property 函数

  因为 `context` 不是 Proxy 对象，所以不是响应式的，可以直接解构。

> `attrs` 和 `slots` 是有状态的对象，它们总是会随组件本身的更新而更新。这意味着你应该避免对它们进行解构，并始终以 `attrs.x` 或 `slots.x` 的方式引用 property。请注意，与 `props` 不同，`attrs` 和 `slots` 的 property 是非响应式的。如果你打算根据 `attrs` 或 `slots` 的更改应用副作用，那么应该在 `onBeforeUpdate` 生命周期钩子中执行此操作。

#### context.expose

`expose` 可以暴露一些公共方法到实例当中。使用 `expose`

例如封装了一个音频播放器组件，父组件希望通过组件实例来执行一个 `play` 方法，让播放器开始播放。此时就可以用到 `expose`。

使用如：

```ts
export default {
  expose: ["play"],
  setup(props, { expose }) {
    //...

    expose({
      play() {
        console.log("音频开始播放！");
        // ...
      },
    });

    //...
  },
};
```

现在父组件就可以通过 `$refs.refName.play()` 来执行子组件通过 `expose` 暴露的函数了。

### ref

### reactive

### toRefs

### toRef

### watchEffect

[watchEffect](https://v3.cn.vuejs.org/api/computed-watch-api.html#watcheffect) 叫做监听器，和 react 的 _useEffect_ 类似，但是不需要传入依赖项。

`watchEffect` 接收一个**副作用函数（后文称作 effect）** 和一个配置项（后文称作 _options_），返回一个**停止器函数（后文称作 stoper）**。`watchEffect` 会立即执行一次接收到的 effect。

- **effect**：`watchEffect` 会追踪 effect 内部的响应值作为 _依赖项_，当依赖项更新时，effect 会**异步**再次执行，默认情况下再次执行总是在生命周期 update 前。

- **options**

  - **options.flush**

    - 默认值为 `"pre"` ，effect 会在更新前执行，effect 第一次会在立即执行。
    - 当值设置为 `"post"` 时，effect 会在更新后执行，effect 第一次会在组件挂载后在执行。
    - 当值设置为 `"sync"` 时，effect 的**更新会在强制同步执行**，这很低效并不推荐。

    > 从 Vue 3.2.0 开始，watchPostEffect 和 watchSyncEffect 别名也可以用来让代码意图更加明显。---官网
    >
    > 话说 watchPostEffect 和 watchSyncEffect 很混淆好吧，还不如使用配置。---小编

  - options.onTrack & options.onTrigger：用来调试的，作用不大。

- **stoper**：执行后 stoper 后会停止监听器，停止后 effect 不会因为依赖改变再次执行。

```js
const count = ref(0);

const stoper = watchEffect(() => console.log(count.value));
// 依次打印 0 ,1 ,2 ,3

const tiemr = setInterval(() => {
  count.value++;

  // 值为 4 时停止
  if (count.value > 3) {
    stoper();
    clearInterval(tiemr);
  }
}, 100);
```

> 有时你需要在监听器失效时做一些处理，就像 react 的 useEffect 返回值一样功能，那么可以使用 [onInvalidate](#onInvalidate)。

### 组合式 API 中的 Provide / Inject

在组合式 API 中使用 Provide / Inject 和 react 中的 Context 差不多，使用如下：

```js
// 父组件
import { defineComponent, provide, ref } from "vue";
import Test from "./Test.vue";

export default defineComponent({
  name: "HelloWorld",
  components: { Test },
  setup() {
    const count = ref(0);
    const changeCount = (v) => (count.value = v);

    provide("countContext", { count, changeCount });
  },
});
```

```jsx
// 子组件
import { defineComponent, inject, useCssModule } from "vue";

export default defineComponent({
  setup(props, { emit }) {
    const { count, changeCount } = inject("countContext" /* 可选默认值 */);

    return () => <div onClick={() => changeCount(count.value + 1)}>this is count :{count.value}</div>;
  },
});
```

### onInvalidate

[onInvalidate](https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#%E6%B8%85%E9%99%A4%E5%89%AF%E4%BD%9C%E7%94%A8) 用来设置监听器失效时的回调，需要把它写在 `watchEffect` 的副作用函数 effect 中。

`onInvalidate` 的失效有两种情况：

- **副作用即将重新执行时**

- **侦听器被停止 (如果在 setup() 或生命周期钩子函数中使用了 watchEffect，则在组件卸载时)**

示例：

```js
watchEffect((onInvalidate) => {
  const timer = setTimeout(fn, 3000);

  onInvalidate(() => {
    clearTimeout(timer);
  });
});
```

类似上面代码一样，使用 `onInvalidate` 可以在组件失效时，把一些过时的副作用清理掉。

### watch

同 vue2 中的 watch 一样的功能，vue2 我就没咋用过这东西，[详见官网](https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#watch)

### 生命周期钩子

在组合式 API 中可以使用部分生命周期钩子。因为 `setup` 没有 `this`，所以这些钩子被封装在了全局上，并且其对应的名字如下：

| 选项式 API      | Hook inside setup |
| --------------- | ----------------- |
| beforeCreate    | Not needed\*      |
| created         | Not needed\*      |
| beforeMount     | onBeforeMount     |
| mounted         | onMounted         |
| beforeUpdate    | onBeforeUpdate    |
| updated         | onUpdated         |
| beforeUnmount   | onBeforeUnmount   |
| unmounted       | onUnmounted       |
| errorCaptured   | onErrorCaptured   |
| renderTracked   | onRenderTracked   |
| renderTriggered | onRenderTriggered |
| activated       | onActivated       |
| deactivated     | onDeactivated     |

你可以通过下面方式调用：

```js
import { defineComponent, onMounted, onBeforeMount } from "vue";

export default defineComponent({
  setup() {
    onMounted(() => console.log("组件挂载后"));
    onBeforeMount(() => console.log("组件挂载前"));
  },
});
```

### 模板引用

[在组合式 API 中获取元素或组件实例](https://v3.cn.vuejs.org/guide/composition-api-template-refs.html#%E6%A8%A1%E6%9D%BF%E5%BC%95%E7%94%A8)

### 其他组合式 API

东西太多了，[看这里](https://v3.cn.vuejs.org/api/basic-reactivity.html#%E5%93%8D%E5%BA%94%E6%80%A7%E5%9F%BA%E7%A1%80-api)。

## 新增 Teleport，指定渲染位置

类似 react 的 Portals 功能，详见[官网](https://v3.cn.vuejs.org/guide/teleport.html)。

## 全局 API

vue3 提供了很多新的全局 API，[官网](https://v3.cn.vuejs.org/api/global-api.html#%E5%85%A8%E5%B1%80-api)

## 单文件组件

[参考](https://v3.cn.vuejs.org/api/sfc-spec.html#%E4%BB%8B%E7%BB%8D)

## FAQ

### vue3 中实现透传

参见 [移除 \$listeners](#移除%20$listeners)
