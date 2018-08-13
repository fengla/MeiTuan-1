var app = getApp();
var server = require('../../utils/server');
Page({
	data: {
    //ctName : "",
    root: app.globalData.root,
    apps : [],
    refreshTime: '', // 刷新的时间 
    allPages: '',    // 总页数
    currentPage: 0,  // 当前页数（从0开始index）
    currentCT: 0,//当前ct
    currentCTName: "",//当前ct
    loadMoreData: '加载更多……',
    empty: "",
    themeColor: app.globalData.themeColor 
	},
	onLoad: function (options) {
    console.log("[debug]-myctpage-options:" + options.ctName)
    
    var userid = wx.getStorageSync('userid');
    var ctIdPara = options.ctId
    var ctNamePara = options.ctName

    console.log("[debug]-myctpage-ctId:"+ctIdPara);
    console.log("[debug]-myctpage-ctName:" + ctNamePara);

		var self = this;

    self.setData({
      currentCT: ctIdPara,
      currentCTName: ctNamePara
    })
		
    this.getData()
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
	},







  //start
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

    var userid = wx.getStorageSync('userid')
    ///var ctIdpara = self.data.currentCT;
    //console.log("[debug]ctIdPara:" + ctIdpara)
    var pageIndex = self.data.currentPage;
    var reqUrl = app.globalData.root + "/findFollowedAppsByCT"
    wx.request({
      url: reqUrl,
      data: {
        ctid: self.data.currentCT,
        userid: userid,
        curPage: pageIndex
      },
      success: function (res) {
        var dataModel = res.data;

        if (pageIndex == 0) { // 下拉刷新
          console.log("debug-before:" + res.data.content) //delete later
          self.setData({
            allPages: dataModel.totalPages,
            apps: res.data.content,
            hideHeader: true
          })
          console.log("self.apps:" + self.apps)
          console.log("self.data.apps:" + self.data.apps)
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
  //end



  
});

