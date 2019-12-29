// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowPopup: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGetUserInfo(event) {
      const userInfo = event.detail.userInfo;
      if (userInfo) {
        this.triggerEvent('loginSuccess', userInfo); // 给父组件传用户数据
      } else {
        this.triggerEvent('onLoginFail')
      }
    }
  }
})
