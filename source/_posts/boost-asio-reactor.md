---
title: "Boost asio Reactor 模式编程"
date: 2016-11-14 07:29:19
keywords: "模式编程, 设计模式, 异步, 回调"
categories:
  - C++
  - Boost
tags:
  - 工作笔记
  - C++
---

今天才发现原来boost.asio也具有Reactor的模式，[原文](http://www.boost.org/doc/libs/1_62_0/doc/html/boost_asio/overview/core/reactor.html)具体如下：

<!-- more -->

> Sometimes a program must be integrated with a third-party library that wants to perform the I/O operations itself. To facilitate this, Boost.Asio includes a null_buffers type that can be used with both read and write operations. A null_buffers operation doesn't return until the I/O object is "ready" to perform the operation.



> As an example, to perform a non-blocking read something like the following may be used:

```

	ip::tcp::socket socket(my_io_service);

	...

	socket.non_blocking(true);

	...

	socket.async_read_some(null_buffers(), read_handler);

	...

	void read_handler(boost::system::error_code ec)

	{

		if (!ec)

		{

			std::vector<char> buf(socket.available());

			socket.read_some(buffer(buf));

		}

	}

```



> These operations are supported for sockets on all platforms, and for the POSIX stream-oriented descriptor classes.

