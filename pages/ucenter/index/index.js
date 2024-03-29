var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');

var app = getApp();

Page({
  data: {
    userInfo: {},
    userinfoinfo: '',
    route: '',
    auth: false,
    isAdmin: false,
    isSysAdmin:false,
    CorporateName: '',
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this
    //判断是否有授权
    try {
      var mobile = wx.getStorageSync('userInfo').mobile
      var status = wx.getStorageSync('userInfo').status
      var value = wx.getStorageSync('auth')
      if(mobile=='17512528181'||mobile=='18652974050'||mobile=='18652043832'){
        that.setData({
          isSysAdmin: true
        })
      }
      if (status == '1') {
        that.setData({
          isAdmin: true
        })
      }else{
        that.setData({
          isAdmin: false
        })
      }
      console.log(value)
      if (value) {
        that.setData({
          auth: true
        })
        // Do something with return value
      } else if (!value) {
        that.setData({
          auth: false
        })
      } else {
        try {
          wx.setStorageSync('auth', false)
        } catch (e) {}
      }
    } catch (e) {
      // Do something when catch error
    }
    let routee = getCurrentPages()
    console.log(routee[0].route)
    this.setData({
      route: routee[0].route
    })
    console.log(app.globalData)
  },
  onReady: function() {

  },
  onShow: function() {
    var mobile = wx.getStorageSync('userInfo').mobile
    var status = wx.getStorageSync('userInfo').status
    if (mobile == '17512528181' || mobile == '18652974050' || mobile == '18652043832') {
      this.setData({
        isSysAdmin: true
      })
    }
    if (status == 1) {
      this.setData({
        isAdmin: true
      })
    } else {
      this.setData({
        isAdmin: false
      })
    }
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');

    // 页面显示
    if (userInfo && token) {
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
    }

    this.setData({
      userInfo: app.globalData.userInfo,
      CorporateName: app.CorporateData.name
    });

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
  },
  goLogin() {
    let that = this
    try {
      wx.setStorageSync('auth', true)
    } catch (e) {}
    //缓存到本地已授权
    that.setData({
      auth: true
    })
    // that.getGoodsInfo()
    user.loginByWeixin().then(res => {
      console.log(res)
      that.setData({
        userInfo: res.result.data.user
      })
      wx.hideLoading()
      app.globalData.userInfo = res.result.data.user;
      app.globalData.token = res.result.data.WebAccessToken;
    })
  },
  bindGetUserInfo: function(e) {
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    if (e.detail.userInfo) {
      console.log("允许授权")
      // console.log(e.detail.userInfo)
      try {
        wx.setStorageSync('auth', true)
      } catch (e) {}
      //缓存到本地已授权
      that.setData({
        auth: true
      })
      // that.getGoodsInfo()
      user.loginByWeixin().then(res => {
        console.log(res)
        that.setData({
          userInfo: res.result.data.user
        })
        wx.hideLoading()
        app.globalData.userInfo = res.result.data.user;
        app.globalData.token = res.result.data.WebAccessToken;
      })
      //用户按了允许授权按钮
    } else {
      //用户按了拒绝按钮
      console.log("拒绝授权")
      that.setData({
        auth: false
      })
      try {
        wx.setStorageSync('auth', false)
      } catch (e) {} //缓存到本地未授权
      wx.hideLoading()
    }
  },
  jumpPage(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let userinfo = wx.getStorageSync("userInfo");
    let route = e.currentTarget.dataset.route
    if ((index != undefined) && userinfo.mobile == null) {
      wx.showToast({

        title: '请您先绑定手机',

        icon: 'none',

        duration: 2000 //持续的时间

      })
    } else {
      wx.navigateTo({
        url: route +"?index="+index,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  jumpOrderIndex(e) {
    let tab = e.currentTarget.dataset.index
    let route = e.currentTarget.dataset.route
    try {
      wx.setStorageSync('tab', tab);
    } catch (e) {

    }
    wx.navigateTo({
      url: route,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  exitLogin: function() {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })

  }
})