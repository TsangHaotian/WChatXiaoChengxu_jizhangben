//app.js
App({
  onLaunch: function () {
    this.globalData = {
      bookList: wx.getStorageSync('bookList') || [],
      bookType: wx.getStorageSync('bookType') || [
        {id: 1, name: '娱乐', type: '0', icon:'icon_01'},
        {id: 2, name: '电影', type: '0', icon:'icon_02'},
        {id: 3, name: '运动产品', type: '0', icon:'icon_03'},
        {id: 4, name: '户外活动', type: '0', icon:'icon_04'},
        {id: 5, name: '船票', type: '0', icon:'icon_05'},
        {id: 6, name: '其他', type: '0', icon:'icon_06'},
        {id: 7, name: '乒乓球', type: '0', icon:'icon_07'},
        {id: 8, name: '扑克牌', type: '0', icon:'icon_08'},
        {id: 9, name: '篮球', type: '0', icon:'icon_09'},
        {id: 10, name: '射箭', type: '0', icon:'icon_10'},
        {id: 11, name: '象棋', type: '0', icon:'icon_11'},
        {id: 12, name: '游泳', type: '0', icon:'icon_12'},
        {id: 13, name: '羽毛球', type: '0', icon:'icon_13'},
        {id: 14, name: '冰淇淋', type: '0', icon:'icon_14'},
        {id: 15, name: '蛋糕', type: '0', icon:'icon_15'},
        {id: 16, name: '米饭', type: '0', icon:'icon_16'},
        {id: 17, name: '汉堡', type: '0', icon:'icon_17'},
        {id: 18, name: '红酒', type: '0', icon:'icon_18'},
        {id: 19, name: '火锅', type: '0', icon:'icon_19'},
        {id: 20, name: '咖啡', type: '0', icon:'icon_20'},
        {id: 21, name: '面条', type: '0', icon:'icon_21'},
        {id: 22, name: '酸奶', type: '0', icon:'icon_22'},
        {id: 23, name: '啤酒', type: '0', icon:'icon_23'},
        {id: 100, name: '水费', type: '0', icon:'icon_100'},
        {id: 116, name: '工资', type: '0', icon:'icon_116'},
        {id: 156, name: '其他', type: '0', icon:'icon_156'}
      ]
    };
  },
  saveData(key, data) {
    wx.setStorageSync(key, data);
    this.globalData[key] = data;
  },
  getData(key) {
    return this.globalData[key] || [];
  },
  getAjax(opts){//模拟接口调用
    wx.showLoading({
      title: '加载中',
      mask:true,
    });
    
    setTimeout(() => {
      if(opts.success){
        opts.success(this.mockApi(opts.url, opts.params));
      }
      wx.hideLoading();
    }, 500);
  },
  
  mockApi(url, params) {
    switch(url) {
      case 'login':
        return {result: {openid: 'demo_user'}};
      case 'getUserBookList':
        return {result: {data: this.getBooksByMonth(params.bookYear, params.bookMonth)}};
      case 'addBook':
        return this.addBook(params);
      case 'deleteBook':
        return this.deleteBook(params.id);
      case 'getBookDetail':
        return {result: {data: [this.getBookById(params.id)]}};
      case 'editBook':
        return this.editBook(params);
      case 'getBookType':
        return {result: {data: this.globalData.bookType}};
      default:
        return {result: {data: []}};
    }
  },
  
  getBooksByMonth(year, month) {
    // 直接根据保存时的年份、月份字段筛选，避免对日字段做 Date 解析导致匹配失败
    return this.globalData.bookList.filter(book => {
      return book.bookYear == year && book.bookMonth == month;
    });
  },
  
  addBook(params) {
    let newBook = {
      ...params,
      id: Date.now().toString(),
      createTime: new Date().toISOString()
    };
    this.globalData.bookList.push(newBook);
    this.saveData('bookList', this.globalData.bookList);
    return {result: {data: newBook}};
  },
  
  deleteBook(id) {
    this.globalData.bookList = this.globalData.bookList.filter(book => book.id !== id);
    this.saveData('bookList', this.globalData.bookList);
    return {result: {msg: '删除成功'}};
  },
  
  getBookById(id) {
    return this.globalData.bookList.find(book => book.id === id) || {};
  },
  
  editBook(params) {
    let index = this.globalData.bookList.findIndex(book => book.id === params.id);
    if (index !== -1) {
      this.globalData.bookList[index] = {
        ...this.globalData.bookList[index],
        ...params
      };
      this.saveData('bookList', this.globalData.bookList);
      return {result: {data: this.globalData.bookList[index]}};
    }
    return {result: {msg: '编辑失败'}};
  },
  showModal(content,success,fail){//显示对话框
    wx.showModal({
      title: '提示',
      content: content,
      showCancel:fail?true:false,
      success(res) {
        if (res.confirm) {
          if(success){
            success();
          }
        } else if (res.cancel) {
          if(fail){
            fail();
          }
        }
      }
    });
  },
  navigate(url){//跳转
    wx.navigateTo({
      url: url,
    });
  },
  relaunch(url) {//跳转
    wx.reLaunch({
      url:url
    });
  },
  redirect(url) {//跳转
    wx.redirectTo({
      url: url,
    });
  },
  getDateInfo(dateStr){//获取日期的年月日星期，无dateStr默认获取今天的
    let date;
    if (dateStr){
      date = new Date(dateStr);
    }else{
      date = new Date();
    }
    return{
      year:date.getFullYear(),
      month:date.getMonth()+1,
      date:date.getDate(),
       week:date.getDay()
    }
  },
  changeFooter(e){//点击 底部按钮
    let url = e.currentTarget.dataset.url;
    if(e.currentTarget.dataset.method){
      this.navigate(`/pages/${url}/${url}`);
    }else{
      this.relaunch(`/pages/${url}/${url}`);
    }
  },
  rpxToPx(rpx,windowWidth){
    return rpx / 750 * windowWidth;
  },
  pxToRpx(px,windowWidth){
    return px * 750 / windowWidth;
  },
  globalData:{
    plan:{}
  }
})
