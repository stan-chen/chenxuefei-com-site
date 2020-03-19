---
title: 如何在KVM中模拟SSD磁盘
date: 2020-03-19 16:41:24
keywords: "VM, Disk ,SSD , KVM"
categories:
  - KVM
  - VM
tags:
  - KVM
  - 工作笔记
---

[转自](https://serverfault.com/questions/876467/how-to-add-virtual-storage-as-ssd-in-kvm)

Recent versions of QEMU (I tried with 2.12.0) support a rotation_rate parameter. If you set it to 1, the guest should treat the disk as an SSD. Currently, libvirt does not support this parameter in its XML format directly, so you have to pass it in as a qemu:commandline parameter.

Here are the relevant bits of a libvirt configuration that I use for an OSX guest:

```xml
<domain type='kvm' xmlns:qemu='http://libvirt.org/schemas/domain/qemu/1.0'>
  ...
  <devices>
    <disk type='block' device='disk'>
      <driver name='qemu' type='raw' cache='none' io='native' discard='unmap'/>
      <source dev='/dev/vg1/osx'/>
      <target dev='sda' bus='sata'/>
      <boot order='2'/>
      <address type='drive' controller='0' bus='0' target='0' unit='0'/>
    </disk>
    ...
  </devices>
  <qemu:commandline>
    ...
    <qemu:arg value='-set'/>
    <qemu:arg value='device.sata0-0-0.rotation_rate=1'/>
  </qemu:commandline>
</domain>

```

