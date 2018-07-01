var app = getApp();
var server = require('../../utils/server');
Page({
	data: {
    ctName : "",
    feeds : [
      {
        content:"反正也看不到脸，随便脱，不丢人！不过我想知道，到底是男还是女的",
        img:"http//i1.go2yd.com/image.php?url=0JP5JxZvA3"
      },
      {
        content: "反正也看不到脸，随便脱，不丢人！不过我想知道，到底是男还是女的",
        img: "http//i1.go2yd.com/image.php?url=0JP5JxZvA3"
      },
      {
        content: "反正也看不到脸，随便脱，不丢人！不过我想知道，到底是男还是女的",
        img: "http//i1.go2yd.com/image.php?url=0JP5JxZvA3"
      }]
	},
	onLoad: function (options) {
    //todo: options是从param参数中获取数据吗？？？
    // console.log("[debug]-ctpage-options:" + options.ctName)
    // var ctIdPara = options.ctId
    // var ctNamePara = options.ctName


    //请求feed流数据
    //初始请求15条数据，cur=0这个应该是倒叙的index=0,其实也就是系统中最近插入的数据
    wx.request({
      url: 'http://localhost:8080/getFeeds?cur=0&limit=15', success(res) {
        console.log(res.data)
        self.setData({
          feeds: res.data
        })
      }
    });
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

