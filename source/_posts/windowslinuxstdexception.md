---
title: Windows与Linux下std::exception的区别
date: 2016-11-17 05:14:37
keywords: "exception, 平台"
categories:
  - C++
tags:
  - C++
  - G++
  - windows
  - linux
---

Windows下:

```



namespace std {



class exception

{

public:



    exception() throw()

        : _Data()

    {

    }



    explicit exception(char const* const _Message) throw()

        : _Data()

    {

        __std_exception_data _InitData = { _Message, true };

        __std_exception_copy(&_InitData, &_Data);

    }



    exception(char const* const _Message, int) throw()

        : _Data()

    {

        _Data._What = _Message;

    }



    exception(exception const& _Other) throw()

        : _Data()

    {

        __std_exception_copy(&_Other._Data, &_Data);

    }



    exception& operator=(exception const& _Other) throw()

    {

        if (this == &_Other)

        {

            return *this;

        }



        __std_exception_destroy(&_Data);

        __std_exception_copy(&_Other._Data, &_Data);

        return *this;

    }



    virtual ~exception() throw()

    {

        __std_exception_destroy(&_Data);

    }



    virtual char const* what() const

    {

        return _Data._What ? _Data._What : "Unknown exception";

    }



private:



    __std_exception_data _Data;

};

```



Linux下：

```

namespace std

{

  /**

   * @defgroup exceptions Exceptions

   * @ingroup diagnostics

   *

   * Classes and functions for reporting errors via exception classes.

   * @{

   */



  /**

   *  @brief Base class for all library exceptions.

   *

   *  This is the base class for all exceptions thrown by the standard

   *  library, and by certain language expressions.  You are free to derive

   *  your own %exception classes, or use a different hierarchy, or to

   *  throw non-class data (e.g., fundamental types).

   */

  class exception

  {

  public:

    exception() _GLIBCXX_USE_NOEXCEPT { }

    virtual ~exception() _GLIBCXX_USE_NOEXCEPT;



    /** Returns a C-style character string describing the general cause

     *  of the current error.  */

    virtual const char* what() const _GLIBCXX_USE_NOEXCEPT;

  };



  /** If an %exception is thrown which is not listed in a function's

   *  %exception specification, one of these may be thrown.  */

  class bad_exception : public exception

  {

  public:

    bad_exception() _GLIBCXX_USE_NOEXCEPT { }



    // This declaration is not useless:

    // http://gcc.gnu.org/onlinedocs/gcc-3.0.2/gcc_6.html#SEC118

    virtual ~bad_exception() _GLIBCXX_USE_NOEXCEPT;



    // See comment in eh_exception.cc.

    virtual const char* what() const _GLIBCXX_USE_NOEXCEPT;

  };



  /// If you write a replacement %terminate handler, it must be of this type.

  typedef void (*terminate_handler) ();



  /// If you write a replacement %unexpected handler, it must be of this type.

  typedef void (*unexpected_handler) ();



  /// Takes a new handler function as an argument, returns the old function.

  terminate_handler set_terminate(terminate_handler) _GLIBCXX_USE_NOEXCEPT;



  /** The runtime will call this function if %exception handling must be

   *  abandoned for any reason.  It can also be called by the user.  */

  void terminate() _GLIBCXX_USE_NOEXCEPT __attribute__ ((__noreturn__));



  /// Takes a new handler function as an argument, returns the old function.

  unexpected_handler set_unexpected(unexpected_handler) _GLIBCXX_USE_NOEXCEPT;



  /** The runtime will call this function if an %exception is thrown which

   *  violates the function's %exception specification.  */

  void unexpected() __attribute__ ((__noreturn__));



  /** [18.6.4]/1:  'Returns true after completing evaluation of a

   *  throw-expression until either completing initialization of the

   *  exception-declaration in the matching handler or entering @c unexpected()

   *  due to the throw; or after entering @c terminate() for any reason

   *  other than an explicit call to @c terminate().  [Note: This includes

   *  stack unwinding [15.2].  end note]'

   *

   *  2: 'When @c uncaught_exception() is true, throwing an

   *  %exception can result in a call of @c terminate()

   *  (15.5.1).'

   */

  bool uncaught_exception() _GLIBCXX_USE_NOEXCEPT __attribute__ ((__pure__));



  // @} group exceptions

} // namespace std

```





注意这两个类，windows下有带string的构造函数，而linux下是没有的，所以跨平台程序继承这个类的时候需要分开。