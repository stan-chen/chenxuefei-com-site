---
title: "OpenWrt CubieTruck SD卡烧写步骤"
date: 2016-05-14 07:45:50
keywords: "CubieTruck"
categories:
  - 嵌入式
  - OpenWRT
tags:
  - 工作笔记
---

插入一张`sd`卡，大小`64Mb`就够了，当然，大一点也好。

把以下的`sdb`换成`sd`卡在`/dev`下的设备名字。

`fdisk /dev/sdb`

复制代码

然后进去后呢，这么输入（记得enter）：

```

d

1

d

2

d

3

d

4

d

n

p

1

2048

+30M

n

p

2

（直接换行）

（直接换行）

p

w

```

最后的w先不要输入，看下p出来的结果是不是这样：

```

Disk /dev/sdb: 504 MB, 504365056 bytes

16 heads, 61 sectors/track, 1009 cylinders, total 985088 sectors

Units = 扇区 of 1 * 512 = 512 bytes

Sector size (logical/physical): 512 bytes / 512 bytes

I/O size (minimum/optimal): 512 bytes / 512 bytes

Disk identifier: 0xcad4ebea



   设备 启动      起点          终点     块数   Id  系统

/dev/sdb1            2048       63487       30720   83  Linux

/dev/sdb2           63488      985087      460800   83  Linux

```

如果是，继续。

到bin/sunxi目录

`dd if=openwrt-sunxi-root.ext4 of=/dev/sdb2 bs=1M`

然后：

`mkfs.vfat /dev/sdb1`

拷贝uImage和dtb还有uEnv.txt，然后上板子开电，OK。

