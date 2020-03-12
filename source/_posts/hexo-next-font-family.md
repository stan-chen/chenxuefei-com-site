---
title: "在Hexo nexT主题上字体添加多个的办法"
date: 2017-8-15 12:25:04
keywords: "字体, 美化"
categories:
  - 前端
tags:
  - Hexo
  - nexT
---

## 在Hexo nexT主题上字体添加多个字体的办法

该博客采用的是Pages + Hexo + nexT，但是在调整字体的时候发现，只能添加一个字体，如果添加多个备用字体有引号的话，yml解析就会报错，查阅源码后发现，`source/css/_variables/base.styl`文件中是这样获取config文件的字体变量的

```
get_font_family(config) {
  custom_family = hexo-config('font.' + config + '.family')
  // 在这里只处理了一个字体
  return custom_family is a 'string' ? custom_family : null
}
```

所以我设想如果在整个字体的前面加上一个引号，再让读取文件配置获取字体，就像这样,

```
global:
    # external: true will load this font family from host.
    external: true
    family: '"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei"'

```

再在styl文件中更改

```
get_font_family(config) {
  custom_family = hexo-config('font.' + config + '.family')
  // 在这里把引号去除
  return custom_family is a 'string' ? unquote(custom_family) : null
}
```

这样就添加了多个备用字体。

