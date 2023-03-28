---
title: overflow clip 和 hidden 的不同
createAt: 2023-03-27
slug: /docs/notes/overflow clip 和 hidden 的不同
publish: false
tags:
  - overflow
  - clip
  - hidden
archives:
  - 博客
---

编写中

clip 不会生成滚动容器，会直接剪裁溢出。因为不会生成滚动容器，不能进行滚动，同时粘性布局也不会参考该元素。

## 参考

- [CSS Overflow Module Level 3][1]

[1]: https://w3c.github.io/csswg-drafts/css-overflow-3/#valdef-overflow-clip
