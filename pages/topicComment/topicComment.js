var app = getApp();
var util = require('../../utils/util.js');

var api = require('../../config/api.js');

Page({
  data: {
    comments: [],
    allCommentList: [],
    picCommentList: [],
    typeId: 0,
    valueId: 0,
    showType: 0,
    allCount: 0,
    hasPicCount: 0,
    allPage: 1,
    picPage: 1,
    size: 20
  },
  getCommentCount: function () {
    let that = this;
    util.request(api.CommentCount, { valueId: that.data.valueId, typeId: that.data.typeId}).then(function (res) {
      if (res.errno === 0) {

        that.setData({
          allCount: res.data.allCount,
          hasPicCount: res.data.hasPicCount
        });
      }
    });
  },
  getCommentList: function(){
    let that = this;
    util.request(api.CommentList, { 
      valueId: that.data.valueId, 
      typeId: that.data.typeId, 
      size: that.data.size,
      page: (that.data.showType == 0 ? that.data.allPage : that.data.picPage),
      showType: that.data.showType 
      }).then(function (res) {
      if (res.errno === 0) {

        if (that.data.showType == 0) {
          that.setData({
            allCommentList: that.data.allCommentList.concat(res.data.data),
            allPage: res.data.currentPage,
            comments: that.data.allCommentList.concat(res.data.data)
          });
        } else {
          that.setData({
            picCommentList: that.data.picCommentList.concat(res.data.data),
            picPage: res.data.currentPage,
            comments: that.data.picCommentList.concat(res.data.data)
          });
        }
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      typeId: options.typeId,
      valueId: options.valueId
    });
    this.getCommentCount();
    this.getCommentList();
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})