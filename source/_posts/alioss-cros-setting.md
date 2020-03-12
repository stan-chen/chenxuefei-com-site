---
title: "关于阿里云OSS的跨站请求"
date: 2017-08-20 22:52:05
keywords: "跨站, 阿里云, 阿里云OSS, 配置"
categories:
  - 部署
tags: 
    - Aliyun
    - OSS
    - CROS
---
# 如何设置阿里云OSS的跨站请求

今天把静态文件部署到OSS做CDN，`js`,`css`静态文件get正常，但是`font-awesome`的`woff`字体搞死弄不出来，`response`返回200，但是字节数老是0，导致图标显示不正确。

经过一番查看，原来是跨域导致了`CROS`。

主页站点和CDN站点是两个不同源站，当主页载入了`font-awesome.css`的`stylesheet`载入之后，便开始从CDN站点载入字体文件，但是请求的`HOST`是主页站点，所以导致了`CROS`跨域请求，CDN返回错误。

那么什么是`CROS`呢，[这里](http://www.ruanyifeng.com/blog/2016/04/cors.html)详细说明，本文就不再阐述了。

如何在OSS中允许跨站请求呢，首先在OSS管理页面中进入`跨域设置`界面。URL如下：

```url
https://oss.console.aliyun.com/bucket/<你的地域>/<你的bucket名称>/cors
```

{% ossimg CROS1.png 跨域设置1 %}

进入这个界面

{% ossimg CROS2.png 跨域设置2 %}

点击创建规则

{% ossimg CROS3.png 跨域设置3 %}

来源填写你需要跨源的地址，方式选择`GET`,`POST`,`HEAD`(这个一定要填)。

然后再打开你的网站，这个时候请求就正确了。