---
title: "微信小程序登录逻辑分析"
date: 2017-08-23 20:14:15
keywords: "微信, 小程序, 登录逻辑, 配置"
categories:
  - 微信开发
  - 小程序
tags:
  - wechat
  - app
  - login
---
# 微信小程序登录逻辑分析

最近闲来无事，尝试一下做个微信小程序demo，个人注册完成，拿到`APPID`，`APPSECRET`便开始开发。

微信小程序采用`Javascript`开发，看生成的代码感觉跟`VUE`有点类似，都是`Js`写逻辑然后编译成类似`H5`的页面。
<!-- more -->
但是，没过一会就开始懵逼了，生成的代码里面有一个`wx.getUserInfo`方法，开发文档里面有一个`wx.login`方法，本来以为`wx.login`这个方法就是在进入小程序的时候弹出授权窗口请求用户授权，不过在调试的时候发现其实是`wx.getUserInfo`方法才是弹出请求授权窗口，那这个`wx.login`方法究竟是干什么的呢？

## `wx.getUserInfo`和`wx.login`

[`wx.login`的文档在此](https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wxloginobject)

[`wx.getUserInfo`的文档在此](https://mp.weixin.qq.com/debug/wxadoc/dev/api/open.html#wxgetuserinfoobject)

根据文档，发现`wx.login`这个方法其实只是通过微信服务器，获取一个简单的`code`，这个`code`需要返回给**我们自己的服务器**，**我们自己的服务器**通过微信服务器的接口获取`session_key`，这个`session_key`就是为后续用户从微信服务器获取的关键数据(比如openid，unionid)进行解密的。

所以这个接口只是作为一个获取钥匙的角色，真正的拿到锁是通过`wx.getUserInfo`方法，这个方法获取用户的微信信息(昵称，省市)，如果加上`withCredentials`的话，就会获得机密信息，不过机密信息是加密的，不会在客户端上呈现，只能在**我们自己的服务器**上通过获取到的`session_key`来进行解密才能获取。

综上所述，整个微信的登录流程如下(照搬官网):

{% ossimg login.png 登录流程 %}

上图其实并没有做实际的登录(指登录到我们自己的登录系统)，只是在做微信登录流程，也就是获取一个微信钥匙的过程，实际的登录还是需要我们自己来做登录逻辑。

以上是我对微信小程序登录态的理解，如果后面有偏差再来修改吧。

最后附上我自己的登录态逻辑

```Javascript
//该函数通过用户code发送到服务器上获取session_key
const fetch_code = function() {
  return new Promise(function (resolve, reject){
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log('用户CODE获取成功,开始进行服务器获取OPENID');
          //发起网络请求
          wx.request({
            url: 'https://example.com/api/fetch_code',
            method: 'POST',
            data: {
              code: res.code
            },
            success: function (res) {
              var session_id = res.data.session_id;
              console.log('从服务器收到session_id:',session_id);
              wx.setStorageSync('session_id', session_id);
              resolve(session_id);
            },
            fail: function (res) {
              console.log(res);
              reject(res);
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
          reject();
        }
      },
      fail: function(err) {
        console.log('用户授权失败');
        reject(err);
      }
    });
  });
};

//该函数检测用户态是否过期，如果过期需要重新处理登录态
const check_session = function () {
  return new Promise(function(resolve, reject){
    wx.checkSession({
      success: function () {
        console.log('CODE未过期');
        //session 未过期，并且在本生命周期一直有效
        var session_id = wx.getStorageSync('session_id');
        if (!session_id){
          console.log('未找到session_id');
          return fetch_code().then(resolve).catch(reject);
        }
        return resolve(session_id);
      },
      fail: function () {
        //登录态过期
        console.log('CODE已经过期')
        return fetch_code().then(resolve).catch(reject);
      }
    });
  });
};

//我写的程序直接采用openid做pk登录，所以这里是实际的登录逻辑
const login = function () {
  return check_session().then(function(session_id){
    return new Promise(function(resolve,reject){
      //调用登录接口
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          console.log('现在开始进行登录')
          //发起网络请求
          wx.request({
            url: 'https://example.com/api/login',
            method: 'POST',
            data: {
              data: res,
              session_id: session_id
            },
            success: function (req_res) {
              if (req_res.data.status === 'OK'){
                console.log('返回OK');
                resolve( res );
              } else {
                console.log('返回FAILED');
                reject( req_res );
              }
            },
            fail: function (req_res) {
              reject( req_res );
            }
          });
        },
        fail: function(err){
          // 一定要考虑用户拒绝授权的状况
          console.log('用户拒绝授权')
          reject(err);
        }
      });
     });
  });

};

//导出函数
export { login }
```
