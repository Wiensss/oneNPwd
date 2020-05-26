<div align="center">
  <img
    alt="logo" width="250px" height="180px"
    src="https://6f6e-onen-pwd-1302122430.tcb.qcloud.la/readme/logo.png?sign=7e66585ba524255def6207a51124b9a4&t=1590469830"
  >
  <h1>oneNPwd</h1>
  <h5>个人随身密码本 • 微信小程序</h5>
  <p>🎈<em>密码本备忘录，支持主题切换，指纹验证、云端备份、同步功能。</em></p>
  <p align="center">
   <a href="https://github.com/Colasour/oneNPwd">
      <img src="https://img.shields.io/badge/MiniProgram-oneNPwd-ff69b4" alt="MiniProgram"/>
    </a>
    <img src="https://img.shields.io/badge/Android-7.0.13-9cf" alt="Android Version" />
    <img src="https://img.shields.io/badge/iOS-7.0.12-success" alt="iOS Version" />
    <a href="https://github.com/Colasour/oneNPwd/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/Colasour/oneNPwd?style=flat" alt="MIT license"/>
    </a>
  </p>
</div>

---

## 📟 开始

1. 修改根目录下 `project.config.json` 文件中的 `appid` 参数为自己的 AppID。

2. 云数据库中创建集合 `users`。

3. 修改 `client/app.js` 文件中初始化云环境的参数 `env` 为自己的云环境 ID：

<div align="center">
  <img alt="readme-1" width="178px" height="129px" src="https://6f6e-onen-pwd-1302122430.tcb.qcloud.la/readme/readme-1.png?sign=29684f02b556f9c39f0b4b52898e15e3&t=1590470095" />
</div>

## 🔔 更新日志

### [[1.0.1] - 2020-05-26](https://github.com/Colasour/oneNPwd/blob/master/CHANGELOG.md)

#### 修复

- 首次进入小程序的相关数据更新

#### 更新

- 首次授权、首次添加密码项引导动画背景透明度
- 首页底部固定按钮图标更换，新增阴影效果

## 🎯 说明

创建密码及查看密码时会进行加解密处理，本项目使用的是封装后的 cryptoJS 库。_关于 cryptoJS 的使用，具体可参考 [cryptoJS](https://cryptojs.gitbook.io/docs/#ciphers)。_

项目中具体调用函数为 `utils/util.js` 中的 `md5`，`encryptData`，`decryptData` 三个。

出于安全考虑，本项目对三者的实现细节进行了二次封装。运行时需要自己实现对应的函数。

如下示例可作为简单参考：

<div align="center">
  <img alt="readme-1" width="409px" height="497px" src="https://6f6e-onen-pwd-1302122430.tcb.qcloud.la/readme/readme-2.png?sign=6ab3ad57633d5e061c40d24e6b1f993f&t=1590471737" />
</div>

## 🎥 效果演示

<span>
  <img width="210px" src="https://6f6e-onen-pwd-1302122430.tcb.qcloud.la/readme/guide.gif?sign=def5b50ee660910228d60dc0dc0f9c12&t=1590473607" />
</span>
<span>
  <img width="210px" src="https://6f6e-onen-pwd-1302122430.tcb.qcloud.la/readme/theme.gif?sign=7142663d71c12c12203d98d9ae49e538&t=1590474216" />
</span>
<span>
  <img width="210px" src="https://6f6e-onen-pwd-1302122430.tcb.qcloud.la/readme/sync.gif?sign=4f827f36f6a86f5578bd13debbffb968&t=1590475427" />
</span>
<span>
  <img width="230px" src="https://6f6e-onen-pwd-1302122430.tcb.qcloud.la/readme/detail.gif?sign=bbba5fbc4b24457c81439e85ae3acf35&t=1590474626" />
</span>

## 📷 扫一扫

<div align="center">
  <img width="250px" src="https://6f6e-onen-pwd-1302122430.tcb.qcloud.la/readme/code.png?sign=213d4ee238f5a9de9cb56f2b7ea3cbaa&t=1590477192" />
</div>

## ⏳ 许可

- [MIT](https://github.com/Colasour/oneNPwd/blob/master/LICENSE)

## 🥤 联系我

<div align="center">
  <img width="100px" height="100px" src="https://6f6e-onen-pwd-1302122430.tcb.qcloud.la/mini/spaceman.jpg?sign=b3236397a76fa51e280c5ca0512b101e&t=1590476185" />
  <h5>📩Email: <em>Colasour.vince@gmail.com</em></h5>
</div>
