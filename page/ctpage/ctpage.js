var app = getApp();
var server = require('../../utils/server');
Page({
	data: {
    ctName : "",
    root: app.globalData.root,
    apps : []
	},
	onLoad: function (options) {
    console.log("[debug]-ctpage-options:" + options.ctName)
    var ctIdPara = options.ctId
    var ctNamePara = options.ctName

    console.log("[debug]-ctpage-ctId:"+ctIdPara);
    console.log("[debug]-ctpage-ctName:" + ctNamePara);

		var self = this;

    self.setData({
      ctName: ctNamePara
    })
		// wx.getLocation({
		// 	type: 'gcj02',
		// 	success: function (res) {
		// 		var latitude = res.latitude;
		// 		var longitude = res.longitude;
		// 		server.getJSON('dwq/WxAppApi/location.php', {
		// 			latitude: latitude,
		// 			longitude: longitude
		// 		}, function (res) {
		// 			console.log(res)
		// 			if (res.data.status != -1) {
		// 				self.setData({
		// 					address: res.data.result.address_component.street_number
		// 				});
		// 			} else {
		// 				self.setData({
		// 					address: '定位失败'
		// 				});
		// 			}
		// 		});
		// 	}
		// });
    var reqUrl = app.globalData.root + "/getAppsByCT?ct=" + ctIdPara + "&&curPage=0"
    wx.request({
      url: reqUrl, success(res) {
        console.log("debug-before:" + res.data.content)
        self.setData({
          apps: res.data.content
        })
        console.log("self.apps:" + self.apps)
        console.log("self.data.apps:" + self.data.apps)
      }
    });
    //request是异步的，所以下面这一行日志不是在上面这些请求赋值打日志之后的行为
    console.log("debug-apps:" + this.data.apps)
	},

  onReady() {
    
  },

	onShow: function () {
    
	},
	onScroll: function (e) {
		if (e.detail.scrollTop > 100 && !this.data.scrollDown) {
			this.setData({
				scrollDown: true
			});
		} else if (e.detail.scrollTop < 100 && this.data.scrollDown) {
			this.setData({
				scrollDown: false
			});
		}
	},
	tapSearch: function () {
		wx.navigateTo({url: 'search'});
	},
	toNearby: function () {
		var self = this;
		self.setData({
			scrollIntoView: 'nearby'
		});
		self.setData({
			scrollIntoView: null
		});
	},
	tapFilter: function (e) {
		switch (e.target.dataset.id) {
			case '1':
				this.data.shops.sort(function (a, b) {
					return a.id > b.id;
				});
				break;
			case '2':
				this.data.shops.sort(function (a, b) {
					return a.sales < b.sales;
				});
				break;
			case '3':
				this.data.shops.sort(function (a, b) {
					return a.distance > b.distance;
				});
				break;
		}
		this.setData({
			filterId: e.target.dataset.id,
			shops: this.data.shops
		});
	},
	tapBanner: function (e) {
		// var name = this.data.banners[e.target.dataset.id].name;
		// wx.showModal({
		// 	title: '提示',
		// 	content: '您点击了“' + name + '”活动链接，活动页面暂未完成！',
		// 	showCancel: false
		// });

    //新需求：跳转到页面。学习：小程序跳转
    wx.navigateTo({//保留当前页面，跳转到应用内的某个页面
      url: '/page/shop/shop?id=1',//url里面就写上你要跳到的地址
    })
	}
});

