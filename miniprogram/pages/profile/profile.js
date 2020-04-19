// miniprogram/pages/profile/profile.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },

  async onTapQRCode() {
    wx.showLoading({
      title: '生成中',
    });

    const res = await wx.cloud.callFunction({
      name: 'getQRCode'
    });
    wx.hideLoading();

    const fileId = res.result;

    wx.previewImage({
      urls: [fileId],
      current: fileId
    });
  }
})