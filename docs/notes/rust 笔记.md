---
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

## 基础概念

### 变量可变性

> 常量声明使用 `const`

**变量声明使用 `let`，rust 中，变量默认是不可变的**。let 声明的变量不可以重新赋值，但是可以再次声明，例如下面的式子是就是合法的：

```rs
let a = 1;
let a = a + 1;
```

可以使用 `mut` 关键字标记变量可变，比如：

```rs
let mut a = 1;
a = a + 1;
```

## 引用

- [镜像源][1]
- [镜像源 2][2]
- [The Rust Programming Language][3]
- [Rust 程序设计语言][4]

[1]: https://www.runoob.com/docker/docker-mirror-acceleration.html
[2]: https://cloud.tencent.com/developer/article/1620144?from=article.detail.1489386
[3]: https://github.com/rust-lang/book
[4]: https://kaisery.github.io/trpl-zh-cn/title-page.html
