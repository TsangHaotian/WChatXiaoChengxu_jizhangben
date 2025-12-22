let app = getApp();
Page({
  data: {
    activeTab:'0',//0支出，1收入
    activeType:'-1',
    bookId:'',
    bookTypeId:'',
    bookTypeList:[],//类型列表
    remark:'',//备注
    amt:'0.00',
    today:'',//今天日期
    selectDay:'',//选择的日期
    editFlag:false,//未修改
    remarkArr:{},//备注列表
    selectTypeRemarks:[],//选中类型的remark列表
  },
  onLoad: function (options) {
    this.initDate();
    if(options.id){
      this.setData({
        bookId:options.id,
        activeTab:options.tab
      });
    }
    this.getRemarkArr();
  },
  onShow: function () {
    if(this.data.bookId){
      this.getBookDetail(this.data.bookId);
    }
    this.initData();
  },
  initData(){//获取类型列表
    let _this = this;
    app.getAjax({
      url: 'getBookType',
      params: {
        type: _this.data.activeTab
      },
      success(res) {
        console.log("getBookType:", res);
        _this.setData({
          bookTypeList: res.result.data
        });
        if (_this.data.bookId != '' && _this.data.bookTypeId && _this.data.bookTypeList != -1){
          _this.setData({
            activeType: _this.getActiveType(_this.data.bookTypeId)
          });
        }
      }
    });
  },
  getBookDetail(id){//获取账单记录详情
    let bookList = app.getData('bookList');
    let book = bookList.find(item => item.id === id);
    if(book){
      let setDatas = {
        activeTab: book.amtType,
        amt: book.bookAmt+'',
        selectDay: book.bookYear + '-' + book.bookMonth + '-' + book.bookDate,
        remark: book.remark,
        bookTypeId:book.bookTypeId
      };
      if(this.data.bookTypeList.length){
        setDatas.activeType = this.getActiveType(book.bookTypeId)
      }
      setDatas.selectTypeRemarks = this.getRemarkByType(book.bookTypeId);
      this.setData(setDatas);
    }
  },
  initDate(){//初始化日期
    let date = new Date();
    let dateArr = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    ];
    let dateStr = dateArr.join('-');
    this.setData({
      today:dateStr,
      selectDay:dateStr
    });
  },
  selectBookType(e,idx){//选中类型
    let type = idx!=undefined?idx:e.currentTarget.dataset.idx;
    let remarkArr = [];
      let data = this.data;
    if(type == data.activeType){
      type = -1;
    }else{
      remarkArr = this.getRemarkByType(data.bookTypeList[type].id);
    }
    this.setData({
      activeType:type,
      selectTypeRemarks:remarkArr
    });
  },
  getRemarkByType(id) {//根据类型id获取相应备注
    let remarkArr = this.data.remarkArr;
    return remarkArr[id] ? remarkArr[id]:[];
  },
  setRemarkByTip(e){//选中提示的备注
    this.setData({
      remark: e.currentTarget.dataset.remark
    });
  },
  getActiveType(id){//获取选中类型的索引
    let list = this.data.bookTypeList;
    for(var key in list){
      if(list[key].id  == id){
        return key;
      }
    }
    return -1;
  },
  changeTab(e){//切换tab
    let type = e.currentTarget.dataset.type;
    if (type != this.data.activeTab){
      this.setData({
        activeTab:type,
        activeType:-1
      });
      this.initData();
    }
  },
  getRemarkArr(){//获取缓存的remark
    var remarkArr = wx.getStorageSync('remarks');
    if(!remarkArr){
      remarkArr = '{}';
    }
    this.setData({
      remarkArr: typeof remarkArr === 'object' ? remarkArr : JSON.parse(remarkArr)
    });
    console.log("getRemarkArr:", this.data.remarkArr)
  },
  saveBook(){//保存
    let _this = this;
    let data = this.data;
    if(data.activeType == -1 || data.amt == 0){
      return;
    }
    let date = app.getDateInfo(this.data.selectDay);
    let bookType = data.bookTypeList[data.activeType];
    let params = {
      amtType: data.activeTab,
      bookAmt:data.amt-0,
      bookDate:date.date,
      bookMonth:date.month,
      bookYear:date.year,
      week:date.week,
      remark:data.remark,
      bookTypeName: bookType.name,
      bookTypeIcon: bookType.icon || '',
      bookTypeId: bookType.id
    }
    if (data.remark) {
      let remarkArr = this.data.remarkArr;
      if (remarkArr[bookType.id]){
        if (remarkArr[bookType.id].indexOf(data.remark) == -1) {
          remarkArr[bookType.id].push(data.remark);
          this.setData({
            remarkArr:remarkArr
          });
          _this.setStorage('remarks', remarkArr);
        }
      }else{
        remarkArr[bookType.id] = [data.remark];
        this.setData({
          remarkArr: remarkArr
        });
        _this.setStorage('remarks', remarkArr);
      }
    }
    app.getAjax({
      url:'addBook',
      params:params,
      success(res){
        console.log("addBook:",res);
        wx.navigateBack();
      }
    });
  },
  setStorage(name,value){
    wx.setStorage({
      key: name,
      data: JSON.stringify(value)
    });
  },
  setRemark(e){//设置备注
    this.setData({
      remark:e.detail.value
    });
  },
  bindDateChange(e){//选择日期
    this.setData({
      selectDay:e.detail.value
    });
  },
  setAmt(e){//输入金额
    let val = e.currentTarget.dataset.val;
    switch(val){
      case '.':
        this.setDott();
        break;
      default:
        let amt = this.data.amt;
        let setDatas={};
        if(this.data.bookId && this.data.editFlag == false){
          amt = 0;
          setDatas.editFlag = true;
        }
        if(amt == 0){
          amt = '';
        }
        let amtArr = amt.split('.');
        if (amtArr.length == 2) {
          if (amtArr[1].length < 2){
            amt+=val;
          }
        }else{
          amt += val;
        }
        setDatas.amt = amt;
        this.setData(setDatas);
        break;
    }
  },
  delAmt(){//删除
    let amt = this.data.amt;
    amt = amt.substring(0,amt.length-1);
    if(amt == ''){
      amt = '0';
    }
    this.setData({
      amt:amt
    });
  },
  setDott(){//输入.
    let amt = this.data.amt;
    let setDatas={};
    if(this.data.bookId && this.data.editFlag==false){
      amt = '0.00';
      setDatas.editFlag = true;
    }
    if(amt == '0.00'){
      amt = '0.';
    }
    if(amt.indexOf('.')!=-1){
      return;
    }else{
      amt += '.';
    }
    setDatas.amt = amt;
    this.setData(setDatas);
  },
  setRemark(e){//输入备注
    this.setData({
      remark:e.detail.value
    });
  }
})