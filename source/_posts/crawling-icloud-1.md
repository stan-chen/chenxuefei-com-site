---
title: "爬取iCloud获取相册信息"
date: 2017-09-12 16:07:12
categories:
  - GO
tags: 
    - Apple
    - iCloud
    - Crawling
keywords: "爬虫, 相册, iCloud Photos"
---

前段时间搭建了一个低成本(￥1000)NAS，采用J3455平台，本着低功耗，板子上了`Ubuntu Server`系统，但是问题来了，`iCloud`没有`Linux`系统的版本，那怎样才能自动同步iCloud相册到本地磁盘呢？  
第一个想法便是爬虫，既然`iCloud`客户端无法安装，那Web总该可以吧，如果我能在本地端模拟一个Web浏览器，通过爬取iCloud Web页面不断抽取相册下载到本地，那功能也就实现了。  
本着这个想法，去`Github`上搜索了一圈，看看有没有合适的库可以直接爬取`iCloud`，果然，和我有相同想法的人比较多，这里有一个Python实现的iCloud爬取引擎：[picklepete/pyicloud](https://github.com/picklepete/pyicloud)，直接clone下来看看，结果代码的photos引擎有点老了，现在的iCloud已经使用新的方式展示照片了，所以爬取照片出现了问题（不过现在这个repo已经修复了这个问题了，Python可以放心使用这个库）。  
既然这个库没办法满足，那就自己动手写一个吧，当然爬虫的首要套路是得先分析这个网站到底是怎么玩的，经过我的推理（Chorme dev工具...），发现iCloud现在已经采用新的API方式获取照片信息，具体套路如下（以下的方式都必须存储Cookie，这个不必多说，具体怎么实现有很多种方式）：
<!-- more -->
- 首先通过接口登陆iCloud（`https://setup.icloud.com/setup/ws/1/accountLogin`），传递appid和password。
- 如果需要二次验证，通过（`https://setup.icloud.com/setup/ws/1/validateVerificationCode`）传递发送到手机上的验证码，进行二次验证。
- 如果二次验证过后，再次登录拿到Cookie Token，到这里你已经拿到通行证书了，可以访问iCloud大部分信息了。
- 通过调用接口地址拿到照片相册信息，通过对相册信息的解析取得URL，这里你就可以通过URL来直接GET图片了。

上面第一到三步骤好说，第四个步骤的接口地址是第三个步骤取得的返回信息解析得到的，当前iCloud版本具体URL在`webservices`这个节点下面，注意，这个节点下面的`photos webservice`现在已经没办法用了，现在的iCloud照片的具体访问方式是采用`ckdatabasews`这个接口，通过一种类似`database query`的方法来获取照片信息（不知道是否以后会加入更多的信息获取）。  
为了避免麻烦，这里直接把`ckdatabasews`这个接口地址列举出来，总共就下面三个接口地址，每个地址的功能各不相同：

- `https://p26-ckdatabasews.icloud.com/database/1/com.apple.photos.cloud/production/private`：这个地址是ckdatabase query的根地址，所有的操作基本都是基于此。（下面ROOT为此根地址）
- `${ROOT}/records/query`：这个地址就是获取照片信息的主要查询接口，这个接口可以通过传递参数进行`filterBy`或者进行`orderBy`对返回的照片信息进行一个预操作，还能定义`startRank`和`resultsLimit`来对返回照片数量进行限定，当然也可以定义`desiredKeys`来定义需要返回的照片参数字段。
- `${ROOT}/internal/records/query/batch`：这个接口有点特殊，是通过`query`的方式获取数量，有点类似于`count`。

上面三个接口就可以完整的进行照片的查询操作，使用`batch`接口来获取照片信息，使用`query`接口来获取照片或者相册的信息，传入`startRank`和`resultsLimit`来获取定量照片（类似于分页查询），然后分析返回`json`获取URL地址来下载照片，整个流程就很清晰了。  
下面附上一些常用的查询关键字：

| 关键字         | 说明         |
| ------------- |:-------------|
| `CPLAssetInSmartAlbumByAssetDate:[Timelapse&Video&Slomo&Favorite&Panorama&Screenshot&Live]`     | 获取系统内建相片 |
| `CPLAssetDeletedByExpungedDate`      | 获取最进删除相册  |
| `CPLAssetHiddenByAssetDate` | 获取隐藏相册 |
| `CPLAlbumByPositionLive` | 获取相册信息 |
| `CPLContainerRelationNotDeletedByAssetDate:recordName` | 获取某个相册下的相片 |

这个基本上就是爬取iCloud的基本步骤了，具体实现可以参考[picklepete/pyicloud](https://github.com/picklepete/pyicloud)，现在已经有新的commit，可以放心使用，我自己也写了`Go`的实现版本[chenxuefei-pp/ccloudsync](https://github.com/chenxuefei-pp/ccloudsync)，计划实现了iCloud的功能再加上其他网盘的功能。
