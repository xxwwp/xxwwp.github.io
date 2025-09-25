---
id: 132bb760-2e4c-4f22-a391-537e82ba3470
title: "typescript 装饰器"
slug: /docs/typescript 装饰器
createAt: 2023-07-25
publish: true
obsolete: false
tags:
  - typescript
  - 装饰器
  - decorator
archives:
  - 笔记
---

本文参考 [后盾人编程][1]。

## 开启装饰器功能

需要开启 tsconfig 下面两项：

```json
  "experimentalDecorators": true /* Enable experimental support for legacy experimental decorators. */,
  "emitDecoratorMetadata": true /* Emit design-type metadata for decorated declarations in source files. */,
```

## 类装饰器

类装饰器的声明如下：

```ts
declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
```

也就是说一个 **类装饰器是一个函数，接收一个类作为 target 参数。如果返回值是一个类，那么使用这个类重新声明了之前的类。**

示例：

```ts
const FooDecorator: ClassDecorator = (target: Function) => {
  // 对某个方法进行重写
  target.prototype.say = () => {};
  // 添加某些方法或属性
  target.prototype.other = () => {};
};

@FooDecorator
class Foo {
  say() {
    console.log("asdas");
  }
}

new Foo().say();
```

### 多个类装饰器

一个类可以作用多个装饰器，**类装饰的调用顺序和使用顺序相反**：

```ts
const FooDecorator1: ClassDecorator = (target: Function) => {
  console.log(1);
  // 因为 FooDecorator2 先被调用，所以可以执行 say 方法
  target.prototype.say();
};
const FooDecorator2: ClassDecorator = (target: Function) => {
  console.log(2);
  target.prototype.say = () => console.log("zzzzz");
};

@FooDecorator1
@FooDecorator2
class Foo {}

// 输出 2 1
```

## 装饰器无法提供声明

一个装饰器内修改了类，方法或者属性后并不能修改对应的声明，比如：

```ts
const SomeDecorator: ClassDecorator = (target: Function) => {
  target.prototype.title = "123123";
};

@SomeDecorator
class Foo {}

console.log(new Foo().title); // 此处虽然能访问 title，但是 ts 无法识别
```

## 装饰器工厂函数

可以封装装饰器为工厂函数，为每个装饰器提供独特的配置，比如：

```ts
const SomeDecorator =
  (title: string): ClassDecorator =>
  (target: Function) => {
    target.prototype.title = title;
  };

@SomeDecorator("Foo Class")
class Foo {}

@SomeDecorator("Bar123")
class Bar {}

console.log(new Foo().title); // Foo Class
console.log(new Bar().title); // Bar123
```

## 方法装饰器

方法装饰器的声明如下：

```ts
declare type MethodDecorator = <T>(
  /**
   * 如果是静态方法，那么 target 方法所在类的构造函数
   * 如果是普通方法，那么 target 方法所在类的 prototype，即实例的原型
   */
  target: Object,
  /** 方法的名称 */
  propertyKey: string | symbol,
  /** 方法的属性信息，值、是否可写、是否可枚举等 */
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;
```

泛型 T 表示某个方法的类型，一般情况下我们会使用 any，但是为了简便，一般会使用 `PropertyDescriptor` 代替 `TypedPropertyDescriptor<any>` 类型。

方法装饰器三个参数是：

- _target_：

  - 如果是静态方法，那么 target 方法所在类的构造函数

  - 如果是普通方法，那么 target 方法所在类的 prototype，即实例的原型

- _propertyKey_：方法的名称

- _descriptor_：方法的属性信息，值 value 、是否可写 writable、是否可枚举 enumerable、是否可配置 configurable，可以通过该参数重写这些值修改方法或方法的属性。

### 方法装饰器的执行顺序

同类装饰器，方法装饰器的执行属性和调用顺序相反。

用例：

```ts
const SomeDecorator1: MethodDecorator = () => console.log(1);
const SomeDecorator2: MethodDecorator = () => console.log(2);

class Foo {
  @SomeDecorator1
  @SomeDecorator2
  say() {}
}

// 输出 2 1
```

上述代码中，会打印出 `2 1`。

### 登录和权限的方法装饰器用例

以下代码定义了 user 对象存当前会话用户的基本信息，然后通过编写装饰器实现对某个方法的登录验证和权限验证。需要注意的是，我们在两个装饰器中都重写了方法，并且有处理权限时使用的是装饰器工厂函数。

