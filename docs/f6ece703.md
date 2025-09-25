---
id: f6ece703-7482-4e74-8f34-b88a161538ff
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

本笔记记录我的 docker 学习记录，参考教材来源于 [docker 教程][4] 和 [docker | 菜鸟教程][5]。

其中，[docker | 菜鸟教程][5] 的文章更工具化和短篇，可以快速查询知识点。而 [docker 教程][4] 更加完整，毕竟是官网中译，可以查询更多的 api，但是也更加碎片化。

学习关键使用 windows 10 系统，安装参考 docker 官网推荐方式。

## 安装

docker 运行在 linux 系统中，所以默认情况下，docker 是不能在 windows 系统中使用的。在 windows 中安装 docker 需要安装官方的桌面工具 **Docker Desktop**，**并且安装 WSL 2 支持 linux 虚拟机启动**，不然 docker 就无法正常工作。

> 菜鸟教程上，使用 Hyper-V 来支持虚拟机，没有使用 Docker 官方的 WSL。我安装的是 WSL，有一些 bug，参见 [bugs](#bugs)。

要测试 docker 是否已经安装好，可以尝试命令：

```shell
docker --version
```

安装并不是非常麻烦，但是我使用 docker 的时候非常慢，下载一些包直接半小时起步，所以需要镜像加持。[菜鸟教程 | Docker 镜像加速][1] 一节介绍了如何更换到国内镜像。

在 [docker 门户快速开始][b2] 和 [docker 文档][b3] 都有下载地址。如果不是 windows 系统，安装会非常简单，不赘述。

**如果是 windows 系统，需要前置安装 wsl 以支持 linux 虚拟机。[wsl][6] 文档在此。**

windows 下安装 wsl 不是很复杂，打开 powershell，执行下面命令：

```
wsl --install
```

如果控制台返回如下信息，那么就安装成功了：

```shell
正在安装: 虚拟机平台
已安装 虚拟机平台。
正在安装: 适用于 Linux 的 Windows 子系统
已安装 适用于 Linux 的 Windows 子系统。
正在安装: 适用于 Linux 的 Windows 子系统
已安装 适用于 Linux 的 Windows 子系统。
正在安装: Ubuntu
已安装 Ubuntu。
请求的操作成功。直到重新启动系统前更改将不会生效。
PS C:\Users\xxx> wsl --version
WSL 版本： 2.1.5.0
内核版本： 5.15.146.1-2
WSLg 版本： 1.0.60
MSRDC 版本： 1.2.5105
Direct3D 版本： 1.611.1-81528511
DXCore 版本： 10.0.25131.1002-220531-1700.rs-onecore-base2-hyp
Windows 版本： 10.0.19045.4412
```

记住需要重启系统。

## 概念

哲学三问：docker 是什么？用在哪儿？能干啥？

docker 是什么？

docker 可以被理解为一个虚拟机管理器。**docker 指定的一个环境包来构建一个虚拟机。** 例如使用 ubuntu 的包来构建一个 ubuntu 的虚拟机环境。同时用户可以配置这个虚拟机到一个指定环境，比如 lamp，nodejs，rust，ruby 等等。因为是虚拟机，所以回滚、重做等操作的成本极低，同时安全性扫描等都可以在本机直接进行。

**docker 把指定的环境包称作 image（镜像或图像），根据 image 构建的虚拟机被称作 container （容器）。** 大白话就是，镜像其实就是指某个配置好的系统安装包，例如 ubuntu，centos，这个安装包还可以预先进行配置，例如配置 lamp 或 nodejs 等基础应用后，再进行打包，docker 可以为这些镜像生成独立的虚拟机运行。而容器其实就是根据系统镜像创建的虚拟机而已。说爆了，docker 就类似一个虚拟机管理器。

**因为容器是虚拟机，所以 docker 为容器之间的通讯建立了 network （网络）**，docker 网络并不难，并不是需要网络工程师的水平才能使用，就类似打开你家的 Wifi 局域网管理而已。

docker 用在哪儿？

docker 肯定不是用来创建虚拟机进行测试或者学习的，当然也可以这么做，但是就太大材小用了。同其他虚拟机管理工具不同，docker 主要作用于生产环境而非开发环境，docker 使用命令行完成了虚拟机管理的一系列操作，例如镜像的增删改查、发布或拉取等，还有容器的增删改查、重启或暂停等等。可以轻松的使用几行甚至一行命令就创建一个虚拟机，因为是虚拟机，在里面进行的所有环境搭建和部署都不会污染到服务器本身。

docker 能干啥？

docker 为应用创建了独立可视化的环境，随着代码和架构像滚雪球一样滚大的时候，底层环境也会随之变化，不少的情况下是为了填坑。比如引入了某个库，依赖要求的版本太高，不得不升级，升级带来的 bug，不得不打补丁，但是这些操作很有可能都是遗留性问题，也就是说可以通过更换系统架构来消除，但是因为服务器上构建的应用各不相同，前端、后端、数据库、安全等等全部都挤到一起，很难确定更新的潜在隐患，也很难得到一套完善的处理方案。

这个时候 docker 站了出来，docker 可以为各个应用分配虚拟环境，互不干扰。

docker 还为环境的更新部署查询等做出了完善的支持，让开发者对所处的环境一目了然。

### 容器

docker 根据指定的镜像可以构建一个容器，每个容器都是一个独立的虚拟机环境。

创建一个容器：

```shell
docker run ubuntu:15.10
```

此时你会发现什么都没发生，不过可以使用以下命令查看容器状态：

> 上面命令中，`ubuntu:15.10` 就是一个镜像，如果本地存在此镜像，docker 会直接用来创建一个容器，如果没有，docker 就会从网络镜像仓库中获取此镜像。

```shell
docker ps --all
```

此时会看到一个 ubuntu 容器处于退出状态，这就是刚才创建的容器。很不幸，这个容器已经关死了，因为没有启动项，也没有把它保持挂起，docker 启动容器后立马就会关闭。

现在我们需要让 docker 为此虚拟机分配一个终端给我们，可以在 `run` 后使用 `--tty` 参数让 docker 分配一个虚拟机的终端。命令将变成：

```shell
docker run --tty ubuntu:15.10
```

但是此时我们还是不能访问这个容器，因为 docker 只是分配了一个终端给用户，docker 在命令执行结束后并不会关心后续的输入和指令，所以增加还要增加一个 `--interactive` 命令保持标准输入，这样才能和容器的终端交互。

> `--interactive` 也是有另一个功能就是 **保持挂起**，就算不使用 `--tty`，容器也不会立即停止，而是卡着。

保持输入并分配终端：

```shell
docker run --tty --interactive ubuntu:15.10
```

如果此时执行 `exit`，那么容器就会关闭，我想没人会希望挂起一个终端来开发，所以此时我们需要使用 `--detach` 来把容器放到后台运行，`--detach` 会以分离模式运行 docker 命令。

如果使用 `--detach` 就不需要使用 `--tty` 分配终端了，那么命令可以修改为：

```shell
docker run --interactive --detach ubuntu:15.10
```

`--detach` 还会在分离容器后，返回容器的 ID 值，通过该 ID 值可以对容器进行访问、重启、关闭、删除等操作。

不过一般用户不需要记录此 ID 值，因为可以通过其他命令查看。使用以下命令可以查看当前创建的容器及其状态：

```shell
docker ps --all
```

默认情况下，`docker ps` 不会显示已经关闭的容器，`--all` 参数会显示所有容器，包括已经关闭的。

分离模式下的容器如何访问？

可以使用以下命令来访问一个分离模式下的容器：

```shell
docker exec --tty --interactive 容器 /bin/bash
```

其中，`/bin/bash` 指定容器的命令，上面的命令访问了指定容器的交互式命令行，并且分配终端保持输入。

容器还有很多命令，比如指定一个容器生成镜像，为容器打标签等等。

> - `--tty` 简写：`-t`
> - `--interactive` 简写：`-i`
> - `--detach` 简写：`-d`
>
> docker 的一行命令存在多个简写参数时，可以组合在一起，例如 `-d -i` 可以写作 `-di`
>
> docker 不同命令有可能存在相同简写但是意义完全不一样的情况，比如 `docker build -t` 中的 `-t` 是 `--tag` 而非 `--tty`。
>
> 个人不是很推荐简写，时间长了 `-it`、`-di` 这种写法都不知道自己在干什么。

### 镜像

docker 有一个开放的镜像库 [Dockerhub][7]，这里记录了很多官方或第三方的镜像包。里面有仅仅是纯净系统的 centos，ubuntu，又或者是含有一个应用的 mysql，python，nginx，httpd，再或者是集成架构的 lamp，都可以在镜像库中找到。其次，用户还可以定制自己的镜像包并发布到 Dockerhub，方便拉起部署。

大多数镜像都只做一件事，这样可以有效的降低业务架构的耦合度。

比如一个 ubuntu 系统需要包含环境 ubuntu + python + nginx + nodejs + mysql，虽然可以使用 docker 构建一个 ubuntu 系统进行配置，但是这样就又回到了起点，没有对各部分业务进行解耦。

正确的做法是把这些应用解耦到 4 个容器中，把 python、nginx、nodejs、mysql 分别装到 4 个系统中，尽管这样做看上去很麻烦，但却很好的对架构进行了解耦。

镜像的来源基本都基于 [Dockerhub][7]，当然也有其他的镜像库，但是官方的肯定要香一些。

Dockerhub 类似 Github，本质是镜像仓库，用户可以对仓库中的镜像进行拉取 pull、推送 push 或查找 search 等操作。

拉取一个镜像很简单，例如使用 `docker pull ubuntu:15.10` 命令拉取 ubuntu 的 15.10 版本：

```shell
PS > docker pull ubuntu:15.10
15.10: Pulling from library/ubuntu
Digest: sha256:02521a2d079595241c6793b2044f02eecf294034f31d6e235ac4b2b54ffc41f3
Status: Downloaded newer image for ubuntu:15.10
docker.io/library/ubuntu:15.10
```

上面的命令将拉取 ubuntu 的 15.10 版本的镜像到本地。其中 Digest 可以理解为镜像的散列值，当镜像内部出现改动时，这个散列值将发生改变。

> 如果使用命令 `docker pull ubuntu` 会怎么样？这会直接拉取最新版本的 ubuntu 镜像，是 `docker pull ubuntu:latest` 的简写。

> 实际上 我们并不需要拉取镜像，当我们根据一个网络镜像创建容器的时候，docker 会自动从网络中获取镜像并存到本地。

如果想要知道本地有哪些镜像，可以使用以下命令：

```shell
docker images
```

如果需要查看指定镜像的详细信息，可以使用下列命令：

```shell
docker image inspect <image-id>
```

如何更新镜像？

如果要更新一个镜像，可以根据一个容器实例的更新来生成新的镜像。先创建一个容器：

```shell
docker run --tty --interactive ubuntu
```

因为是一个初始 ubuntu 容器，所以 ping 命令都无法使用。那么我们就对此容器安装 ping 命令（这两行命令在容器中进行）：

```bash
apt-get update
apt-get install iputils-ping
```

上面两行命令将更新软件源并安装 ping 命令，在完成后可以使用 ping 命令测试下是否安装成功，成功后使用 `exit` 退出容器。

执行以下命令根据该容器创建新的镜像：

```shell
docker commit --author "your-name" --message "本次提交的信息：更新软件源，安装 ping 命令" <container> commit-ubuntu:v2
```

使用容器的 id 或者名字代替 `<container>`，`commit-ubuntu` 是生成镜像的名字，`v2` 是生成镜像的 tag 标签。

此时使用 `docker images`，就可以查看到一个名叫 `commit-ubuntu`、tag 为 `v2` 的新镜像了。

如果我们使用这个新镜像生成一个新容器，那么新容器可以直接使用 ping 命令。例如：

```shell
PS > docker run --interactive --tty commit-ubuntu:v2
root@9f6f322be48a:/# ping docker.com
PING docker.com (141.193.213.20) 56(84) bytes of data.
64 bytes from 141.193.213.20 (141.193.213.20): icmp_seq=1 ttl=37 time=201 ms
64 bytes from 141.193.213.20 (141.193.213.20): icmp_seq=2 ttl=37 time=198 ms
^C
--- docker.com ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2428ms
rtt min/avg/max/mdev = 198.179/201.965/206.524/3.450 ms
root@9f6f322be48a:/# exit
exit
```

### 卷 volume

docker 创建容器没啥问题，但是 docker run 操作，每次都会生成一个新的容器，新容器不会使用旧容器的数据。

volume 可以把本地环境中真实的文件挂载到容器实例中。

比较直接的例子：

- _把数据库的数据文件挂载到容器中_

  这样不论我们怎么修改容器，容器的数据库文件总是指向本地，不会丢失。

- _把应用程序挂在到容器中_

  容器会访问本地文件来运行服务，而不是容器内部的文件来运行。使用场景如前端后端代码挂载。

卷的使用也很简单，例如：

```shell
docker run --volume "$(pwd):/app" ...
```

`--volume "$(pwd):/app"` 就是把当前路径挂载到虚拟机中的 `/app` 路径下，假设当前路径就是代码文件，那么我们每次更新完代码，只需要删掉旧容器，启动新容器即可完成项目部署。此时容器本身的环境没有任何变化。

这种方式针对代码更新很方便，用户清楚的知道容器里，`/app` 指向了真是环境的当前文件夹。

有的时候我们并不关注数据的位置，我们只是需要一个存储数据的地方，例如 mysql 的数据文件，都是一堆格式化二进制文件，这些文件只需要找个地方存就可以了。那么就可以使用 docker 来创建一个具名 volume。

**具名 volume 根据关键字在本地环境中映射一个路径**，创建一个 volume 使用以下命令：

```shell
docker volume create mysql-data
```

此时我们就使用 docker 创建了一个名为 `mysql-data` 的卷，它映射了本地环境中的某个文件夹。需要查看这个卷的详细信息，可以使用：

```shell
docker volume inspect mysql-data
```

上面命令将返回我们这个卷的详细信息，其中就包含了它在本地环境中真实的路径。

> windows 用户的话，会发现其路径还是 linux 的路径，这很正常，因为 windows 中的 docker 本身就是运行在一个虚拟机中，所以路径映射的运行是 docker 服务的虚拟机的路径中。mac os 我没试过。

它的用法和前面直接映射本地路径是一样的，例如：

```shell
docker run --volume mysql-data:/home/data/mysql ...
```

`--volume mysql-data:/home/data/mysql` 会把卷 `mysql-data` 映射到容器的 `/home/data/mysql` 路径中，假设你的 mysql 配置此文件夹为数据存放路径，那么数据就会根据映射，存放到卷 `mysql-data` 中，你可以在本机找到对应的数据文件。当下次容器更新时，数据会得到重复使用。

### 网络

docker 创建的容器是互不干扰的，默认情况下，他们不在同一网络中，所以无法进行互相访问，例如算法提供的接口，后端无法访问，前端的 ssr 也不能从后端拿到数据。

docker 为此提供了网络模块，用户可以使用 docker 创建一个共享网络，多个容器会被圈到同一个内网当中，让彼此可以访问。

创建一个网络很简单：

```shell
docker network create ping-net
```

上面代码创建了一个叫做 `ping-net` 的网络，现在这个网络里面什么容器都没有。我们可以在里面添加任意的容器，比如：

```shell
docker run --detach --interactive --name test1 --network ping-net ubuntu
```

上面代码创建了一个容器，有一个别名 `test1`，这个容器被加进了网络 `ping-net` 中。

接着我们可以再创建一个容器：

```shell
docker run --interactive --tty --network ping-net ubuntu
```

这个容器也在 `ping-net` 网络中，并且我们打开了它的终端，为了测试两个容器是否处于同一网络，我们可以使用 `ping` 命令，首先安装（下面命令在第二个容器中执行）：

```bash
apt-get update
apt install iputils-ping
```

然后我们在容器中执行 `ping` 命令，目标是第一个容器的名字 `test1`（下面命令在第二个容器中执行）：

```bash
ping test1
```

此时可以看到两个容器互连了，它们被分配到了同一个 docker 的虚拟网络中。

> 当然也可以直接使用 ip 地址去访问，但是这样并不安全，docker 不会每次都分配固定 ip 到容器中，除非你主动设置 ip 地址。主动设置参考 [docker run](https://docs.docker.com/engine/reference/commandline/run/)。
>
> 除此之外，docker 还支持对容器的 ipv6，dns，mac 等都进行配置。

### 端口映射

不论什么应用，总该要有输入输出，不论是 TCP、UDP，又或者是 http。这些接口都是容器内部的应用提供，docker 提供端口映射来把容器中的服务映射到本机上的实际端口上。

例如：

```shell
docker run --volume "$(pwd):/usr/share/nginx/html:ro" --publish 8080:80  --detach nginx
```

上面命令中：

- `--volume` 把当前文件夹挂载到了容器的 `/usr/share/nginx/html` 路径上，`:ro` 代表该卷只读，这是 nginx 镜像默认的静态资源文件夹。
- `--publish` 把容器的 80 端口映射到了本机的 8080 端口上
- `--detach` 分离模式运行此容器
- `nginx` 是镜像的名字

在容器启动后，可以在当前文件夹创建一个 `index.html` 的文件写入以下内容：

```html
<h1>hello world!</h1>
```

然后在本机使用 `http://localhost:8080` 进行访问，会发现该地址转发了 `index.html` 文件。

> 这节内容其实涵盖的知识点很小，但却是如何访问容器内服务的关键。

### Dockerfile

生成镜像的另一种方式是使用 [Dockerfile](https://docs.docker.com/engine/reference/builder/) 文件。Dockerfile 文件用来描述需要生成镜像的来源，相关信息，已经容器内部的改变，通过 Dockerfile 文件可以清楚的了解到构建后的镜像是什么样子。

Dockerfile 字如其名，使用它需要先创建一个名为 “Dockerfile” 的文件，注意是没有后缀名的。然后可以简单的键入以下内容：

```Dockerfile
FROM ubuntu
```

这是一个最简单的 Dockerfile 文件，`FROM ubuntu` 代表这个镜像将基于 ubuntu 镜像开始构建。如果使用这个 Dockerfile 文件构建一个新的镜像，那么它会和 ubuntu 镜像一模一样。

执行以下命令根据一个 Dockerfile 文件创建镜像：

```shell
docker build --tag new-name/ubuntu:v1 .
```

上面的代码创建了一个叫做 `new-name/ubuntu:v1` 的镜像，最后的小点 `.` 代表当前路径，它提供一个上下文路径供给 docker 来查找 Dockerfile 文件，所以这条命令需要在创建 Dockerfile 文件的目录执行。这条命令会创建一个新的镜像，它和当前的 ubuntu 镜像完全一致。

Dockerfile 支持让你在构建镜像时执行一些命令，比如：

```Dockerfile
FROM ubuntu
RUN apt-get update \
    && apt install iputils-ping -y
```

上面的内容描述了创建新镜像时基于原始镜像执行的命令。

此时使用 `docker build` 参考这个 Dockerfile 文件构建的镜像，会直接包含 ping 命令，通过 Dockerfile 文件我们可以清楚的知道新镜像进行了哪些配置。

Dockerfile 文件依赖 `docker build` 命令来创建镜像。

### Docker Compose

[Docker Compose](https://docs.docker.com/compose/compose-file/) 使用 yaml 文件来共享多个容器并帮助我们定义容器的启动。它可以同时管理多个容器的启动和关闭。

> 如果是 linux 系统，陈旧版本的 Docker Compose 是没有与 docker 进行捆绑安装的，linux 系统需要 Docker Compose 进行安装，[查看这里](https://docs.docker.com/compose/install/)。

查看你的 Docker Compose 版本号：

```shell
docker-compose version # 陈旧版本的 命令
# or
docker compose version # 新版本的命令，新版本的 compose 已经集成到 docker 中
```

在创建一个容器的时候，命令是不可少的。大多数情况下，一个容器的创建都会包含卷 volume、网络，端口映射，启动命令，工作目录，环境变量等等配置，例如创建一个 mysql 的容器：

```shell
PS> docker run -d `
  --network todo-app --network-alias mysql `
  -v todo-mysql-data:/var/lib/mysql `
  -e MYSQL_ROOT_PASSWORD=secret `
  -e MYSQL_DATABASE=todos `
  mysql:5.7
```

> 上面的命令是在 windows 的 powershell 中运行，如果使用 linux 或者 mac 系统，需要把 “\`” 替换为 “\\”。

上面的命令中，我们启动了一个 mysql 容器，我们为其设置了网络，挂载了数据卷，设置了环境变量，但是这样的命令不方便记录或者保存。Docker Compose 解决了这个问题。

我们可以为上述的容器创建一个 `docker-compose.yml` 文件，然后键入以下内容：

```yaml
version: "3.7"

services:
  mysqlapp:
    image: mysql:5.7
    volumes:
      - mysql-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: todos

volumes:
  mysql-data:
```

> **注意，`version` 标记的不是你的应用或者业务逻辑的版本号，它标记的是 Docker Compose 文件的版本号，就类似于 HTML5 的文件定义 `<!DOCTYPE html>` 一样。**

> 如果本地 volume `mysql-data` 如果没有创建，docker 会创建一个测试 volume 来代替它。不要在生产中使用测试 volume。

此时一个 mysql 服务就被加到了 `docker-compose.yml` 文件中，它在创建容器时的名字是 `mysqlapp`。

也就是说现在我们只需要一个文件，就可配置好我们的 mysql 服务，使用以下命令来开启它：

```shell
docker compose up --detach
```

我们可以使用 `docker exec` 来访问这个 mysql 服务，在此之前，你需要使用 `docker ps` 来找到这个容器：

```shell
docker exec --tty --interactive <contianer> mysql -u root -p
```

然后输入密码 `secret` 回车即可访问这个 mysql 数据库。

> 这里我们没有使用网络，因为 Docker Compose 会自动创建网络，并把各个服务连接到网络中。如果我们需要添加一个后端，那么只需要为后端的服务配置数据库的主机为 `mysqlapp:3306` 即可访问。

Docker compose 还支持共享，上面的例子中只配置了一个 mysql 服务而已，如果你需要，可以把前端后端都配置到 `docker-compose.yml` 文件的 `services` 下，它们会被共享到一个网路中。

使用以下命令关闭所有服务：

```shell
docker compose down
```

> 你可以像普通的容器一样管理 Docker Compose 启动的容器，使用 `docker ps` 一样可以查看到 Docker Compose 启动的容器列表。

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
- [docker 官网][4]
- [docker | 菜鸟教程][5]
- [wsl][6]

- [bug: Docker fails to build image with exit code 139.( docker build 的时候，使用的镜像过老，导致和 wsl 不兼容)][b1]

[1]: https://www.runoob.com/docker/docker-mirror-acceleration.html
[2]: https://github.com/docker/for-win/issues/660
[3]: https://stackoverflow.com/questions/40622162/docker-load-and-save-archive-tar-invalid-tar-header
[4]: https://docs.docker.com/get-started/overview/
[5]: https://www.runoob.com/docker/docker-tutorial.html
[6]: https://docs.docker.com/engine/reference/run/
[7]: https://hub.docker.com/
[8]: https://learn.microsoft.com/en-us/windows/wsl/
[b1]: https://stackoverflow.com/questions/65429435/docker-fails-to-build-image-with-exit-code-139
[b2]: https://www.docker.com/get-started/
[b3]: https://docs.docker.com/get-docker/
