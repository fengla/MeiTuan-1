var WxParse = require('../../wxParse/wxParse.js');

var app = getApp();
var server = require('../../utils/server.js');
Page({
	data: {
    flag : true,
    root : app.globalData.root,
    detail:"-----多快好省，只为品质生活-----\n1. 新人大礼：新人专享188元大礼包 \n2. 专享特权：每日多款商品享受手机专享价 \n3. 正品行货：100％正品行货、全国联保 \n4. 闪电到货：211限时达、次日达、极速达、夜间配",
    themeColor: app.globalData.themeColor,
    app : [] 
    //加载页面的时候搜索出来app的具体信息。。。（主页不应该搜索出整个AppDTO而是应该封装一个最少字段的对象返回出来，而且应该在sql阶段就缩小返回的数据，不查那么多数据出来）
	},
	onLoad: function (options) {
		var appId = options.id;//因为index.xml中的是id而不是appId,这里需要与那里的名字一致
    var self =this
    //debug.wdf
    console.log(appId)
    var userid = wx.getStorageSync('userid')
    //ajax this.setData
		// this.setData({
		// 	shopId: shopId,
		// 	shop: shop
		// })
    var reqUrl = app.globalData.root + "/appDetail?appId=" + appId + "&&userid=" + userid
    console.log("reqUrl:" + reqUrl)
    wx.request({
      url: reqUrl, success(res) {
        console.log(res.data)
        var detailTmp = res.data.detail
        console.log("detailTmp:" + detailTmp)
        self.setData({
          app: res.data,
          detail: WxParse.wxParse('detail', 'html', detailTmp, self, 5) //这样子对吗？
        })
      }
    });
		
	},
	onShow: function () {
		this.setData({
			classifySeleted: 1
		});
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
	checkOrderSame: function(name){
		var list = this.data.cartList[this.data.shopId];
		for(var index in list){
			if(list[index].name === name){
				return index;
			}
		}
		return false;
	},
	tapAddCart: function (e) {
		var price = parseFloat(e.target.dataset.price);
		var name  = e.target.dataset.name;
		var img   = e.target.dataset.pic;
		var list  = this.data.cartList;
		var sortedList = [];
		var index;
		if(index = this.checkOrderSame(name)){
			sortedList = list[this.data.shopId][index];
			var num = list[this.data.shopId][index].num;
			list[this.data.shopId][index].num = num + 1;
		}
		else{
			var order = {
				"price" : price,
				"num" : 1,
				"name": name,
				'img':  img,
				"shopId": this.data.shopId,
				"shopName": this.data.shop.restaurant_name,
				"pay": 0,
			}
			list[this.data.shopId].push(order);
			sortedList = order;
		}
		this.setData({
			cartList: list,
			localList: server.filterEmptyObject(list)
		});
		this.addCount( sortedList);
	},
	tapReduceCart: function (e) {
		var name = e.target.dataset.name;
		var price = parseFloat(e.target.dataset.price);
		var list  = this.data.cartList;
		var index, sortedList = [];
		if(index = this.checkOrderSame(name)){
			var num = list[this.data.shopId][index].num
			if(num > 1){
				sortedList = list[this.data.shopId][index];
				list[this.data.shopId][index].num = num - 1;			
			}
			else{
				sortedList = list[this.data.shopId][index]
				list[this.data.shopId].splice(index, 1);
			}	
		}
		this.setData({
			cartList: list,
			localList: server.filterEmptyObject(list)
		});
		this.deduceCount(sortedList);
	},
	addCount: function (list) {
		var count = this.data.cart.count + 1,
			total = this.data.cart.total + list.price;
		total = Math.round(parseFloat(total));		
		this.saveCart(count, total);
	},
	deduceCount: function(list){
		var count = this.data.cart.count - 1,
			total = this.data.cart.total - list.price;
		total = Math.round(parseFloat(total));
		this.saveCart(count, total);
	},
	saveCart: function(count, total){
		total = Math.round(parseFloat(total));
		if(typeof total == null)
			total = 0;		
		this.setData({
			cart: {
				count: count,
				total: total
			}
		});
		wx.setStorage({
			key: 'orderList',
			data: {
				cartList: this.data.cartList,
				count: this.data.cart.count,
				total: this.data.cart.total,
			}
		})
	},
	follow: function (e) {
    //请求服务端，关注app
    var appid = e.target.dataset.appid;
    console.log("[debug-follow-appid]:" + appid)
    var userid = wx.getStorageSync('userid')
    var reqUrl = app.globalData.root + "/followApp"
    console.log("yomi-test:" + userid)
    wx.request({//这是get请求还是post请求呢？
      url: reqUrl,
      method: 'GET',
      data: {
        userid: userid,
        appid: appid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)

      },
      fail: function (res) {
        console.log(res)
      }
    })

    //this.setData({ flag: false })
		this.setData({
			followed: !this.data.followed,
      flag: false
		});
	},
  //隐藏弹出的二维码
  hide: function () {
    this.setData({ flag: true })
  },
  previewQrCode: function (e) {
    var qrcodeUrl = e.target.dataset.src
    console.log("qrcodeUrl:" + qrcodeUrl)
    wx.previewImage({
      urls: qrcodeUrl.split(',')
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错
    })
  },
	onGoodsScroll: function (e) {
		if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
			this.setData({
				scrollDown: true
			});
		} else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
			this.setData({
				scrollDown: false
			});
		}

		var scale = e.detail.scrollWidth / 570,
			scrollTop = e.detail.scrollTop / scale,
			h = 0,
			classifySeleted,
			len = this.data.shop.menu.length;
		this.data.shop.menu.forEach(function (classify, i) {
			var _h = 70 + classify.menu.length * (46 * 3 + 20 * 2);
			if (scrollTop >= h - 100 / scale) {
				classifySeleted = classify.id;
			}
			h += _h;
		});
		this.setData({
			classifySeleted: classifySeleted
		});
	},
	tapClassify: function (e) {
		var id = e.target.dataset.id;
		console.log(id);
		this.setData({
			classifyViewed: id
		});
		console.log(this.data.classifyViewed)
		var self = this;
		setTimeout(function () {
			self.setData({
				classifySeleted: id
			});
		}, 100);
	},
	showCartDetail: function () {
		this.setData({
			showCartDetail: !this.data.showCartDetail
		});
	},
	hideCartDetail: function () {
		this.setData({
			showCartDetail: false
		});
	},
});

