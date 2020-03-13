---
title: "Python3 MySqlDb 替换"
date: 2017-03-08 03:56:00
keywords: "MySQLDB, 模块, 加载"
categories:
  - Python
  - Django
tags:
  - Python
---

在python3之后，MySqlDb已经移除，替代的是PyMysql，在Django中，如果要使用最新的PyMysql作为数据库Engine，需要在__init__.py 中加入
<!-- more -->
> import pymysql

> pymysql.install_as_MySQLdb()



作为替代。
