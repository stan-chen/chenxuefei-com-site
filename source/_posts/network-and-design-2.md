---
title: 关于网络架构规划配置二三事(二)
date: 2016-11-05 14:25:11
keywords: "博达, 路由器, 博达交换机, 博达防火墙"
categories:
  - 部署
tags:
  - 技术文档
  - 服务器搭建
  - 平台搭建
---

今天终于弄明白为甚么调试了半天防火墙，路由都不通，原来是**捷普防火墙认证**如果**过期**功能将无法启用。
<!-- more -->
顺利打通防火墙认证之后，将两个端口弄成桥模式，然后将入网线和路由器接在防火墙两个端口上， 就OK了。
