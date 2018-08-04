var app = getApp();
var server = require('../../utils/server');
Page({
	data: {},
	onLoad: function () {
		var that = this
		//调用应用实例的方法获取全局数据
		app.getUserInfo(function(userInfo){
		//更新数据
		that.setData({
			userInfo: userInfo
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

    console.log("[debug]ctId")
    console.log(e.currentTarget.dataset)
    var userid = e.currentTarget.dataset.userid
    
    console.log("userid:" + userid)
    

    wx.navigateTo({//保留当前页面，跳转到应用内的某个页面
      url: '/page/myapp/myapp?userid=' + userid,//url里面就写上你要跳到的地址
    })
  }
});

