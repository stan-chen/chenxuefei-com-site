---
title: PHP无法加载自定义模块
date: 2016-11-08 03:41:34
keywords: "PHP, 模块, 加载"
categories:
  - 部署
  - PHP
tags:
  - 服务器搭建
  - 平台搭建
---

今天在Windows平台下搭载PHP环境，`Apache Httpd`和`PHP`都搭载成功了，只是自带的mongodb模块无法加载。
<!-- more -->
解决办法：

将PHP目录加到系统默认`PATH`环境变量下就OK，这样就知道在哪里去寻找Module目录了。
