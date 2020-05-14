---
title: 解决K8S中Pod无法跨节点通信的问题
date: 2020-05-14 09:41:24
keywords: "K8S, KUBERNETES"
categories:
  - KUBERNETES
tags:
  - 工作笔记
---

这是由于，采用kubeadm安装的时候，使用的命令并非默认命令，而是:
<!-- more -->
```
kubeadm init --pod-network-cidr=10.222.0.0/16
```
所以，K8S调度分发到每个NODE的时候分配的子网并不是默认的 `10.244.0.0/16`，但是当我们使用如下命令：
```
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```
安装`kube-flannel`网络插件的时候，使用的又是默认的`10.244.0.0/16`来进行`iptables`规则配置，就出现了，POD发出的IP包经过`iptables`转换之后无法到达对应的主机。

解决办法:

* `kubectl delete -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml`删除`flannel`插件。

* `wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml`将yml文件下载下来。

* 编辑yml中的`net-conf.json`字段，使其中的子网分配为你`kubeadm`初始化的子网地址。

* 重新应用`kubectl apply -f kube-flannel.yml`。
