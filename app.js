var server = require('./utils/server');
App({
	onLaunch: function () {
		console.log('App Launch')
		var self = this;
		var rd_session = wx.getStorageSync('rd_session');
    console.log("app.js.onLaunch.rd_session:"+rd_session)
    //getStorageSync: 从本地缓存中获取指定key的内容，后续把一些需要一直维护的内容都写在这里或者golballobalData(视情况而定)
		if (!rd_session) {//xcx中是这样判空的？
			self.login();
		} else {
			wx.checkSession({//wx.checkSession是什么操作？
				success: function () {
					// 登录态未过期
					console.log('登录态未过期')
					self.rd_session = rd_session;
					self.getUserInfo();
				},
				fail: function () {
					//登录态过期
					console.log('过期');
					self.login();
				}
			})
		}
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	},
	globalData: {
		hasLogin: false,
		cartList: [],
		userInfo: [],
    root: "http://localhost:8080",//"http://40e5c53b.ngrok.io",//
    wxapps: []

	},
	rd_session: null,
	login: function() {
		var self = this;
		// wx.login({
		// 	success: function (res) {
		// 		console.log('wx.login', res)
    //     server.getJSON('dwq/WxAppApi/setUserSessionKey.php', {code: res.code}, function (res) {
		// 			self.rd_session = res.data.rd_session;
		// 			self.globalData.hasLogin = true;
		// 			wx.setStorageSync('rd_session', self.rd_session);
		// 			self.getUserInfo();
    //     });//todo:请求服务端，获取rd_session， globalData.hasLogin（设置登录态）
    //     //然后这个怎么获取到的rd_session， globalData.hasLogin在后续逻辑中是怎么用的呢？
    //     //从微信服务器获取到的session_ID，openid,unionid有什么作用？
		// 	}
		// });
//todo: 这个rd_session应该就是我的设计中的token的意思，我这里先把这个变量名字变成token吧
    console.log("app.js.login_again")
    wx.login({
			success: function (res) {
				console.log('wx.login', res)

        self.getUserInfo();
        //然后这个怎么获取到的rd_session， globalData.hasLogin在后续逻辑中是怎么用的呢？
        //从微信服务器获取到的session_ID，openid,unionid有什么作用？
			}
		});
	},
	getUserInfo: function() {
		var self = this;
		// wx.getUserInfo({
		// 	success: function(res) {
		// 		self.globalData.userInfo = res.userInfo;
    //     //todo: start
		// 		server.getJSON('dwq/WxAppApi/checkSignature.php', {
		// 			rd_session: self.rd_session,
		// 			signature: res.signature,
		// 			raw_data: res.rawData
		// 		}, function (res) {
		// 			if (!res.data.is_pass) {
		// 				// TODO:验证有误处理
		// 				self.login();
		// 			}
		// 		});//todo: end 将getUserInfo获取到的数据传给服务端，失败了重新longin，成功了不作处理（成功了，这个接口在服务端做了什么操作呢？？）
		// 	}			
		// });
    wx.getUserInfo({
      success: function (res) {
        self.globalData.userInfo = res.userInfo;
        
        console.log(self.globalData.userInfo)
      }
    });
	}
})
