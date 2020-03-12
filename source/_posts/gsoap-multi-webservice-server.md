---
title: 如何使用gsoap在一个程序中搭载多个webservice
date: 2016-12-09 10:09:21
categories:
  - C++
  - WebService
  - gSoap
tags:
  - 工作笔记
  - 技术文档
  - C++
  - G++
  - gSoap
---



最近有项目需要在一个程序中搭建两个Webservice服务器，监于程序是基于gsoap开发，研究了一下如何在程序中搭建两个Webservice服务器，流程如下。

搭建两个webservice，最初的想法很简单，在用SOAPCPP2生成文件的时候，加入-Q参数，确保每个webservice处于每个单独的命名空间，可是添加到项目中，报错了：

```

1> : error LNK2001: 无法解析的外部符号 _soap_putheader

1> : error LNK2019: 无法解析的外部符号 _soap_faultcode，该符号在函数 _http_response 中被引用

1> : error LNK2019: 无法解析的外部符号 _soap_faultsubcode，该符号在函数 _soap_set_error 中被引用

1> : error LNK2019: 无法解析的外部符号 _soap_faultstring，该符号在函数 _soap_print_fault 中被引用

1> : error LNK2019: 无法解析的外部符号 _soap_faultdetail，该符号在函数 _soap_set_error 中被引用

1> : error LNK2019: 无法解析的外部符号 _soap_check_faultsubcode，该符号在函数 _soap_print_fault 中被引用

1> : error LNK2019: 无法解析的外部符号 _soap_check_faultdetail，该符号在函数 _soap_print_fault 中被引用

1> : error LNK2019: 无法解析的外部符号 _soap_serializefault，该符号在函数 _soap_send_fault 中被引用

1> : error LNK2019: 无法解析的外部符号 _soap_getheader，该符号在函数 _soap_recv_header 中被引用

1> : error LNK2019: 无法解析的外部符号 _soap_getfault，该符号在函数 _soap_recv_fault 中被引用

1> : error LNK2019: 无法解析的外部符号 _soap_putfault，该符号在函数 _soap_send_fault 中被引用



```



原来是这些都没有实现，因为包含到命名空间中去了，所以首先需要实现一个空服务器，也就是没有任何定义的webservice，实现基本函数，然后再将两个包含命名空间的webservice导入，编译成功。



接下来的工作便是加入http plugin，在post handler函数中根据路径来判断调用的是哪个接口。