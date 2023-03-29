---
id: 70c6668b-71a5-4dfd-b5ec-259c6012a7d3
title: rust 笔记
slug: /docs/notes/rust 笔记
createAt: 2022-07-26
publish: false
tags:
  - rust
  - cargo
archives:
  - 笔记
desc:
---

## 序

本文为我学习 rust 时的笔记，参考的教材为 [The Rust Programming Language][3] 的译本 [Rust 程序设计语言][4]。

本文不会记录所有教材内容，只对针对性知识进行记录。

## 镜像源

rust 的库安装如果不配置源会非常慢，基本上起步就陷死。参考以下链接：

- [镜像源][1]
- [镜像源 2][2]

## cargo

cargo 是 rust 的一个服务工具，主要功能是包管理和，构建 rust 程序。

cargo 跟随 rust 一起安装，使用以下命令查看 cargo 版本号：

```shell
cargo --version
```

一个 rust 的 hello world 程序可以使用 cargo 轻松创建：

```shell
cargo new appname
```

这会创建一个 appname 文件夹，里面初始化了一个 rust 应用。

> rust 程序可以单独创建，并使用 `rustc` 命令对其进行编译打包，这将生成可供系统使用的执行文件。但是一个单独的 rust 文件，没有有效的库标识，编译缓存等，只适合极小的脚本使用。
>
> 使用 cargo 可以对 rust 的库进行依赖，有效缓存编译，提高开发速度，配合编辑器可以提供较好的语法检查。

## 零碎记录

### 留白处理

rust 代码对留白并不敏感，任意数量的留白只要没有破坏语法结构，都不会影响程序执行。

**但需要注意的是，rust 官方强烈推荐使用 4 个空格来缩进。**

### 变量属性名任意

变量和属性的名字不能是一些特殊字符，如 `!@#$%^&*()=+-.>/?;:` 等，也不可以使用数字开头。但只要是不影响编译的其他任意字符都可以，比如中文也行。

### 栈数据

- 标量类型

  - 整型

    整型在计算时仅保留整数位，不会四舍五入。整型包含很多基础类型，无符号有符号，

  - 浮点型

  - 布尔型

  - 字符类型

    rust 字符类型很特殊，使用一个 4 字节的空间存储，代表一个 Unicode 标量值。所以 Unicode 字符集里面的表情，汉字，等特殊字符在 rust 中都可以使用字符类型表示，并不是局限于 ASCLL 码。

- 复合类型

  - 元组

    元组描述了一组固定的数据结构，使用圆括号 `()` 来包裹，访问符为 `.`。元组也可以使用圆括号进行解构，例如：

    ```rs
    let a: (i8, u32, u128) = (1, 20, 30);
    let (x, _y, _z) = a;

    println!("{},{}", a.1, x); // 20,1
    ```

  - 数组

    数组描述了多个 **相同的数据类型**，它的声明、访问、定义、解构都是用方括号 `[]`，例如：

    ```rs
    let a: [u32; 3] = [10, 20, 100];
    let [x, _y, _z] = a;

    println!("{},{}", a[1], x); // 20,10
    ```

    其中，`[u32; 3]` 表示这是一个 u32 数字共三项的数组。

