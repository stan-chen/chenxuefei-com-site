---
title: TL-R473G折腾IPSec/L2TP连接公有云VPN
date: 2020-03-24 16:19:16
keywords: "VPN, l2tp, IPSec"
categories:
  - IPSec
tags:
  - 杂项
  - 运维
  - 服务器搭建
---

连接方式:

1. IPSec子网连接
2. 路由器客户端连接公有云VPN

前提条件:

1. 路由器必须有公网IP，可选配DDNS

<!-- more -->

话不多说，直接上配置（A端为云端，B端为本地路由器端）

A端：

```
os: Ubuntu 18.04.4 LTS (Bionic Beaver) 4.15.0-91-generic
ipsec: Linux strongSwan U5.6.2/K4.15.0-91-generic
```

B端: TL-R473G

## IPSec子网连接，这种方式连接两个内网互通

### A端设置

```conf
# /etc/ipsec.conf
config setup
        uniqueids=yes
        strictcrlpolicy=no
conn %default
        authby=psk
        type=tunnel
conn tunnel
        left=172.18.18.9    # 这个是阿里云VPC内网IP
        leftid=a.com        # 这个是绑定的公网域名
        leftsubnet=172.18.18.0/24   # 需要互通的内网网段
        right=b.com   # DDNS出来的本地公网域名
        rightid=b.com
        rightsubnet=10.12.12.0/0    # 本地需要互通的子网网段
        ike=aes256-sha1-modp1024    # IKE 阶段1设置，路由器设置什么这里填什么，否则协商不过
        esp=aes256-sha1     # ESP 阶段2设置，也要跟路由器设置相同
        # 下面是一些其他设置
        keyingtries=0
        ikelifetime=1h
        lifetime=8h
        dpddelay=30
        dpdtimeout=120
        dpdaction=restart
        auto=start
        keyexchange=ikev1   # 这里一定要填v1，473G只支持v1
```

```conf
# /etc/ipsec.secrets
a.com b.com : PSK 'qwertyuiop'  # 这里是预共享密钥，当然填any也可以
```

### B端设置

{% ossimg config-r473g-ipsec.png B端配置 %}

## B端连接A端L2TP/IPSec

### A端配置

```conf
# /etc/xl2tpd/xl2tpd.conf
[global]
port = 1701     # 绑定的VPN端口

[lns default]
ip range = 10.12.14.2-10.12.14.10   # 对端和本地虚拟子网
local ip = 10.12.14.1               # 本地虚拟子网IP
require chap = yes
refuse pap = yes
require authentication = yes
name = l2tpd
ppp debug = yes
pppoptfile = /etc/ppp/options.xl2tpd    # 拨号设置
length bit = yes
```

```conf
# /etc/ppp/options.xl2tpd
ipcp-accept-local
ipcp-accept-remote
require-mschap-v2
ms-dns 8.8.8.8      # DNS
ms-dns 8.8.4.4
noccp
auth
hide-password
idle 1800
mtu 1410
mru 1410
nodefaultroute
debug
proxyarp
connect-delay 5000
```

```conf
# /etc/ppp/chap-secrets
# Secrets for authentication using CHAP
# client	server	secret			IP addresses
xxxx        l2tpd   xxxxxx          *   # 这里是密码 B端通过这个来连接
```

```conf
# /etc/ipsec.conf
config setup
    uniqueids=no

conn l2tp-psk
    also=l2tp-psk-nonat

conn l2tp-psk-nonat
    authby=psk
    auto=add
    keyingtries=3
    rekey=no
    ikelifetime=8h
    keylife=1h
    type=transport
    left=%defaultroute
    leftid=a.com
    leftprotoport=17/1701
    right=%any
    rightprotoport=17/%any
    dpddelay=40
    dpdtimeout=130
    dpdaction=clear
    ike=3des-md5-modp1024
    esp=3des-md5
```

```conf
# /etc/ipsec.secrets
%any %any : PSK 'xxxxxxxx'  # 配置共享密钥
```

### B端设置

B端配置比较简单，直接设定就好了