```ts
const user = {
  isLogin: true,
  permissions: ["todo", "set"],
};

// 权限验证装饰器
const PowerDecorator =
  (power: string[]): MethodDecorator =>
  (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    // 重写函数
    descriptor.value = (...args: any) => {
      if (user.permissions.every((item) => power.includes(item))) {
        return method(...args);
      } else {
        throw new Error("权限不足");
      }
    };
  };

// 登录验证装饰器
const LoginDecorator: MethodDecorator = (
  target: Object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) => {
  const method = descriptor.value;
  // 重写函数
  descriptor.value = (...args: any) => {
    if (user.isLogin) {
      return method(...args);
    } else {
      throw new Error("登录失败");
    }
  };
};

class Foo {
  @LoginDecorator
  @PowerDecorator(["todo"])
  getData() {
    console.log("something");
  }
}
```

## 属性装饰器和参数装饰器

属性装饰器用来装饰一个类的属性，声明如下：

```ts
// 属性装饰器
declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
// 参数装饰器
declare type ParameterDecorator = (
  target: Object,
  propertyKey: string | symbol | undefined,
  parameterIndex: number
) => void;
```

参数装饰器的参数比属性装饰器多一个，但是他们前面的参数都是相同的：

- **target**：

  - 如果是静态属性或方法，那么 target 方法所在类的构造函数

  - 如果是普通属性或方法，那么 target 方法所在类的 prototype，即实例的原型

- **propertyKey**：属性的名称，如果是参数装饰器则是该参数所在方法的名称

- **parameterIndex**：是方法的第几个参数，从 0 开始计数。

属性装饰器的应用比较少。参数装饰器可以让我们进行数据验证。

## 元数据

单独的参数装饰器很难起到什么作用，所以需要借助元数据编程。这里使用到了库 [reflect-metadata][2]。

安装：

```shell
npm install reflect-metadata
```

使用：

```ts
import "reflect-metadata";
```

这将强化全局对象 Reflect，以提供一些元数据编程 api。

## 基于元数据为参数编写验证器

以下是一个根据参数装饰器和方法装饰器联合得到的参数格式验证器，这里只是实现了简单的长度判断。

首先我们需要实现参数长度验证的装饰器工厂函数，装饰器对每个参数的限制写入到方法的元数据中，在执行时获取该方法的相关元数据，然后依次判断参数是否符合验证规则。

```ts
import "reflect-metadata";

/** 字符串最大最小长度验证元数据 */
interface DMinMax {
  min: number;
  max: number;
  index: number;
}

/** 限制参数长短的装饰器工厂函数 */
const LimitDecorator =
  (min: number, max: number): ParameterDecorator =>
  (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    // 获取元数据
    const vMinMax: DMinMax[] = Reflect.getMetadata("vMinMax", target, propertyKey!) || [];
    // 填充当前参数到元数据
    vMinMax.push({ min, max, index: parameterIndex });
    // 设置新的元数据
    Reflect.defineMetadata("vMinMax", vMinMax, target, propertyKey!);
  };

const ValidateDecorator: MethodDecorator = (
  target: Object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) => {
  // 获取参数的元数据
  const vMinMax: DMinMax[] = Reflect.getMetadata("vMinMax", target, propertyKey).reverse() || [];
  const method = descriptor.value;

  descriptor.value = (...args: any[]) => {
    // 根据参数元数据验证参数是否满足长度规则
    for (let i = 0; i < vMinMax.length; i++) {
      const { index, min, max } = vMinMax[i];
      const param = args[index];

      if (param.length < min || param.length > max) {
        throw new Error(`${propertyKey.toString()} 第 ${index + 1} 个参数不合法，不在 ${min} 到 ${max} 期间之内`);
      }
    }

    return method(...args);
  };
};

class Foo {
  @ValidateDecorator
  print(@LimitDecorator(0, 10) name: string, @LimitDecorator(3, 5) title: string) {
    console.log({ name, title });
  }
}

new Foo().print("asdklj", "cj"); // Error: print 第 2 个参数不合法，不在 3 到 5 期间之内
```

## 参考

- [后盾人编程][1]
- [reflect-metadata][2]

[1]: https://www.bilibili.com/video/BV1WR4y1J7Lc/?vd_source=6f218c0860d87e56ee0649a751222f54
[2]: https://rbuckton.github.io/reflect-metadata/
