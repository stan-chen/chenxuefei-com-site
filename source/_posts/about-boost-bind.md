---
title: 在调用bind()之后做了什么
date: 2016-11-18 06:22:24
keywords: "Bind, 函数, 异步, 回调"
categories:
  - C++
  - Boost
tags:
  - 工作笔记
  - C++
---

bind函数是最常用到的函数，不管是在异步回调，还是函数适配方面，但是，调用bind函数之并传入引用参数之后，究竟是否在内部会保存这些参数呢，为此我做了一个小实验：



```

class   demo_class

{

public:

    std::string msg;

};

demo_class cccc;



void    func(demo_class &c)

{

    c.msg = "cccc have been changed";

}



auto    gen_function(demo_class & c) -> decltype(_bind(func,c))

{

    return _bind(func, c);

}



auto    get_func() -> decltype(gen_function(cccc))

{

    cccc.msg = "This is ccccc";

    return gen_function(cccc);

}

int main(int argc, char ** argv)

{

    get_func()();

    std::cout << cccc.msg << std::endl;

}

```

最后输出



> This is ccccc



由此可见，bind函数调用之后是将参数全部做了一份拷贝，然后在回调的时候，将这份拷贝传入，不管回调是否以引用传递，这份拷贝始终保持原有值。

这一点在bind函数声明上也有提现



```

BOOST_BIND( M T::*f, A1 a1 )

```



传入参数是以值传递，并不是引用传递。



