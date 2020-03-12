---
title: "关于Boost Singleton do_nothing()的那点事"
date: 2016-08-27 06:37:51
keywords: "单例, 设计模式"
categories:
  - C++
  - Boost
tags:
  - 工作笔记
  - C++
---

关于C++ [`boost`](http://www.boost.org/) singleton模式中的`do_nothing()`

关于这个`do_nothing()`函数是最令人迷惑的，按照一般思维，静态变量在程序`main()`开始之前就已经存在，那为什么需要加上一个`do_nothing()`？



原来我们漏掉了这个 `C++` 标准[`3.6.2 initialisation of non local variables.`](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2011/n3242.pdf)。

>It is implementation-defined whether the dynamic initialization of a non-local variable with static storage

duration is done before the first statement of main...



>（`global`对象，定义在`namespace`内的对象，`class`内的`static`对象，函数内的`static`对象，`file`作用域内的 `static`对象）统称为`static`对象。其中函数内的`static`对象又叫`local static object`， 其他的叫`non-local static object`。



>`non-local static object`的初始化顺序是没有定义的，`local static object`在函数第一次调用时构造初始化。



>还有：`non-local static object`会在`main`函数之前被初始化。



[`boost`](http://www.boost.org/)的`singleton`的实现基于以下假设：**良好的设计在进入main函数之前应该是单线程的**。

我们可以使用全局变量的方式来设计singleton，并且保证在使用该`singleton`之前其已经被正确的初始化。



在进入`main`之前，唯一的主线程开始构造`Singleton<T>::create_object`，在其构造函数之内调用 `Singleton`的`instance`函数，并在该函数内生成`Singleton`对象，至于函数`do_noting()`，去掉之后照样可以通过编译，我想原 因可能是为了再次保证`singleton`的初始化完全成功。



通俗的讲，模版具有延迟实现机制，只是声明`create_object`而不调用`create_object`的方法是不会真正实例化的，所以有了`create_object.do_nothing()`，确保`create_object`被实例化。

