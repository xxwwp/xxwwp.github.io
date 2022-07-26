---
title: docker 笔记
slug: /docs/notes/docker 笔记
createAt: 2022-07-26
publish: false
tags:
  - docker
archives:
  - 笔记
desc:
---

## 导入导出镜像

windows：

```shell
#To export:
docker container export <container_id> -o <image_name>.tar
#To import
docker image import <image_name>.tar <custom_image_name>
```

linux/mac 可以使用 `>` 代替 `-o`，这源于 windows 的一个 [bug][2]：

```bash
#To export:
docker container export <container_id> > <image_name>.tar
#To import
docker image import <image_name>.tar <custom_image_name>
```

加载和保存镜像：

## 引用

- [镜像源][1]

[1]: https://www.runoob.com/docker/docker-mirror-acceleration.html
[2]: https://github.com/docker/for-win/issues/660
[3]: https://stackoverflow.com/questions/40622162/docker-load-and-save-archive-tar-invalid-tar-header
