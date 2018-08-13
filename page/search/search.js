var app = getApp();
var server = require('../../utils/server');
Page({
	data: {
		filterId: 1,
		searchWords: '',
		placeholder: '热搜app',
		shops: app.globalData.shops,
    themeColor: app.globalData.themeColor 
	},
	onLoad: function () {
		var self = this;
		
	},
	onShow: function () {
		//this.setData({
		//	showResult: false
		//});
	},
	inputSearch: function (e) {
		this.setData({
			searchWords: e.detail.value
		});
	},
	doSearch: function() {
		//获取input值
    //搜索请求后台
    //setData
    //下方的数据自然会重新加载
    console.log("搜索测试")
	},
	
});

