var app = getApp();
//var server = require('../../utils/server');
Page({
	data: {
    themeColor: app.globalData.themeColor
	},
	onLoad: function (options) {

	},

  onReady() {
    
  },

	onShow: function () {
    
	},
	onScroll: function (e) {
	
	},
	
  toDevShare: function (e) {
    wx.navigateTo({//保留当前页面，跳转到应用内的某个页面
      url: '/page/devshare/devshare'
    })
  },

  toUserShare: function (e) {
    wx.navigateTo({//保留当前页面，跳转到应用内的某个页面
      url: '/page/usershare/usershare'
    })
  }

});

