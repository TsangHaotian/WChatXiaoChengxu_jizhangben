let app = getApp();
Page({
  data: {
    selectYear: '',
    selectMonth: '',
    date: '',          // YYYY-MM，用于月份选择器
    bookList: [],
    incomeAmt: '',
    payAmt: '',
    allMode: false     // 是否显示全部账单
  },
  onLoad: function (options) {
  },
  onShow: function () {
    let dateObj = app.getDateInfo();
    this.initData(dateObj.year, dateObj.month);
  },
  onLongPressBook(e){ // 长按删除账单
    const id = e.currentTarget.dataset.id;
    const _this = this;
    if(!id){
      return;
    }
    app.showModal('确定删除这条账单吗？', () => {
      app.getAjax({
        url: 'deleteBook',
        params: { id },
        success(res){
          // 删除成功后，重新刷新当前月份数据
          _this.initData(_this.data.selectYear, _this.data.selectMonth);
        }
      });
    });
  },
  goAddBook(){ // 跳转到记账页
    app.navigate('/pages/addBook/addBook');
  },
  initData(year,month){//初始化
    let _this = this;
    app.getAjax({
      url:'getUserBookList',
      params:{
        bookYear:year-0,
        bookMonth:month-0
      },
      success(res){
        console.log("getUserBookList:",res);
        let sortedBookList = _this.sortBookList(res.result.data);
        const m = month - 0;
        const monthStr = (m < 10 ? '0' + m : '' + m);
        const dateStr = year + '-' + monthStr + '-01'; // 确保符合 YYYY-MM-DD，供 picker 使用
        _this.setData({
          bookList: sortedBookList.sortData,
          incomeAmt:sortedBookList.incomeAmt,
          payAmt:sortedBookList.payAmt,
          selectYear:year,
          selectMonth:m,
          date: dateStr,
          allMode:false
        });
        console.log("bookList:",sortedBookList.sortData)
      }
    });
  },
  sortBookList(data){//格式化账单列表
    let dateArr = [],
        sortData = [],
        incomeAmt = 0,
        payAmt = 0;
    for(var key in data){
      let index = dateArr.indexOf(data[key].bookDate);
      let amtType = data[key].amtType;
      if (index == -1){
        dateArr.push(data[key].bookDate);
        sortData.push({
          date:data[key].bookDate,
          month:data[key].bookMonth,
          year:data[key].bookYear,
          week: ['日', '一', '二', '三', '四', '五', '六'][data[key].week],
          incomeAmt: amtType == '0' ? 0 : data[key].bookAmt,
          payAmt: amtType == '0' ? data[key].bookAmt : 0,
          list:[data[key]]
        });
      }else{
        if(amtType == 0){
          sortData[index].payAmt = (sortData[index].payAmt * 100 + data[key].bookAmt * 100) / 100;
        }else{
          sortData[index].incomeAmt =  (sortData[index].incomeAmt*100 + data[key].bookAmt*100)/100;
        }
        sortData[index].list.push(data[key]);
      }
      if(amtType == 0){
        payAmt += data[key].bookAmt;
      } else {
        incomeAmt += data[key].bookAmt;
      }
    }
    return{
      sortData:sortData,
      incomeAmt: parseInt(incomeAmt*100)/100,
      payAmt: parseInt(payAmt * 100) / 100
    }
  },
  selectDate(e){//选择日期
    console.log("selectDate:",e)
    let value = e.detail.value;
    value = value.split('-');
    this.initData(value[0], value[1]);
  },
  showAll(){ // 显示全部账单
    const allList = app.getData('bookList') || [];
    // 按年/月/日倒序排序
    const sortedRaw = allList.sort((a,b)=>{
      if (a.bookYear !== b.bookYear) return b.bookYear - a.bookYear;
      if (a.bookMonth !== b.bookMonth) return b.bookMonth - a.bookMonth;
      return b.bookDate - a.bookDate;
    });
    // 每条记录单独成一组，方便逐条查看
    let sortData = [];
    let incomeAmt = 0;
    let payAmt = 0;
    const weekMap = ['日', '一', '二', '三', '四', '五', '六'];
    sortedRaw.forEach(item=>{
      const amtType = item.amtType;
      sortData.push({
        date: item.bookDate,
        month: item.bookMonth,
        year: item.bookYear,
        week: weekMap[item.week],
        incomeAmt: amtType == '1' ? item.bookAmt : 0,
        payAmt: amtType == '0' ? item.bookAmt : 0,
        list: [item]
      });
      if(amtType == 0){
        payAmt += item.bookAmt;
      } else {
        incomeAmt += item.bookAmt;
      }
    });
    this.setData({
      bookList: sortData,
      incomeAmt: parseInt(incomeAmt*100)/100,
      payAmt: parseInt(payAmt * 100) / 100,
      selectYear:'全部',
      selectMonth:'全部',
      date:'',
      allMode:true
    });
  }
})