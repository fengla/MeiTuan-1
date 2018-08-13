var app = getApp();
var server = require('../../utils/server');
Page({
	data: {
    followCount: 0, //我关注的app数量
    themeColor: app.globalData.themeColor 
  },
	onLoad: function () {
    //请求服务端获取用户关注的app数量
    var self = this;
    var userid = wx.getStorageSync('userid')
    var reqUrl = app.globalData.root + "/findFollowedAppsCount?userid=" + userid
    wx.request({
      url: reqUrl,
      success(res) {
        var count = res.data
        console.log("[debug]followedAppsCount:" + count)
        self.setData({
          followCount: count //res.data是返回的res的内容主体
        })
      }
    });


		var that = this
		//调用应用实例的方法获取全局数据
		app.getUserInfo(function(userInfo){
		//更新数据
		that.setData({
			userInfo: userInfo,
      followCount: followCount
		});
		that.update();
		console.log(userInfo)
		});
	},
	onShow: function () {
		this.setData({
			userInfo: app.globalData.userInfo
		});
		console.log(this.data.userInfo);
	},

  toMyApp: function (e) {
    //总结：关于dataset的用法
    //console.log("[debug]ctId")
    //console.log(e.currentTarget.dataset)
    //var userid = e.currentTarget.dataset.userid
    wx.navigateTo({//保留当前页面，跳转到应用内的某个页面
      url: '/page/myapp/myapp'
    })
  },

  toFeedback: function(e) {
    wx.navigateTo({//保留当前页面，跳转到应用内的某个页面
      url: '/page/feedback/feedback'
    })
  }, 

  toShareSwitch: function (e) {
    wx.navigateTo({//保留当前页面，跳转到应用内的某个页面
      url: '/page/shareswitch/shareswitch'
    })
  }
});

