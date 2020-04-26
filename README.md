# 微信小程序云音乐
> 使用微信小程序原生开发，包括云开发环境

### 云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

### 目录结构

- cloudfunctions 云函数目录
- miniprogram 小程序页面/组件/逻辑
- houtai-client 后台管理前端 ( Vue )
- houtai-server 后台管理后端 ( Node + Koa + 云开发 HTTP API )

### 涉及知识

播放器、云数据库、云存储、云函数、授权、云调用发送订阅消息、分享、Tcb-Router、HTTP API ......

### 屏幕截图

<p align="center">
  <img src="https://github.com/hanyucd/wx-minip-music/blob/master/screenshots/playlist.png" width="320" height="600" />
  <img src="https://github.com/hanyucd/wx-minip-music/blob/master/screenshots/music.png" width="320" height="600" />

  <img src="https://github.com/hanyucd/wx-minip-music/blob/master/screenshots/player.png" width="320" height="600" />
  <img src="https://github.com/hanyucd/wx-minip-music/blob/master/screenshots/blog.png" width="320" height="600" />

  <img src="https://github.com/hanyucd/wx-minip-music/blob/master/screenshots/comment.png" width="320" height="600" />
  <img src="https://github.com/hanyucd/wx-minip-music/blob/master/screenshots/play_history.png" width="320" height="600" />

  <img src="https://github.com/hanyucd/wx-minip-music/blob/master/screenshots/profile.png" width="320" height="600" />
</p>

