---
title: "在自建Gitlab CE上搭建Pages服务"
date: 2017-8-15 8:59:04
keywords: "Gitlab"
categories:
  - 部署
tags:
  - Gitlab CE
  - Gitlab CI
  - Docker
---

在上一篇文章 {% post_link build-gitlab-ci 在自建Gitlab上搭建CI %} 简述了在自建Gitlab CE上搭建好了CI服务，本篇文章将简述如何在Gitlab CE服务上搭建Pages服务。

## 什么是Pages

1. 首先说说`Github-Pages`

    这里有详细描述 [什么是github-pages](https://help.github.com/articles/what-are-github-pages)

    简单的说，Github-Pages就是在Github代码库上直接托管静态网站，然后通过给定的链接进行访问，现阶段只能做到托管静态网站。

    Github-Pages 的基本流程是 
    
    > 创建代码库 ->  GitHub Pages选项选择分支号 -> 给定地址或者绑定自带的域名地址 -> 访问

    这样就可以直接访问托管到github上的静态资源了，还能选定主题，简单方便。

2. 再来说说`Gitlab-Pages`

    这里也有详细描述 [什么是gitlab-pages](https://docs.gitlab.com/ee/user/project/pages/index.html#gitlab-pages-documentation)

    跟Github-Pages没多大区别，不过gitlab需要先部署到CI上，然后再用给定域名访问托管的静态资源地址。

    也就是说需要先提交 `.gitlab-ci.yml` 到托管服务上，构建完成之后才可以访问。

3. 最后说说如何在自建Gitlab服务上搭建Pages

    还是有详细描述 [如何搭建gitlab-pages](https://docs.gitlab.com/ee/administration/pages/index.html)

    自己搭建pages服务那是一个复杂，因为涉及到DNS解析，并且如果只有一台服务器，还需要前端做nginx负载均衡，如果需要`HTTPS`服务，更是复杂，我在这里就以我自己的博客为例搭建一个非常简单不带`HTTPS`的Pages服务。

## 搭建Gitlab-Pages

按照官网document的定义，首先需要一个pages域名，这里假定为 a.io

1. 在DNS服务商进行泛域名解析，也就是说添加一条记录：
   
   > `*.a.io A b.b.b.b`
   
   > 添加泛域名解析A记录到你的Gitlab服务器公网地址，这样的话，每个用户就可以使用`username.a.io`访问他的pages地址

2. 在Gitlab服务器上修改`gitlab.rb`配置文件，大概在916行，修改为

    > `pages_external_url "http://a.io/"`

    > `gitlab_pages['enable'] = true`

    然后reconfigure服务，这样进入Admin页面，就会发现Gitlab服务已经启用pages服务

3. 新建代码库，如果想要默认pages主页，代码库的名称必须是`username.a.io`，在这里可以使用[plain-html sample](https://gitlab.com/pages/plain-html)来构建一个静态html页面，将代码拷贝进去，然后push之后，Gitlab后台CI Pipeline会开始构建这个静态页面，等待构建完成，就可以访问`http://username.a.io`来访问你的pages主页，如果不报404错误，则表示pages服务构建成功。

4. 还可以在`Setting -> Pages`中更改自定义domain，将自定义domain进行CNAME解析到pages域名。但是我并没有试验成功，可能我的服务器前端还部署了一个Nginx负载服务，域名解析不过来。