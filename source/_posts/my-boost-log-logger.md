---
title: 基于boost.log库的基本logger类
date: 2016-11-09 04:45:55
keywords: "boost.log, logger"
categories:
  - C++
  - Boost
tags:
  - 工作笔记
  - C++
---

* yjgb_logger.hxx
<!-- more -->
```

  /**************************************************************************/

  // 部门:

  // 作者: 陈雪飞<chenxuefei_pp@163.com>

  // 日期: 2016年8月20日 9:18:09

  // 程序: yjgb_common

  // 文件: yjgb_logger.hxx

  // 描述: Logger 类，通过对boost.log的封装实现了通用logger

  /**************************************************************************/

  #pragma once

  #include "yjgb_def.h"

  #include <boost/log/sources/logger.hpp>

  #include <boost/log/sources/severity_logger.hpp>

  #include <boost/log/sources/severity_feature.hpp>

  #include <boost/log/sources/record_ostream.hpp>

  #include <boost/log/attributes/named_scope.hpp>



  enum class yjgb_loglevel

  {

      Log_Info,

      Log_Notice,

      Log_Debug,

      Log_Warning,

      Log_Error,

      Log_Fatal,

      Log_Hell

  };



  // The formatting logic for the severity level

  template< typename CharT, typename TraitsT >

  inline std::basic_ostream< CharT, TraitsT >& operator << (

      std::basic_ostream< CharT, TraitsT >& strm, yjgb_loglevel lvl)

  {

      static const char* const str[] =

      {

          "Info",

          "Notice",

          "Debug",

          "Warning",

          "Error",

          "Fatal",

          "Hell"

      };

      if (static_cast<std::size_t>(lvl) < (sizeof(str) / sizeof(*str)))

          strm << str[(int)lvl];

      else

          strm << static_cast<int>(lvl);

      return strm;

  }



  inline  bool   operator < (yjgb_loglevel &l1, yjgb_loglevel & l2)

  {

      return static_cast<std::size_t>(l1) < static_cast<std::size_t>(l2);

  }



  class LIB_YJGB_COMMON_EXPORT yjgb_logger   final

  {

  public:



      static      void         init_logger(const std::string &log_dir, uint32_t level);



  public:

      static      boost::log::sources::severity_logger_mt<yjgb_loglevel>     logger;

  };



  #define         LOG_LEVEL(lvl,Message)  {BOOST_LOG_FUNC();BOOST_LOG_SEV(yjgb_logger::logger,yjgb_loglevel::lvl)<<Message;}

  #define         LOG_INFO(Message)       LOG_LEVEL(Log_Info,Message)

  #define         LOG_NOTICE(Message)     LOG_LEVEL(Log_Notice,Message)

  #define         LOG_DEBUG(Message)      LOG_LEVEL(Log_Debug,Message)

  #define         LOG_WARNING(Message)    LOG_LEVEL(Log_Warning,Message)

  #define         LOG_ERROR(Message)      LOG_LEVEL(Log_Error,Message)

  #define         LOG_FATAL(Message)      LOG_LEVEL(Log_Fatal,Message)

```



* yjgb_logger.cpp

