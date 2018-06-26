var app = getApp();
var server = require('../../utils/server');
Page({
	data: {
		filterId: 1,
		address: '广州天河大厦',
    banners: [],
		// banners: [
		// 	{
		// 		id: 3,
    //     img: 'http://si1.go2yd.com/get-image/0OBbeGP0i24',
    //     url: 'http://www.baidu.com',
		// 		name: '百亿巨惠任你抢'
		// 	},
		// 	{
		// 		id: 1,
    //     img: 'http://si1.go2yd.com/get-image/0OBbg2XMEi0',
    //     url: '/page/shop/shop?id=1',
		// 		name: '告别午高峰'
		// 	},
		// 	{
		// 		id: 2,
    //     img: 'http://si1.go2yd.com/get-image/0OBbjI2U62y',
    //     url: '/page/shop/shop?id=1',
		// 		name: '金牌好店'
		// 	}
		// ],
		icons: [
			[
				{
					id: 1,
					img: '/imgs/index/icon_1.jpg',
					name: '游戏',
          url: '/page/ctpage/ctpage'
				},
				{
					id: 2,
					img: '/imgs/index/icon_2.jpg',
					name: '社交',
					url: ''
				},
				{
					id: 3,
					img: '/imgs/index/icon_3.jpg',
					name: '视频',
					url: ''
				},
				{
					id: 4,
					img: '/imgs/index/icon_4.jpg',
					name: '工具',
					url: ''
				},
				{
					id: 5,
					img: '/imgs/index/icon_5.jpg',
					name: '图像',
					url: ''
				},
				{
					id: 6,
					img: '/imgs/index/icon_6.jpg',
					name: '教育',
					url: ''
				},
				{
					id: 7,
					img: '/imgs/index/icon_7.jpg',
					name: '健康',
					url: ''
				},
				{
					id: 8,
					img: '/imgs/index/icon_8.jpg',
					name: '出行',
					url: ''
				}
			],//第二页可以再放一些小众的分类
			[
				{
					id: 9,
					img: '/imgs/index/icon_9.jpg',
					name: '新商家',
					url: ''
				},
				{
					id: 10,
					img: '/imgs/index/icon_10.jpg',
					name: '免配送费',
					url: ''
				},
				{
					id: 11,
					img: '/imgs/index/icon_11.jpg',
					name: '鲜花蛋糕',
					url: ''
				},
				{
					id: 12,
					img: '/imgs/index/icon_12.jpg',
					name: '名气餐厅',
					url: ''
				},
				{
					id: 13,
					img: '/imgs/index/icon_13.jpg',
					name: '异国料理',
					url: ''
				},
				{
					id: 14,
					img: '/imgs/index/icon_14.jpg',
					name: '家常菜',
					url: ''
				},
				{
					id: 15,
					img: '/imgs/index/icon_15.jpg',
					name: '能量西餐',
					url: ''
				},
				{
					id: 16,
					img: '/imgs/index/icon_16.jpg',
					name: '无辣不欢',
					url: ''
				}
			]
		],
		shops: app.globalData.shops,
    root: app.globalData.root,
    wxapps: app.globalData.wxapps,
    apps:[]
	},
	onLoad: function () {
		var self = this;
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

    wx.request({
      url: 'http://localhost:8080/showHotApps?ct=99', success(res) {
        console.log("[debug]hotApps:" + res.data)
        self.setData({
          apps: res.data
        })
      }
    });

    //banners 重新请求出来???看看是否可以得到？？？这样可以吗？？？
    wx.request({
      url: 'http://localhost:8080/getBanners', success(res) {
        console.log("[debug]banners:" + res.data)
        self.setData({
          banners: res.data
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
	toCt: function (e) {
		// var self = this;
		// self.setData({
		// 	scrollIntoView: 'nearby'
		// });
		// self.setData({
		// 	scrollIntoView: null
		// });

    console.log("[debug]ctId")
    console.log(e.currentTarget.dataset)
    var ctId = e.currentTarget.id
    var ctName = e.currentTarget.dataset.ctname
    console.log("ctId:"+ctId)
    console.log("ctName:"+ctName)
    
    wx.navigateTo({//保留当前页面，跳转到应用内的某个页面
      url: '/page/ctpage/ctpage?ctId=' + ctId +'&&ctName=' + ctName,//url里面就写上你要跳到的地址
    })
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

    var bannerId = e.currentTarget.id
    //console.log("[debug]bannerId")
    //console.log(bannerId)
    //新需求：跳转到页面。学习：小程序跳转
    //单独设计一个Banner落地页。。。然后这个落地页面就是解析富文本的页面，直接解析富文本进行展现即可
    wx.navigateTo({//保留当前页面，跳转到应用内的某个页面
      url: '/page/shop/shop?id=' + bannerId,//url里面就写上你要跳到的地址
    })
	}
});

