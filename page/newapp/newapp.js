var app = getApp();
var server = require('../../utils/server');
Page({
	data: {
    ctName : "",
    feeds : [],
    hideHeader: true,
    hideBottom: true,
    refreshTime: '', // 刷新的时间 
    allPages: '',    // 总页数
    currentPage: 0,  // 当前页数  默认是1
    loadMoreData: '加载更多……',
    empty:"" 
	},
	onLoad: function (options) {
    var self = this
    //todo: options是从param参数中获取数据吗？？？
    // console.log("[debug]-ctpage-options:" + options.ctName)
    // var ctIdPara = options.ctId
    // var ctNamePara = options.ctName

    var date = new Date();
    this.setData({
      refreshTime: date.toLocaleTimeString()
    })
    this.getData();

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
    var reqUrl = app.globalData.root + "/getNewsByPage" //js中单引号双引号扩起来的字符串是一样的吗？是js都认可这2种样式
    wx.request({
      url: reqUrl,
      data: {
        curPage: pageIndex
      },
      success: function (res) {
        var dataModel = res.data;
        // if (dataModel.showapi_res_code == 0) {
        //之前实际代码写在这里，可以实现基于返回码确定是否请求成功  
        // }
        if (pageIndex == 0) { // 下拉刷新
          self.setData({
            allPages: dataModel.totalPages,
            feeds: dataModel.content,
            hideHeader: true
          })
        } else { // 加载更多
          console.log('加载更多');
          var tempArray = self.data.feeds;
          tempArray = tempArray.concat(dataModel.content);
          self.setData({
            allPages: dataModel.totalPages,
            feeds: tempArray,
            hideBottom: true
          })
        }
      },
      fail: function () {

      }
    })
  },

  followNews: function (e) {
    //首先需要设置该icon图标颜色为红色，并将counter计数增加1
    //再请求服务端将这个点赞关系存储到服务端
    var userid = wx.getStorageSync('userid')
    var newsid = e.target.dataset.newsid
    console.log("followNews userid:" + userid + ", docid:" + newsid)

    //请求服务端
    var reqUrl = app.globalData.root + "/followNews?userid=" + userid +"&&newsid=" + newsid 
    wx.request({
      url: reqUrl,
      success(res) {
        console.log("[debug]follow succes, res:" + res.data)
        //todo:这里怎么修改一下控件后面展示的点赞数量呢？
        //当前策略：可以给里面这个控件增加一个data-id，一个data-value;然后针对这个id的控件设置内容为oldValue+1;并且修改一下那个icon的颜色
      }
    })

  },

  unFollowNews: function (e) {
    //首先需要设置该icon图标颜色为红色，并将counter计数增加1
    //再请求服务端将这个点赞关系存储到服务端
    var userid = wx.getStorageSync('userid')
    var newsid = e.target.dataset.newsid
    console.log("followNews userid:" + userid + ", docid:" + newsid)

    //请求服务端
    var reqUrl = app.globalData.root + "/unFollowNews?userid=" + userid + "&&newsid=" + newsid
    wx.request({
      url: reqUrl,
      success(res) {
        console.log("[debug]unFollow succes, res:" + res.data)
        //todo:这里怎么修改一下控件后面展示的点赞数量呢？
        //当前策略：可以给里面这个控件增加一个data-id，一个data-value;然后针对这个id的控件设置内容为oldValue+1;并且修改一下那个icon的颜色
      }
    })
  },
});

