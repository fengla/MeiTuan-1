var app = getApp();
var server = require('../../utils/server');
Page({
	data: {
		filterId: 1,
		address: '广州天河大厦',
    banners: [],
    icons: [],
		shops: app.globalData.shops,
    root: app.globalData.root,
    wxapps: app.globalData.wxapps,
    apps:[],
    refreshTime: '', // 刷新的时间 
    allPages: '',    // 总页数
    currentPage: 0,  // 当前页数（从0开始index）
    loadMoreData: '加载更多……',
    empty: "",
    themeColor: app.globalData.themeColor
	},
	onLoad: function () {
    console.log("index.userinfo:" + app.globalData.userInfo.nickName)
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

    // var reqUrlHotApps = app.globalData.root + "/showHotApps"
    // wx.request({
    //   url: reqUrlHotApps, success(res) {
    //     console.log("[debug]hotApps:" + res.data)
    //     self.setData({
    //       apps: res.data
    //     })
    //   }
    // });
    //替换为：请求第一页热门app数据。。。。。。。。。。。。。。。。。。。。。。。。。。。。
    this.getData()

    //banners 重新请求出来???看看是否可以得到？？？这样可以吗？？？
    var reqUrlBanners = app.globalData.root + "/getBanners"
    wx.request({
      url: reqUrlBanners, success(res) {
        console.log("[debug]banners:" + res.data)
        self.setData({
          banners: res.data
        })
      }
    });

    //icons
    var reqUrlCts = app.globalData.root + "/getAllCts"
    wx.request({
      url: reqUrlCts, success(res) {
        console.log("[debug]Icons:" + res.data)
        self.setData({
          icons: res.data
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
		wx.navigateTo({url: '/page/search/search'});
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
	},


  /** 上下拉 */
  loadMore: function () {
    var self = this;
    // 当前页是最后一页
    if (self.data.currentPage == self.data.allPages) {
      self.setData({
        loadMoreData: '已经到顶'
      })
      return;
    }
    setTimeout(function () {
      console.log('上拉加载更多');
      var tempCurrentPage = self.data.currentPage;
      tempCurrentPage = tempCurrentPage + 1;
      self.setData({
        currentPage: tempCurrentPage,
        hideBottom: false
      })
      self.getData();
    }, 300);
  },
  // 下拉刷新
  refresh: function (e) {
    var self = this;
    setTimeout(function () {
      console.log('下拉刷新');
      var date = new Date();
      self.setData({
        currentPage: 0,
        refreshTime: date.toLocaleTimeString(),
        hideHeader: false
      })
      self.getData();
    }, 300);
  },
  // 获取数据  pageIndex：页码参数
  getData: function () {

    var self = this;
    var pageIndex = self.data.currentPage;
    var reqUrl = app.globalData.root + "/getLatestApps" //js中单引号双引号扩起来的字符串是一样的吗？是js都认可这2种样式
    wx.request({
      url: reqUrl,
      data: {
        curPage: pageIndex
      },
      success: function (res) {
        var dataModel = res.data;
        //console.log("resposne-debug:" + dataModel.content)
        // if (dataModel.showapi_res_code == 0) {
        //之前实际代码写在这里，可以实现基于返回码确定是否请求成功  
        // }
        if (pageIndex == 0) { // 下拉刷新
          self.setData({
            allPages: dataModel.totalPages,
            apps: dataModel.content,
            hideHeader: true
          })
        } else { // 加载更多
          console.log('加载更多');
          var tempArray = self.data.apps;
          tempArray = tempArray.concat(dataModel.content);
          self.setData({
            allPages: dataModel.totalPages,
            apps: tempArray,
            
          })
        }
      },
      fail: function () {

      }
    })
  },
  /** 上下拉 */
});

