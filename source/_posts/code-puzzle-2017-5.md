---
title: 2017年5月代码笔记
date: 2017-5-19 9:59:04
keywords: "代码, 笔记"
categories:
  - 代码笔记
tags:
  - Vue
  - Django
---

## 代码笔记 2017-5

## Vue

1. 如何将ogg MP3 等文件用webpack打包

```
    <img src="assets/logo.png">
    <audio src="assets/audio/zimu_a.mp3" autoplay loop>
```

> 对于前者，项目（使用最新版本的 webpack 项目模板创建的项目，简称“项目”）的默认 webpack 配置中已经为 png 文件设置了 loader，而对于后者，项目的默认 webpack 配置并没有为 mp3 文件设置 loader。

> 在仿照png图片文件的webpack配置添加ogg MP3的config后，与此同时，还需要为 .vue 添加如下转换属性选项，让 vue-loader 知道需要对 audio 的 src 属性的内容转换为模块，将下列代码添加到vue-loader.conf.js

    transformToRequire: {
        "audio": "src"
    }
    
> 问题解决


## Django

1. 使用`Q()`交并查询

    当我们需要进行复杂查询的时候，就可能在`filter`后面添加一长串`exclude`或者`filter`,程序越复杂，这个串越长，所以我们需要一个工具类进行简单的交并查询，`Q()`就是为此而生。

    当我们在查询的条件中需要组合条件时(例如两个条件“且”或者“或”)时。我们可以使用Q()查询对象。例如下面的代码:
    ```
    fromdjango.db.modelsimports Q
    q=Q(question_startswith="What")
    ```
 
    这样就生成了一个Q()对象，我们可以使用符号&或者|将多个Q()对象组合起来传递给filter()，exclude()，get()等函数。当多个Q()对象组合起来时，Django会自动生成一个新的Q()。例如下面代码就将两个条件组合成了一个:

    ```
    Q(question__startswith='Who') | Q(question__startswith='What')
    ```