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

## 序

本笔记记录我的 docker 学习记录，参考教材来源于 [docker 中文网教程][4] 和 [docker | 菜鸟教程][5]。

其中，[docker | 菜鸟教程][5] 的文章更工具化和短篇，可以快速查询知识点。而 [docker 中文网教程][4] 更加完整，毕竟是官网中译，可以查询更多的 api，但是也更加碎片化。

## 导入导出镜像

windows：

```shell
#To export:
docker container export <container_id> -o <image_name>.tar
#To import
docker image import <image_name>.tar <custom_image_name>
```

linux/mac 可以使用 `>` 代替 `-o`，这源于 windows 的 bug，参见 [issuse 600][2] 和 [stackoverflow][3]：

```bash
#To export:
docker container export <container_id> > <image_name>.tar
#To import
docker image import <image_name>.tar <custom_image_name>
```

加载和保存镜像：

## 常用核心命令

docker 所有命令都可以使用 `--help` 来查看命令含义。例如：

```shell
docker --help
docker run --help
docker ps --help
```

命令的查询有三个位置，[菜鸟教程][1-1]、[docker 官网中译命令][4-1]、[docker 官网][6]

### run

**[`docker run`](https://docs.docker.com/engine/reference/commandline/run/) 命令指定一个镜像创建新容器并执行命令。**，注意是新容器，多次指定同一个镜像创建的容器互不干扰。

例如根据 ubuntu 镜像创建一个容器，然后在里面启动一个 python 服务器。

参考这里：[Docker run reference](https://docs.docker.com/engine/reference/run/)

### build

**[`docker build`](https://docs.docker.com/engine/reference/commandline/build/) 命令指定一个 [Dockfile](https://docs.docker.com/engine/reference/builder/) 文件构建镜像**。在 Dockerfile 文件中，可以为构建镜像做很多准备工作。

docker 生成镜像的方式有很多，最直观的就是自己拉取一个镜像生成容器，然后进行相关的环境搭建后，把更新后容器导出为镜像，或者根据修改创建新的镜像。但是这种方式并不能对多端代码进行整合，各段代码都不是那么独立。这种方式适用于对外提供镜像服务，而非业务逻辑代码的分离。

相反 Dockerfile 仅仅是一个小文件，相比镜像的大小，它完全可以放到代码中进行整合。比如隔离端与端之间的运行环境，前端后端算法都可以在自己的代码中嵌入 Dockerfile 文件，每个端根据 Dockerfile 生成相应的容器，被隔离在各自配置的熟悉的环境中互不干扰且能保持通信。

## bugs

- executor failed running [/bin/sh -c something]: exit code: 139

  这个 bug 是我在 windows 上出现的，docker 安装的时候需要安装 wsl 支持虚拟机服务，但是 wsl 对于一些老的系统构建会出现问题。在我使用命令 `docker build -t runoob/centos:6.7 .` 构建 centos:6.7 版本的时候，出现这个 bug 反馈。

  解决：

  [参考链接][b1]，这个问题在多个 Github 上出现过，真的坑。

需要创建 `%userprofile%\.wslconfig` 文件并写入以下代码后 **重启 wsl 服务**：

```
[wsl2]
kernelCommandLine = vsyscall=emulate
```

**一定要记住需要重启 wsl，我是直接重启电脑。**

用处是什么我也不知道，`%userprofile%` 就是用户目录，一般在 `C:\Users\<username>`，视当前用户名查看。

## 引用

- [镜像源][1]
- [docker 中文网教程][4]
- [docker | 菜鸟教程][5]

- [bug: Docker fails to build image with exit code 139.( docker build 的时候，使用的系统过老，导致和 wsl 不兼容)][b1]

[1]: https://www.runoob.com/docker/docker-mirror-acceleration.html
[1-1]: https://www.runoob.com/docker/docker-command-manual.html
[2]: https://github.com/docker/for-win/issues/660
[3]: https://stackoverflow.com/questions/40622162/docker-load-and-save-archive-tar-invalid-tar-header
[4]: https://dockerdocs.cn/get-started/overview/index.html
[4-1]: https://dockerdocs.cn/engine/reference/run/
[5]: https://www.runoob.com/docker/docker-tutorial.html
[6]: https://docs.docker.com/engine/reference/run/
[b1]: https://stackoverflow.com/questions/65429435/docker-fails-to-build-image-with-exit-code-139
