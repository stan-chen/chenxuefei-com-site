---
title: 2017年4月代码笔记
date: 2017-4-12 9:59:04
keywords: "代码, 笔记"
categories:
  - 代码笔记
tags:
  - Vue
  - Django
  - Docker
---

## 代码笔记 2017-4

> 该文档为编码中遇到的难题及其解决方案，特此记录。
<!-- more -->
---

## Vux部分

1 当 `npm install` 安装组件时候，`node-sass` 安装失败，无法下载`win32-x64-48_binding.node`
> 解决方案：

> 手动下载`win32-x64-48_binding.node`（任意方法，迅雷，wget，等等）

> 设定 `SASS_BINARY_PATH=/path/to/win32-x64-48_binding.node`

> 然后重新安装，就OK了。


2 当一个`sticky`组件嵌套一个`scroller`组件的时候，此时`scroller`组件的滑动
  出现问题，固定为屏幕宽度。

> 解决方案：

> 经过`Chrome`调试发现，由于`sticky`组件的需要，外部`div`的`style`必须为
> `style="position: fixed"`。

> 在此种定位情况下，当`scroller`组件外部`div`未加任何`style`的情况下，
> 外部父`div`的宽高值会自动被子`div`撑破，也就是外部父`div`的宽度值为子div
> （恰好是需要滑动的`div`宽度值，当然此值会比当前`viewport`大许多）。

> 这种情况下，外部的`scroller`组件的宽度值也同样被成撑破，倒置无法计算滑块的宽度，
> 解决办法很简单在外部`scroller`包括外部`div`上加上 `style="width:100%"`，外部`div`和
> `scroller`组件自动会将`width`定为`viewport`宽度，问题迎刃而解。

3 CommonJS `require()` 和 `import()` 的区别

> 解决：

4 Vue 使用v-for 报如下警告

    (Emitted value instead of an instance of Error)
    <tab-item v-for="item in tabList">:
	  component lists rendered with v-for should have explicit keys.
	  See https://vuejs.org/guide/list.html#key for more info.

> 解决：


## Python Django 部分

1 Django admin 后台中文化？

> 解决： 在settings.py中 添加 `LANGUAGE_CODE = 'zh-Hans'`

> 注意： `zh-Hans` 为标准中文简体，注意中间必须是 `-` 下划线在Windows下可以识别，但是Linux下不能识别

2 Django如何自定义manage.py命令？

> 只需要在app目录中新建 `management/commands` 目录，然后将命令文件放在里面，*PS:命令类必须继承自`django.core.management.base`*

3 Django如何本地化(`locale`)？

> 参看上面Django admin 后台中文化先将配置做好，然后在settings.py中添加

    LOCALE_PATHS = (
      os.path.join(BASE_DIR, 'locale'), #此处为本地化文件的目录
    )

> 然后执行`makemessages -l zh_Hans`将代码中处于 `gettext()` 或者    `_()` 块的字符串生成到`po`文件中，然后执行`compilemessages` 编译`po`文件，这样所有被代码块包围起来的字符串都将国际化。

4 `Django collectstatic` 命令

> 在`uwsgi`部署的时候，由于动静分离，动态`python`代码会被`nginx`转发到`uwsgi`端口，而静态文件需要 `alias` 到指定目录，这可能跟`runserver`不太一样，所以需要将`settings.py`中所有`STATICFILES_DIRS`中的文件输出到`STATIC_ROOT`目录中去，并且`nginx`指向`STATIC_ROOT`目录，这样就完成了动静分离`Nginx+Uwsgi`的`Django`服务器部署。

5 Django TimeZone 问题

> 当`settings.py` 中 `USE_TZ = True` 打开的时候，数据库存入值与程序获取的值不一样，因为这种模式下存入数据库的是UTC时间，`datetime`保存有两种时间，按我所理解一种绝对时间，一种相对(时区)时间，所以想要存入取出的时间没有差异，需要这样设置：

    TIME_ZONE = 'Asia/Chongqing' # 设定时区
    USE_TZ = False　 # 禁用TZ

6 Django 自定义站点名称

> 在admin.py中自定义 继承自 django.contrib.admin.AdminSite 的实例类替代原有的 django.contrib.admin.site ，然后在url中

     url(r'^admin/', admin.yoursiteadmin.urls),

>如果需要使用用户组等功能，添加：

    .register(
      django.contrib.auth.models.Group,
      django.contrib.auth.admin.GroupAdmin
      )
    .register(
      django.contrib.auth.models.User,
      django.contrib.auth.admin.UserAdmin
      )

7 如何重定义admin view页面

> 新建继承自 `django.contrib.admin.ModelAdmin` 的新类，然后在类中重载函数 `add_view` `change_view` 等等，最后别忘了 `register(model,ModelAdmin)`

8 Model 如何修改显示名称？

> 每个 `field` 中添加 `verbose_name` ,该参数就是展示名称

> `Meta` 类中 `verbose_name_plural` 为展示名称

> 重载 `__str__(self)` 为admin页面展示每条记录所用的名称(就不会显示 ...Object) 了

9 在Django Models 查询中采用自定义 复杂排序方式

> 解决：采用`objects.extra()`方法

> 在extra方法中，传入 select 参数可以自定义 select 数据 示例：

        MyModel.objects\
            .extra(select = {'my_select_data':'field1*100 + field2 / 3'})\
            .extra(order_by = ['-my_select_data']) 

        # 此时上面的my_select_data就为自定义字段的复杂算数形式，并且在接下来的
        # 查询链中可以使用这个参数当做排序依据

10

## Docker部分

1 Docker 部署文件只能使用当前Dockerfile目录下的资源，没有办法调用上层资源
> 解决：如果需要外部源代码资源怎么办，只需要安装git，然后采用git token的方式在dockerfile中定义即可将源代码提交到docker image

---
