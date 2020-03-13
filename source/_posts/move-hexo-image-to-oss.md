---
title: "把Hexo Posts中的静态图片文件放入阿里云OSS做CDN加速"
date: 2017-08-17 19:34:24
updated: 2017-08-18 17:04:21
keywords: "nodejs, npm, aliyun, oss, 阿里云"
categories:
  - Javascript
tags:
  - Javascript
  - Hexo
---
# 关于如何把 **Hexo Posts** 中的静态图片文件放入阿里云OSS做CDN加速

## 1. 关于阿里云静态托管
<!-- more -->
现在网站的基本部署方式是采用私有的Gitlab CE + Gitlab Pages服务，所以注定了所有静态文件都得放在自己的服务器上，但是自己的服务器毕竟还是不能抗压，一旦服务器负载过高，网站就会变得迟缓。

为了解决上述问题，最佳办法当然是把所有静态文件放在阿里云OSS中，再用CDN加速，阿里云OSS最新更新了静态服务器的规则，可以指定根目录`index.html`和`404.html`，然后把OSS作为静态服务器来配置。

{% ossimg alioss-static.png 阿里静态服务器配置 %}

> 详情可以参考[配置OSS静态服务器](https://help.aliyun.com/document_detail/31872.html?spm=5176.8466029.static-page-info-block.1.2fa3fba4IEWYNn)。

这个出发点是好的，但是经过测试，阿里云OSS对于直接访问html文件的方式来启动静态服务器是可以做到的，但是通过目录来访问就会报资源异常的错误（有可能OSS只支持根目录的`index.html`访问，囧）。

所以，只能（现阶段，看阿里云以后更新）把目录交给服务器来返回，静态文件（`js`,`css`,`img`等）交给OSS来做CDN。

## 2. 关于如何实现

本人是`javascript`初学者，具体比较优雅的部署方式可能需要后面慢慢了解了`Hexo`原理后再说，现阶段的基本思路是，先把文章里的图片文件部署进OSS。

`Hexo`对定制化那是相当的优雅的，开发者可以开发插件，然后引用插件就可以实现自定义渲染或者部署。

经过查阅文档，`Hexo`支持自定义的`tag`，类似于在文章中这样写

```swig
<% asset_image slug.png title %>
```

所以我决定采用自定义的`tag`来确定文章中哪些需要放入`OSS`哪些需要放入服务器。

## 3. `Hexo`基本步骤

梳理了一下`Hexo`执行步骤，首先，`Hexo`有几个大的模块分别是

1. [`Box`模型](https://hexo.io/zh-cn/api/box.html)，这个模块主要处理文件，分为`source`和`theme`，也就是实现主题定制需求，这个模型需要配合`processor`模块来对文件进行处理。

1. `Processor`模块，主要负责处理文件，生成数据，这个数据是保存在`database`数据集里面的，这个数据为之后的渲染做工作，数据定义在`lib/models`中，基本需要处理的数据有`assets`,`post`,`post_assets`。

1. `Renderer`模块，根据模板生成`html`。

1. `Generator`模块，生成路由，根据生成的文件夹和其中的`html`等静态文件生成相对于根路径的路由，在此处调用`Renderer`模块进行模板渲染。

1. `Route`模块，路由其实就是一个`path`加一个`Stream`,路由生成以后，会将文件通过`Stream`写入目标路径，已达到静态路由的功能。

1. `Filter`模块，以我的理解，这是一个钩子，对生产中的各个步骤进行一个注册回调，当在某些时候进行什么操作，比如
    * `before_post_render`注册在渲染文章之前
    * `before_generate`注册在生成路由之前
    * `after_post_render`注册在渲染文章之后
    * `after_generate`注册在生成路由之后

那`tag`是在什么时候发生呢？应该是发生在`Process`这个步骤，生成数据。但是`tag`的发生步骤并不需要关心，因为只是注册一个回调而已。

## 4. 实现

根据上面的梳理，基本可以确定程序需要执行的步骤了

1. 首先，需要注册`tag`的回调，这个`tag`名称定为`ossimg`，然后，在`index.js`中注册这个回调。

    ```JavaScript
    hexo.extend.tag.register('ossimg', function(args){
      var slug = args.shift();
      if (!slug) return; 
      var asset = PostAsset.findOne({post: this._id, slug: slug});
      if (!asset) return;

      var title = args.length ? args.join(' ') : '';

      var alt = title || asset.slug;

      // 这里将此标签下的静态文件数据存储起来，方便拷贝操作 
      oss_img_list.push(asset);

      return '<img src="' + url.resolve(img_root, asset.path) + '" alt="' + alt + '" title="' + title + '">';
      // 在这里返回图片的cdn地址，img_root就是你的阿里云OSS公网路径
    }
    ```

1. 注册完`tag`需要在执行完毕之前将所有具有`tag`标签的图片拷贝至阿里云OSS，所以需要注册`filter`回调实现拷贝操作

    ```JavaScript
    hexo.extend.filter.register('after_generate', require('./processor')(hexo, oss_img_list) ); // 这里将oss_img_list传入，方便指定哪些需要拷贝
    ```

路径下的`processor.js`就是拷贝的实际操作了，只需要实现拷贝文件进阿里云就可以了。

现在只需要注册进`Hexo`就可以实现在构建的时候自动拷贝图片至阿里云OSS，并将图片路径定位至`CDN`地址。

该插件我已上传至Github和npmjs，直接安装：

```Bash
npm i hexo-tag-ossimg -S
```

最后附上[代码地址](https://github.com/chenxuefei-pp/hexo-tag-ossimg)
