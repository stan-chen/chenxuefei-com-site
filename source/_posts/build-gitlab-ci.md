---
title: "在自建Gitlab CE上采用Docker方式搭建CI"
date: 2017-8-14 12:39:04
keywords: "Gitlab"
categories:
  - 部署
tags:
  - Gitlab CE
  - Gitlab CI
  - Docker
---

## 在自建Gitlab CE上采用Docker方式搭建CI

gitlab-ci全称是gitlab continuous integration的意思，也就是持续集成。中心思想是当每一次push到gitlab的时候，都会触发一次脚本执行，然后脚本的内容包括了测试，编译，部署等一系列自定义的内容。

相较传统部署方式，这样大大减少了部署的时间，一次push即开始部署。

但是在使用gitlab ci需要在服务器进行一些配置，本文将探讨如何在自建Gitlab CE服务器上部署`docker`方式的CI

本文的详细内容在[Gitlab Doc](https://docs.gitlab.com/ee/ci/runners/README.html#runners)上有详细描述

1. 采用Docker方式部署，首先需要拉取 `Gitlab Runner` 镜像：
    ```
    docker pull gitlab/gitlab-runner
    ```

2. 在云主机运行gitlab runner：

    ```
    docker run -d --name gitlab-runner --restart always -v /srv/gitlab-runner/config:/etc/gitlab-runner -v /var/run/docker.sock:/var/run/docker.sock gitlab/gitlab-runner:latest
    ```

    > 上述命令，本地的`/srv/gitlab-runner/config`路径是映射进容器的config文件，`/var/run/docker.sock`是本机的docker套接字文件，将套接字文件映射进去是因为需要连接到宿主机docker service上，push部署的时候便可以使用宿主机docker容器的方式编译代码。
    
3. Runner运行起来了需要在gitlab-ce服务器上注册这个runner：

    * `docker exec -it gitlab-runner gitlab-runner register` 
     
      > 执行runner容器register命令

    * `Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com )` 
      
      > 这里输入你的gitlab服务地址：

      > `https://gitlab.com`

    * `Please enter the gitlab-ci token for this runner` 

      > 这里输入你的gitlab服务runner token，如果你不知道token，以admin账户登录gitlab服务，在`Setting => Runner`页面中查看：
      
      `token`

    * `Please enter the gitlab-ci description for this runner`

      > 这里输入你的runner描述，可随意输入
      
      `[hostame] my-runner`

    * `Please enter the gitlab-ci tags for this runner (comma separated):`

      > 这里输入你的runner标签，可随意输入，以逗号隔开
    
      `my-tag,another-tag`

    * `Whether to run untagged jobs [true/false]:`

      > 是否只运行tag的代码
      
      `[false]: true`

    * `Whether to lock Runner to current project [true/false]:`

      > 是否锁定runner，默认是shared runner，这里填false

      `[false]: false`

    * `Please enter the executor: ssh, docker+machine, docker-ssh+machine, kubernetes, docker, parallels, virtualbox, docker-ssh, shell:`
      
      > 类型输入docker 
      
      `docker`

    * `Please enter the Docker image (eg. ruby:2.1):`

      > 默认容器镜像，这里填alpine
      
      `alpine:latest`

4. 注册完毕就可以使用这个shared runner了