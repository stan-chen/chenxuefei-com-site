---
title: "关于linux下g++编译器的 changes meaning of 错误"
date: 2016-11-17 05:05:25
keywords: "编译器, 编译"
categories:
  - C++
  - G++
tags:
  - C++
  - G++
  - windows
  - linux
---

程序源码：

```

typedef     ushort    word;

typedef     uint      dword;

typedef     ulong64   qword;

struct      myclass

{

    ...

    dword    dword()

    {

        return ip2dword(ip);

    }

};

```



同样一行程序，在windows下VS2015编译能通过，但是移植到Linux下用G++编译就通不过了，报错

```

changes meaning of ‘dword’ from ‘typedef unsigned int dword’

```

原来问题出在 `dword    dword()`这个函数上面，这个函数的声明和返回类型单词是一样的，虽然是在类里面，我原以为编译器会自动加上类`scope`，然而并没有，所以在Linux下面，改成这样就可以编译通过了：



```

typedef     ushort    word;

typedef     uint      dword;

typedef     ulong64   qword;

struct      myclass

{

    ...

    ::dword    dword() //在前面加上全局标识符

    {

        return ip2dword(ip);

    }

};

```

