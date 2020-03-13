---
title: "tomcat启动报java.lang.OutOfMemoryError: PermGen space错误"
date: 2016-11-07 01:33:53
keywords: "tomcat, 部署"
categories:
  - Java
tags:
  - 技术文档
  - JAVA
  - 服务器搭建
  - 平台搭建
  - j2ee
---

tomcat在本机部署没有问题，移动到另外的机子上运行就报错，错误如下：
<!-- more -->
> java.lang.OutOfMemoryError: PermGen space

原来是内存不足，部署加载的jar包是沿用的默认内存，所以出现了内存不足的问题，解决办法如下：

1. 如果采用的是`startup.bat(.sh)`启动，打开文件`catalina.bat(.sh)`文件，找到`echo Using CATALINA_HOME:   "%CATALINA_HOME%"`这一行，在后面添加`JAVA_OPTS="%JAVA_OPTS% -server -Xms256m -Xmx512m -XX:PermSize=256M -XX:MaxPermSize=512m"`，然后在重启就OK。

2. 如果是采用service启动，修改注册表`HKEY_LOCAL_MACHINE\SOFTWARE\Apache Software Foundation\Tomcat Service Manager\Tomcat5\Parameters\Java`的 `Options`值，增加`-Xms256m -Xmx512m`然后重新启动。

**一些常用jvm参数：**

`-server`



一定要作为第一个参数，在多个CPU时性能佳



`-Xms`



java Heap初始大小。 默认是物理内存的1/64。



`-Xmx`



java heap最大值。建议均设为物理内存的一半。不可超过物理内存。



`-XX:PermSize`



设定内存的永久保存区初始大小，缺省值为64M。（我用visualvm.exe查看的）



`-XX:MaxPermSize`



设定内存的永久保存区最大 大小，缺省值为64M。（我用visualvm.exe查看的）



`-XX:SurvivorRatio=2`



生还者池的大小,默认是2，如果垃圾回收变成了瓶颈，您可以尝试定制生成池设置



`-XX:NewSize`



新生成的池的初始大小。 缺省值为2M。



`-XX:MaxNewSize`



新生成的池的最大大小。缺省值为32M。

如果 JVM 的堆大小大于 1GB，则应该使用值：-XX:newSize=640m -XX:MaxNewSize=640m -XX:SurvivorRatio=16，或者将堆的总大小的 50% 到 60% 分配给新生成的池。调大新对象区，减少Full GC次数。



`-XX:AggressiveHeap`



会使得 Xms没有意义。这个参数让jvm忽略Xmx参数,疯狂地吃完一个G物理内存,再吃尽一个G的swap。



`-Xss`



每个线程的Stack大小，“-Xss 15120” 这使得JBoss每增加一个线程（thread)就会立即消耗15M内存，而最佳值应该是128K,默认值好像是512k.



`-verbose:gc`



现实垃圾收集信息



`-Xloggc:gc.log`



指定垃圾收集日志文件



`-Xmn`



young generation的heap大小，一般设置为Xmx的3、4分之一



`-XX:+UseParNewGC`



缩短minor收集的时间



`-XX:+UseConcMarkSweepGC`



缩短major收集的时间 此选项在Heap Size 比较大而且Major收集时间较长的情况下使用更合适。



`-XX:userParNewGC`



可用来设置并行收集【多CPU】



`-XX:ParallelGCThreads`



可用来增加并行度【多CPU】



`-XX:UseParallelGC`



设置后可以使用并行清除收集器【多CPU】