标量类型和符合类型数据都会被分配到 **栈** 中，其余类型的数据则将分配到堆中，分配到堆中的类型遵守 [所有权规则](#所有权规则)。

> 基础类型中是不包含字符串的，尽管 rust 中可以使用字符串字面量，但是这些字面量是被硬编码到 rust 程序中，不可变。
>
> rust 提供 String 命名空间对字符串进行集中处理，不同于上述的类型，可变字符串被分配到堆中，访问的数独没有上述的基础类型块。

#### 字符串字面量

在 rust 中，可以使用双引号包裹一段字符作为字符串字面量，它们属于 `&str` 类型，这种类型的字符串指向一个固定的文件或内存，只读不可修改，不过可以复制。例如：

```rs
let s : &str = "hello";
let s2 : &str = s;
```

`&str` 类型也被称为 slice 类型，因为它们有可能指向一段可变字符串的某个区间或者编译后文件内的某段二进制代码，`&str` 类型是不可变的，它在内存中被放到栈上。

### 堆数据

- `String` 类型

  `String` 类型为不限制长度的字符串，不同于 `&str` 类型的是，它被存放在堆中。使用 `String::from` 来获取实例。

- 结构体

  描述一组固定的数据结构，可以是具名的键值对，也可以是匿名元组，这些数据被称为结构体的 **字段**，甚至没有数据。使用关键字 `struct` 声明。

  例如：

  ```rs
  struct Named {
      name: String,
      age: i16,
  }

  struct Anonymous(String, usize);

  struct Nothing;

  let name1 = Named {
      name: String::from("name1"),
      age: 19,
  };

  let anonymous1 = Anonymous(String::from("anonymous1"), 20);
  anonymous1.0;
  ```

  结构体访问数据的访问符均为一个小数点 `.`。

  结构体有点类似其他语言中的 `class` 类，结构体能够实现关联结构体数据的函数，使用 `impl` 关键字来指定需要实现的函数。这些关联结构体的函数被称作结构体的 **方法**。

  ```rs
  struct Anonmous(String);

  impl Anonmous {
      fn say(&self, param: &str) {
          println!("{}. {}", self.0, param);
      }
  }

  let foo = Anonmous(String::from("foo ID"));

  foo.say("123"); // foo ID. 123
  ```

  > `impl` 实现的关联函数中，第一个参数必定是 `self`，`&self` 是指向结构体数据的引用。

  > 当使用 `mut` 进行声明时，整个结构体与其内部结构都是可变的，而不是单指结构体本身，但是不能修改 `impl` 描述的方法。

- 枚举

  枚举类似结构体，使用 `enum` 关键字声明，主要用来描述同一类型下不同状态的数据。例如性别的男和女，ip 地址中的 ipv4 和 ipv6。枚举类型中描述不同状态的数据被称作 **成员**。不同于结构体的是，枚举不能通过元组的方式来匿名描述成员，成员必须是具名的。

  ```rs
  enum Sex {
    男,
    女
  }
  ```

  因为成员的状态可能是不同的，所以枚举可以描述成员的类型。例如：

  ```rs
  enum Message {
      Quit,
      Move { x: i32, y: i32 },
      Write(String),
      ChangeColor(i32, i32, i32),
  }

  let foo = Message::Move { x: 100, y: 100 };
  let bar = Message::ChangeColor(12, 21, 1221);
  let baz = Message::Quit;
  ```

  枚举成员的访问使用 `::`。

  枚举也可以声明关联数据的 **方法**，同结构体语法完全一致，使用 `impl` 声明，参考结构体。

- `Option<T>` 类型，空值类型

  `Option<T>` 被用来描述一个可选类型，他允许该类型为空值，它的本质是一个枚举。在原生中大致实现如下：

  ```rs
  enum Option<T> {
      None,
      Some(T),
  }
  ```

  `Option<T>` 的成员 `None` 与 `Some` 被暴露在全局，可以直接使用，不需要类似语法 `Option<i32>::Some(100)`。

  所以你可以按照如下方式直接访问：

  ```rs
  let a = Some(100);
  let b : Option<i32> = None;
  ```

  rust 中控制 `None` 实际上是内部一个枚举值而已，rust 没有其他语言意义中的的空值类型。

### 所有权规则

> 首先，让我们看一下所有权的规则。当我们通过举例说明时，请谨记这些规则：
>
> > 1. Rust 中的每一个值都有一个被称为其 **所有者**（owner）的变量。
> >
> > 1. 值在任一时刻有且只有一个所有者。
> >
> > 1. 当所有者（变量）离开作用域，这个值将被丢弃。

一般来说，被分配到堆中的数据都将满足所有权规则。一个堆数据只能被一个变量拥有，当把一个堆数据分配给其他变量时，之前的变量将丢失对这个堆数据的所有权，之前的变量将无法访问。

```rs
let s = String::from("string"); // s 获取一个 String 的所有权
println!("{}", s); // 访问 s 有效
let s2 = s; // String 数据所有权转移到 s2 ，s 丢失这个数据的所有权
println!("{}", s2); // 访问 s2 有效
println!("{}", s); // error，s 已经没有指向任何数据
```

**数据借用**

可以通过数据借用的方式，不剥夺原始变量对数据的所有权，类似于其他语言中的引用，使用 `&` 符号来声明借用一个变量或参数。

> 使用 `*` 号来使用被借用的数据，就类似 C 语言的指针一样。不过 rust 支持省略 `*` 号的使用就可以直接访问借用的数据。

```rs
let s = String::from("string");
let s2 = &s; // s 对数据的所有权没有转移 ，s2 借用了 s 变量
```

这种行为也被放在函数参数上，例如：

```rs
let s = String::from("string");
foo(&s);

fn foo(bar: &String) { /*...*/
}
```

如果不使用借用的方式，那么变量会在传递给函数的时候丢失所有权，函数执行结束即刻销毁。

### 表达式和代码块

rust 中使用除了特殊语句例如 `let`、`const` 声明，剩余的大部分语句都算作表达式。

一个最简单的表达式就是字面量，比如数字字面量或者字符串字面量。

rust 使用 `{}` 来包裹一段代码，这段代码被视作一个代码块。每个代码块都有自己的作用域，内部声明的数据外部无法访问，反之可以。每个代码块中，最后一行代码如果没有使用分号结尾，那么这行代码的表达式值将作为该代码块的值。所以说，一个代码块也是一个表达式。

例如下面的用例中，`a` 的值将变为 `3`：

```rs
let a = {
    1 + 10;
    let b = 2 * 5 - 2;
    1 + 2
};

println!("{}", a); // 3
```

代码块的概念被作用到除去声明的大部分地方，例如 `match` 语句 `if-else` 语句，函数语句。所以函数的返回值如果是在最后一行，是不需要写 `return` 语句的。

例如 `if-else` 语句就是表达式，所以 `if-else` 语句是可以赋值给变量的：

```rs
let a = if true { 1 } else { 2 };
```

### match

`match` 是 rust 用来辨别数据的一个语句，它提供对指定值的代码映射，有点类似其他语言中的 `switch`，但是和 `switch` 的表达方式并不一样。

例如：

```rs
let score = 0;

match score {
    0 => println!("恭喜得到零瓜蛋"),
    100 => println!("100 分满分啊"),
    other => println!("拿到了 {} 分", other),
}
```

非常显而易见，`match` 对 `score` 进行了匹配，特殊的情况是 0 和 100，剩余情况是 `other` 分支。上面的代码会匹配到 0 的情况。

`other` 并不是 `match` 语句的指定的名称，它是一个任意名称 **通配符**，放在 `match` 语句的最后，并且可以省略。没有匹配成功的时候，被匹配的数据会传递给通配符，在通配符的分支中可以对其进行访问。

`match` 语句还可以对枚举类型进行匹配。以下是一个官方的示例，对一个可选数字进行递增操作：

```rs
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}
```

> 如果使用枚举进行匹配，那么必须穷尽枚举的成员，不然不能通过编译。

`match` 语句返回的数据类型必须是相同的，不能返回多种数据类型。当没有返回时，通配符使用 `()` 表示没有返回，比如：

```rs
let foo = 1;

match foo {
    10 => println!("{}", foo),
    _ => (),
};
```

### if let 语法糖

`match` 通配符的空返回是比较无用的样板代码，可以使用 `if let` 来换一种编写方式。例如如下代码：

```rs
let config_max = Some(3u8);
match config_max {
    Some(max) => println!("The maximum is configured to be {}", max),
    _ => (),
}
```

其中 `_ => ()` 是毫无意义的，只是为了遵守 `match` 语句的穷尽规则，有的时候我们只是对 `match` 语句进行一个匹配而已，并且没有返回值。那么就可以使用 `if let` 语句来简写：

```rs
let config_max = Some(3u8);
if let Some(max) = config_max {
    println!("The maximum is configured to be {}", max);
}
```

上述代码与前一段代码的行为相同。

另外 `if let` 语句还支持增加一个 `else` 分支，例如：

```rs
let config_max = Some(3u8);
if let Some(max) = config_max {
    println!("The maximum is configured to be {}", max);
} else {
    println!("Nothing");
}
```

### 代码分离

#### 模块定义

rust 使用 `mod` 关键字来定义一个模块，使用 `pub` 关键字来公开模块内部的其他模块、函数或数据结构（结构体、枚举等），例如：

```rs
mod foo {
    mod bar {
        fn baz() {
            println!("do something")
        }
    }

    mod other_module {}

    pub struct User {
        pub name: String,
        age: u8,
    }
}
```

添加 `pub` 关键字的模块、数据或者函数都是对外进行公开的，外部可以直接访问。

> 结构体如果在模块内声明，那么内部属性将具有隐私性，需要单独设置私有或公有。创建一个含有私有属性的的结构体，只能在模块内部实现，因为外部模块无法访问私有属性。
>
> 当前作用域内访问结构体将忽略其属性隐私性。

#### 模块访问

模块访问的方式有两种：

- 绝对访问
- 相对访问

绝对访问：

当前环境下的被引用的模块都会被注册到 `crate` 中，`crate` 提供绝对路径来访问这些模块。

```rs
mod foo {
    pub mod bar {
        pub fn baz() {}
    }
}

fn main() {
    crate::foo::bar::baz()
}
```

相对访问：

rust 提供 `self` 和 `super` 关键字指向当前路径和上一级路径，仅在模块内部使用。`self` 和 `super` 类似文件路径的 `./` 和 `../`。`self` 是可以被省略的。

```rs
mod foo {
    pub mod bar {
        pub fn red() -> super::RGB {
            // `red` 函数属于 `foo::bar` 模块，`self` 关键字将指向此模块
            // 同上，`super` 关键字在此处指向 `foo` 模块
            // 下面代码等价于 crate::foo::red();
            super::RGB(0xff, 0, 0)
        }
    }

    pub struct RGB(u8, u8, u8);
}

fn main() {
    // 这也是一个相对访问，不过省略了 `self` 关键字。以下代码等价于 self::foo::bar::red();
    foo::bar::red();
}
```

`super` 关键字可以连续使用，比如通过 `super::super::super` 就可以向上移动三层模块嵌套。

> rust 内置全局数据、函数和宏不支持使用 `crate` 来访问，比如 `std`、`Option<T>`、`prinln!()` 等。

#### 路径引用

不论是相对访问还是绝对访问，都有可能因为模块层次问题导致路径过长，如果存在多次调用，样板代码会过多，这依赖于代码设计。使用模块引用可以减少样板代码。

**路径引用使用 `use` 和 `as` 关键字把另一个模块引入当前作用域。**

例如：

```rs
mod foo {
    pub mod bar {
        pub fn reds() -> super::RGB {
            super::RGB(0xff, 0, 0)
        }
    }
    pub struct RGB(u8, u8, u8);
}

fn main() {
    let arr = [
        foo::bar::reds(),
        foo::bar::reds(),
        foo::bar::reds(),
        foo::bar::reds(),
        foo::bar::reds(),
    ];
}
```

使用 `use` 关键字，上述代码可简化为：

```rs
mod foo {
    pub mod bar {
        // 这里把 super::RGB 引入当前作用域，后续直接使用 RGB 即可调用 super::RGB
        use super::RGB;
        pub fn reds() -> RGB {
            RGB(0xff, 0, 0)
        }
    }
    pub struct RGB(u8, u8, u8);
}

// 这里把 foo::bar::reds 引入当前作用域，后续直接使用 reds 即可调用 foo::bar::reds
use foo::bar::reds;
fn main() {
    let arr = [reds(), reds(), reds(), reds(), reds()];
}
```

这种方式减少了很多样板代码。

对于同一模块下的路径引用，可以使用使用花括号 `{}` 进行包裹：

```rs
use std::io::{stdin, stdout};
```

可以使用 `as` 关键字对路径引用的目标功能进行重命名：

```rs
use std::io as i;
use std::io::{stdin as sin, stdout as sout};
```

也可以使用 `self` 对模块本身进行引用：

```rs
use std::io::{self as io, stdin as sin, stdout as sout};
```

还可以使用 glob 运算符 `*` 引入模块下所有功能：

```rs
use std::collections::*;
```

#### 文件分离

在 `.rs` 文件中，使用 `pub` 关键字对功能、模块或路径引用等都可以进行导出。

新建一个文件，名字如 `src/my_module.rs`。内容如下：

```rs
pub mod foo {
    pub mod bar {
        use super::RGB;
        pub fn reds() -> RGB {
            RGB(0xff, 0, 0)
        }
    }
    pub struct RGB(u8, u8, u8);
}

pub use foo::*;

pub struct User {
    pub name: String,
}

pub fn my_method() {}
```

上述中，在顶级使用 `pub` 关键字可以导出当前文件的内容。

我们可以在 `src/main.rs` 中使用 `mod` 关键字对文件 `src/my_module.rs` 进行调用，它的整个文件被视作一个模块：

```rs
// 调用 `my_module.ts` 文件，文件名即模块名，视作模块 my_module
mod my_module;

// 对模块内容进行路径引用
use my_module::bar;
use my_module::my_method;
use my_module::User;

fn main() {
    bar::reds();
    User {
        name: String::from("joker"),
    };
    my_method();
}
```

> 关于文件夹
>
> rust 无法直接感知文件夹内的模块，例如创建一个文件夹为 `src/utils/`，那么就必须创建一个 `src/utils.rs` 文件来对其进行管理。在 `src/utils.rs` 中，可以使用 `mod` 来导入同名文件夹下的其他模块。

### 常见集合

- `Vec` 类型。用来描述类似数组的结构。

- `String` 类型。用来描述字符串结构。

- `std::collections::HashMap` 类型。用来描述哈希表。

### ? 运算符

rust 中的 `?` 运算符用来处理 `Option<T>` 和 `Result<T,E>` 类型。

可以再在 `Option<T>` 和 `Result<T,E>` 类型的表达式后面添加 `?` 来修饰这个表达式：

- `Option<T>?`

  - 如果返回一个 `Some(data)`，`?` 修饰后会直接得到 `data` 数据
  - 如果返回一个 `None`，`?` 修饰后会直接执行 `return None` 停止当前函数

- `Result<T,E>?`

  - 如果返回一个 `Ok(data)`，`?` 修饰后会直接得到 `data` 数据
  - 如果返回一个 `Err(error)`，`?` 修饰后会直接执行 `return Err(error)` 停止当前函数

因为 `?` 修饰会主动返回数据，所以它关联当前函数的返回值类型。因为类型兼容性原因，不同错误的 `Result` 如果处在同一个函数中，那么不能同时对两个 `Result` 使用 `?` 修饰符，因为返回值不能同时兼容两种错误类型。

### panic! 宏

`panic!` 宏用来主动抛出一个不可恢复的错误，就类似声明一个数组 `[u32; 5]` 的数组访问其 100 的索引一样，因为越界，程序会直接停止，并打印执行栈等一系列错误信息。

使用如：

```rs
use core::panic;

fn main() {
    panic!("抛出错误错误");
}
```

> 这在程序无法进行时，很有用，比如一个编写一个 json 文件解析器，但是启动时不指定 json 文件位置，那么程序就无法进行下去，此时就可以使用 `panic` 抛出错误。

> 在测试场景中，`panic` 也非常适用。

## 引用

- [镜像源][1]
- [镜像源 2][2]
- [The Rust Programming Language][3]
- [Rust 程序设计语言][4]

[1]: https://www.runoob.com/docker/docker-mirror-acceleration.html
[2]: https://cloud.tencent.com/developer/article/1620144?from=article.detail.1489386
[3]: https://github.com/rust-lang/book
[4]: https://kaisery.github.io/trpl-zh-cn/title-page.html
