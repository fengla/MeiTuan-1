var app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        //console.log("wx.getSetting:"+res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              //这里把userInfo设置到全局页面中来看看效果。。。。
              // wx.setStorageSync('rd_session', self.rd_session);
              app.globalData.userInfo = res.userInfo;
              //todo: 此处请求服务端，把getUserInfo数据存储到服务端
              //跳转主页
              //不需要保留当前页面，所以不用navigateTo，而是应该应其他的。。。。。
              wx.reLaunch({//保留当前页面，跳转到应用内的某个页面
                //如何做不保留当前页面，跳转到应用内的某个页面？
                url: '/page/index/index',
              })
            }
          })
          
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
  }
})