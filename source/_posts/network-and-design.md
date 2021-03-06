---
title: 关于网络架构规划配置二三事(一)
date: 2016-10-29 02:08:24
keywords: "博达, 路由器, 博达交换机, 博达防火墙"
categories:
  - 部署
tags:
  - 服务器搭建
  - 平台搭建
---

前几天出了一趟差，写程序之余稳稳的体验了一把系统、网络管理员（俗称网管==）。

闲话少说，简单介绍一下客户机房需要实现的网络拓扑结构的具体需求：  
<!-- more -->

{% ossimg 201610312326-1.png 本端实际架构 %}


上图中，左边为本端机房，右边是远在天边（具体也不知道在哪）的机房，有一根专线直接连通对方机房，现在已知我方专线端点IP `172.255.2.10/30` 对方端点IP `172.255.2.9/30`，对方和我方下面都有一个子网，我方子网网段是`10.134.198.0/24`，对方子网网段是`10.132.10.0/24`，现在唯一的要求就是能让我方子网段的server能够连通对方子网段的server，互联互通。


由于路由器未到，所以只能将防火墙当成路由器使用，所以现在实际的网络拓扑变成了如下的形式：


{% ossimg 201610312326-2.png 本端现实架构 %}


上图中，路由器和防火墙合二为一，其他的拓扑结构不变。

初次想法很简单（当然，实际也这么简单），本端做好到对端的路由，也就是 将 `10.132.10.0/24` 的路由下一跳到 `172.255.2.9` 做好，就可以访问对端子网的，但是事不如人意，做好全部路由之后，本端依然没法访问对端子网，这个时候就急了，这么简单的一个路由，怎么就是ping不上呢？



后来，通过不断尝试（瞎猫碰上死耗子），终于发现，原来是子网做了`NAT`转换，将`NAT`转换禁用掉之后，可以ping通对方子网，那么为什么启用`NAT`转换之后，就无法连通对方子网呢？

