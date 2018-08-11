var server = require('./utils/server');
App({
	onLaunch: function () {
		console.log('App Launch')
		var self = this;
		var token = wx.getStorageSync('token');//这样子直接校验token会有问题，永远不会重新登录
    console.log("app.js.onLaunch.token:"+token)
    //getStorageSync: 从本地缓存中获取指定key的内容，后续把一些需要一直维护的内容都写在这里或者golballobalData(视情况而定)
		if (!token) {//xcx中是这样判空的？
			self.login();
		} else {
      //当需要用户重新登录的时候可以操作一下这个。 important
      //wx.clearStorageSync('token')
			
      wx.checkSession({//验证session_key是否有效
				success: function () {
					// 登录态未过期
					console.log('登录态未过期')
					self.token = token;
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
		cartList: [],
		userInfo: [],
    root: "http://154.8.140.202:8080",//"http://localhost:8080",//"http://154.8.140.202:8080",//"http://bb4423cb.ngrok.io",
    wxapps: [],
    token: null,
    userid: null
	},
	token: null,
	login: function() {
		var self = this;
		wx.login({
			success: function (res) {
				console.log('wx.login', res)

                var reqUrlLogin = self.globalData.root + "/login?jscode=" + res.code
                wx.request({
                  url: reqUrlLogin,
                  success(res) {
                    var resp = res.data
                    console.log("resp:" + resp)
                    console.log("[debug]firstLogin:" + resp.firstLogin + ", token:" + resp.token + ", userid:" + resp.userid)
                    //这里是不是应该用那个setStorage啥的？
                    // self.globalData.token = resp.token;
                    // self.globalData.userid = resp.userid;
                    
                    

                    wx.setStorageSync('token', resp.token)
                    wx.setStorageSync('userid', resp.userid)
                    //version1: 仅仅对于第一次使用本程序的用户才请求用户画像
                    //基于firstLogin判断是否跳转login授权页面，进行授权获取用户getUserInfo()
                    // if(res.firstLogin){
                    //   wx.navigateTo({
                    //     url: '/page/login/login',
                    //     // success: function(res) {},
                    //     // fail: function(res) {},
                    //     // complete: function(res) {},
                    //   })
                    // }
                    
                    //version2:
                    //先请求getUserInfo,查看返回码，如果提示授权失败才进入授权页面（login.wxml），否则（即获取成功）应该可以直接拿到用户信息了
                    //不管是不是firstLogin都应该重新获取用户userInfo,并用新的数据来更新数据库中存储的用户画像。。。
                    self.getUserInfo();

                    //获取之后需要把这些数据再传给服务端，进行存储
                  }
                });
                //请求服务端, 返回结果需要包含：token, 是否为第一次登录

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
		// 			token: self.token,
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
        console.log("[success]wx.getUserInfo.res:" + res.userInfo.nickName)

        var nickName = res.userInfo.nickName
        var avatar = res.userInfo.avatarUrl
        var gender = res.userInfo.gender
		var location = res.userInfo.country + "_" + res.userInfo.province + "_" + res.userInfo.city
    console.log("[debug-getUserInfo]nickName"+nickName+", avatar:"+avatar+", gender:"+gender+", location:"+location)
        
        self.globalData.userInfo = res.userInfo;
        
        //console.log(self.globalData.userInfo)

        //todo:这里以post方式把以上数据传给服务端
          var reqUrl = self.globalData.root + "/updateUserInfo4wx"
          var userid = wx.getStorageSync('userid')
          console.log("yomi-test:" + userid)
          wx.request({//这是get请求还是post请求呢？
              url: reqUrl,
              method: 'POST',
              data: {
                userid: userid,
                nickName: nickName,
                avatar: avatar,
                gender: gender,
                location: location,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function(res) {
                  console.log(res)

              },
              fail: function(res){
                console.log(res)
              }
          })
      },
      fail:function(res){
        console.log("[fail]wx.getUserInfo.res:" + res)
      }
    });
	}
})
