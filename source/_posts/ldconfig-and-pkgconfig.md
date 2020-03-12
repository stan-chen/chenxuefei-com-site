---
title: ldconfig和pkgconfig
date: 2016-11-09 01:24:41
keywords: "ldconfig, pkgconfig"
categories:
  - C++
  - G++
tags:
  - 杂项
  - C++
---

1. **ldconfig命令**

<!-- more -->

  先说说ldconfig这个工具，通过源码安装的库文件，一般情况下是在`/lib`或者`/usr/lib`下，当编译程序的时候，系统就会从这两个目录下寻找对应的库文件，如果库文件不是安装在这两个目录下面，比如`/usr/local/lib`目录下，系统就会报找不到对应库文件的错误，这个时候就需要ldconfig了，只需要在`/etc/ld.so.conf`中将库目录添加进去，然后`root`执行以下`ldconfig`命令，库缓存就刷新了，重新编译程序就能找到对应的库文件了。



2. **pkg-config命令**



  ```

  gcc base.c -o base `pkg-config --cflags --libs gtk+-2.0`

  ```



  一个最简单的编译命令，就能看懂`pkg-config`命令是干什么用的了，简单来说就是管理包的命令，通过`pkg-config --cflags --libs xxx`就能直接获取计算机上已经安装的包的编译输出参数，这样是不是很方便呢？



  那`pkg-config`是从哪里去获取包的参数的呢？很简单，通过`PKG_CONFIG_PATH`这个路径下，去寻找每个库对应的`pc`文件(一般pc文件都存放在`pkgconfig`这个文件夹下面)，一般pc文件的格式是这样的



  ```

  # Package Information for pkg-config

  prefix=/usr

  exec_prefix=/usr

  libdir=/usr/lib64

  includedir=/usr/include



  Name: libpcre32

  Description: PCRE - Perl compatible regular expressions C library with 32 bit character support

  Version: 8.32

  Libs: -L${libdir} -lpcre32

  Libs.private: -pthread

  Cflags: -I${includedir}

  ```



  里面包含了编译链接需要的信息，所以只需要指定`PKG_CONFIG_PATH`路径，就能寻找到对应的库，并且能对应版本号，当编译执行`configure`的时候，就能根据对应的版本号查看安装的库是否满足最低要求了。

