---
title: "shared_ptr 循环引用的炒鸡大坑"
date: 2016-11-30 06:12:47
keywords: "shared_ptr, bug"
categories:
  - C++
  - C++11
tags:
  - 杂项
  - 技术文档
  - C++
  - G++
  - windows
  - linux
---

如果说shared_ptr可以解除内存泄漏那么久大错特错了，如果用得不好反而更容易内存泄漏，比如下面这个代码：



```

class B;

class A

{

public:

A(){}

~A() { std::cout << "~A()" << std::endl; }



boost::shared_ptr<B> ptr;

};



class B

{

public:

B()  {}

~B() { std::cout << "~B()" << std::endl; }



boost::shared_ptr<A> ptr;

};



int main()

{

    /*{

        boost::threadpool::pool  p(4);

        p.schedule(task_func);

        p.wait();

    }



    std::cout << "退出" << std::endl;*/



    {



        boost::shared_ptr<A> a(new A);

        boost::shared_ptr<B> b(new B);

        a->ptr = b;

        b->ptr = a;

    }

		

		return 0;

}

```



你会发现，两个一个都没有析构，这就叫循环引用，最终导致内存泄漏，因为退出后你将无法获取两个句柄。