---
title: 关于BananaPi板子下编译uwsgi缺少execinfo.h
date: 2017-02-27 07:51:30
keywords: "树莓派, 香蕉派"
categories:
  - 嵌入式
  - OpenWRT
tags:
  - C++
  - 平台搭建
  - G++
  - linux
---

GNU上有解答:



11.13 execinfo.h

Declares the functions backtrace, backtrace_symbols, backtrace_symbols_fd.

Documentation:

* http://www.gnu.org/software/libc/manual/html_node/Backtraces.html,

man backtrace.

* Gnulib module: —



Portability problems fixed by Gnulib:

* This header file is missing on some platforms: Mac OS X 10.3, FreeBSD 6.0, NetBSD 5.0, OpenBSD 3.8, Minix 3.1.8, AIX 5.1, HP-UX 11, IRIX 6.5, OSF/1 5.1, Solaris 10, Cygwin, mingw, MSVC 9, Interix 3.5, BeOS.



Portability problems not fixed by Gnulib:

* On platforms where the header file is missing, the Gnulib substitute implementation is just a stub, and does nothing.





只需在include中touch一个stub文件，即可解决