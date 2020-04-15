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

  methods: {
    /**
     * 获取用户信息
     */
    onGetUserInfo(event) {
      // 允许授权，event 会有 userInfo 数据
      const userInfo = event.detail.userInfo;
      console.log(event);
      
      if (userInfo) {
        this.triggerEvent('loginSuccess', userInfo); // 给父组件传用户数据
      } else {
        this.triggerEvent('loginFail');
      }
    }
  }
})
