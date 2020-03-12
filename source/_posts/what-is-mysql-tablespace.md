---
title: 什么是MySQL表空间
date: 2016-10-11 08:21:26
keywords: "表空间"
categories:
  - MYSQL
tags:
  - 杂项
  - 架构
  - 平台搭建
---

mysql表空间的概念：



`mysql` `InnoDB引擎` 分为 **共享表空间** 和 **独立表空间**，两者有什么区别呢？



* 共享表空间：数据库所有表的表数据，索引文件存在一个单文件默认名为`ibdata1`中，所有数据和索引全部存储在一个单文件中，如此一听就很不爽了，不管是什么操作感觉都很不方便，很不利于管理，并且数据库的删除操作**并不会缩减文件**。



* 独立表空间：有且仅当 `innodb_file_per_table` 选项开启时启用独立表空间。数据库每个表有一个单独文件，每一个表都有一个`.frm`表描述文件，还有一个`.ibd`文件，这样每个表就有一个独立的表空间了。
