// pages/blog-edit/blog-edit.js
const MAX_WORDS_NUM = 140; // 输入框文字最大的个数
let content = ''; // 输入的文字内容
let userInfo = {};  // 昵称、头像
const db = wx.cloud.database(); // 初始化数据库

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0, // 输入的文字个数
    footerBottom: 0, // 底部栏距离底部位置，为了不被键盘遮挡
    images: [], // 选择的图片
    MAX_IMG_NUM: 9 // 最大上传图片的个数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = options;
  },
  onInput(event) {
    let wordsNum = event.detail.value.length;
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${ MAX_WORDS_NUM }`;
    }
    this.setData({ wordsNum });
    content = event.detail.value;
  },
  /**
   * 获取焦点
   */
  onFocus(event) {
    this.setData({ footerBottom: event.detail.height });
  },
  /**
   * 失去焦点
   */
  onBlur() {
    this.setData({ footerBottom: 0 });
  },
  onChooseImage() {
    // 还能在选几张图片
    let maxImg = this.data.MAX_IMG_NUM - this.data.images.length;

    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      count: maxImg,
      success: res => {
        this.setData({
          // 保存图片资源的时候，不应该直接赋值，因为可能多次选择，要使用追加的方式
          images: [...this.data.images, ...res.tempFilePaths]
        });
      }
    });
  },
  /**
   * 全屏预览图片
   */
  onPreviewImage(event) {
    wx.previewImage({
      // 需要预览的图片的数组
      urls: this.data.images,
      // 当前要预览哪一张图片
      current: event.currentTarget.dataset.imgsrc
    });
  },
  /**
   * 删除图片
   */
  onDelImage(event) {
    const idx = event.currentTarget.dataset.index;
    this.data.images.splice(idx, 1);
    this.setData({ images: this.data.images });
  },
  /**
   * 点击发布，将文件上传云存储
   */
  send() {
    if (content.trim() === '') {
      wx.showModal({ title: '请输入内容', content: '' });
      return;
    }

    wx.showLoading({ title: '发布中', mask: true });
    
    let promiseArr = [];
    let fileIds = [];

    this.data.images.forEach(item => {
      let p = new Promise((resolve, reject) => {
        let suffix = /\.\w+$/.exec(item)[0]; // 文件扩展名(文件后缀)
  
        wx.cloud.uploadFile({
          // cloudPath 云路径。如果路径相同，后上传的文件会覆盖原文件
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
          filePath: item,
          success: res => {
            fileIds = [...fileIds, res.fileID];
            resolve();
          },
          fail: error => {
            console.error(error);
            reject();
          }
        });
      });
      promiseArr.push(p);
    });
    
    Promise.all(promiseArr)
      .then(res => {
        db.collection('blog').add({
          data: {
            ...userInfo, // 昵称、头像
            content, // 内容
            img: fileIds, // 图片fileID列表
            createTime: db.serverDate() // 创建时间，取服务端时间
          }
        }).then(res => {
          wx.hideLoading();
          wx.showToast({ title: '发布成功' });
          content = '';

          setTimeout(() => {
            // 返回博客页面，并刷新
            wx.navigateBack();
            const pages = getCurrentPages();
            const prevPage = pages[pages.length - 2]; // 获取上一级页面栈
            prevPage.onPullDownRefresh();
          }, 800);
        })
      })
      .catch(error => {
        wx.hideLoading();
        wx.showToast({ title: '抱歉，发布失败', icon: 'none' });
        console.log(error);
      });
  }
});