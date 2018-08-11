var app = getApp();
//var server = require('../../utils/server');
Page({
	data: {
    
	},
	onLoad: function (options) {

	},

  onReady() {
    
  },

	onShow: function () {
    
	},
	onScroll: function (e) {
	
	},
	
  putFeedback: function (e) {
    //这里获取表单内容看看是否正确
    var feedback = e.detail.value.textarea
    var userid = wx.getStorageSync('userid')
    console.log("[debug-feedback]userid:" + userid + ", feedback:" + e.detail.value.textarea)    
    //请求服务端
    var reqUrl = app.globalData.root + "/followNews?userid=" + userid + "&&newsid=" + newsid
    wx.request({
      url: reqUrl,
      success(res) {
        console.log("[debug]follow succes, res:" + res.data)
        //todo:这里怎么修改一下控件后面展示的点赞数量呢？
        //当前策略：可以给里面这个控件增加一个data-id，一个data-value;然后针对这个id的控件设置内容为oldValue+1;并且修改一下那个icon的颜色
      }
    })

  }

});