```

  /**************************************************************************/

  // 部门: 

  // 作者: 陈雪飞<chenxuefei_pp@163.com>

  // 日期: 2016年8月20日 9:18:33

  // 程序: yjgb_common

  // 文件: yjgb_logger.cpp

  // 描述: Logger 类

  /**************************************************************************/



  #include "yjgb_logger.hxx"

  #include <iostream>

  #include <boost/date_time/posix_time/posix_time.hpp>

  #include <boost/log/support/date_time.hpp>

  #include <boost/log/common.hpp>

  #include <boost/log/expressions.hpp>

  #include <boost/log/expressions/keyword.hpp>



  #include <boost/log/attributes.hpp>

  #include <boost/log/attributes/timer.hpp>

  #include <boost/log/sources/logger.hpp>

  #include <boost/log/sources/severity_logger.hpp>

  #include <boost/log/sinks/sync_frontend.hpp>

  #include <boost/log/sinks/async_frontend.hpp>

  #include <boost/log/sinks/text_file_backend.hpp>

  #include <boost/core/null_deleter.hpp>

  #include <boost/log/utility/setup/file.hpp>

  #include <boost/log/utility/setup/console.hpp>

  #include <boost/log/utility/setup/common_attributes.hpp>

  #include <memory>

  #include <boost/log/attributes/named_scope.hpp>

  #include <boost/filesystem.hpp>





  //Logger唯一实例

  boost::log::sources::severity_logger_mt<yjgb_loglevel>   yjgb_logger::logger;



  namespace logging = boost::log;

  namespace attrs = boost::log::attributes;

  namespace src = boost::log::sources;

  namespace sinks = boost::log::sinks;

  namespace expr = boost::log::expressions;

  namespace keywords = boost::log::keywords;



  BOOST_LOG_ATTRIBUTE_KEYWORD(log_level, "Severity", yjgb_loglevel)

  BOOST_LOG_ATTRIBUTE_KEYWORD(log_timestamp, "TimeStamp", boost::posix_time::ptime)

  BOOST_LOG_ATTRIBUTE_KEYWORD(log_uptime, "Uptime", attrs::timer::value_type)

  BOOST_LOG_ATTRIBUTE_KEYWORD(log_scope, "Scope", attrs::named_scope::value_type)



  void yjgb_logger::init_logger(const std::string &log_dir, uint32_t level)

  {

      //判断是否可以创建文件夹

      auto log_dir_path = boost::filesystem::path(log_dir);

      if (!boost::filesystem::exists(log_dir_path))

      {

          if (!boost::filesystem::create_directory(log_dir_path))

          {

              std::cerr << "无法创建日志文件夹" << log_dir << " 请确认是否有写权限" << std::endl;

              exit(-2);

          }

      }

      //日志处理格式

      logging::formatter formatter =

          expr::stream

          << "[" << expr::format_date_time(log_timestamp, "%H:%M:%S") //日志记录时间

          << "]" << expr::if_(expr::has_attr(log_uptime))             //如果有上一条记录到这条记录的路径时间,则输出     

          [

              expr::stream << "[" << format_date_time(log_uptime, "%O:%M:%S") << "]"

          ]

      << "[" << log_level << "]"      //对日志记录进行精细划分

          << expr::if_(expr::is_in_range(log_level, yjgb_loglevel::Log_Info, yjgb_loglevel::Log_Debug))   //如果日志等级大于Debug等级则记录下具体的函数作用域,更方便调试

          [

              expr::stream << expr::format_named_scope(log_scope, keywords::format = "[%n]")

          ]

      << expr::if_(expr::is_in_range(log_level, yjgb_loglevel::Log_Debug, yjgb_loglevel::Log_Hell))

          [

              expr::stream << expr::format_named_scope(log_scope, keywords::format = "[%n](%f:%l)")

          ]

      << ":" << expr::message;



      //增加文件日志输出功能，记录成文件格式，方便前台解析

      auto file_sink = boost::make_shared<logging::sinks::asynchronous_sink<logging::sinks::text_file_backend> >

          (

              keywords::file_name = log_dir + "/log_%Y%m%d-%N.log",           //文件名

              keywords::rotation_size = 10 * 1024 * 1024,                     //单个文件限制大小

              keywords::open_mode = std::ios::app,

              keywords::time_based_rotation = sinks::file::rotation_at_time_point(0, 0, 0)    //每天重建

              );

      //控制台日志输出

      auto console_sink = boost::make_shared<logging::sinks::asynchronous_sink<logging::sinks::text_ostream_backend> >

          ();

      /*设定Console LOG*/

      {

          console_sink->locked_backend()->add_stream

          (boost::shared_ptr<std::ostream>{&std::cout, boost::null_deleter()});

          console_sink->locked_backend()->auto_flush(true);

      }



      {

          file_sink->locked_backend()->set_file_collector(logging::sinks::file::make_collector

          (

              keywords::target = log_dir,                    //文件夹名

              keywords::max_size = 50 * 1024 * 1024,          //文件夹所占最大空间

              keywords::min_free_space = 100 * 1024 * 1024    //磁盘最小预留空间

          ));

          file_sink->locked_backend()->auto_flush(true);

          file_sink->locked_backend()->scan_for_files();      //查找日志同名文件

      }



      logging::add_common_attributes();



      file_sink->set_filter(log_level >= (yjgb_loglevel)level); //设定日志等级

      console_sink->set_filter(log_level >= (yjgb_loglevel)level);



      file_sink->set_formatter(formatter);

      console_sink->set_formatter(formatter);



      logging::core::get()->add_thread_attribute("Uptime", attrs::timer());

      logging::core::get()->add_global_attribute("Scope", attrs::named_scope());

      logging::core::get()->add_sink(file_sink);

      logging::core::get()->add_sink(console_sink);

  }

```

