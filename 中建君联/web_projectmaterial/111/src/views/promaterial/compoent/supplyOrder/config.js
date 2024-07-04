/*
 * @Author: your name
 * @Date: 2020-08-03 09:12:11
 * @LastEditTime: 2021-11-09 14:02:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\compoent\checkArrival\config.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {},
  // 数据字典
  dictionary: [],
  // 接口数据
  selectList: [],
  // 搜索
  searchControls: {
    // 是否显示
    formShow: true,
    // 搜索使用插槽
    searchSlotShow: false,
    // 表单配置
    formList: [
      // 订单名称
      {show: true, label: 'checkArrival.supplyOrderName', prop: 'orderName', span: 24, formType: 'input', maxlength: 64, placeholder: 'checkArrival.orderNameTips'}
    ],
    // 是否显示重置按钮
    isReset: false
  },
  // 表格操作按钮
  mainOperateBtn: [],
  isFooterShow: false,
  // 主表渲染参数
  mainTable: {
    //  单选
    isRadio: true,
    // 表格数据
    tableData: [],
    // 表格高度
    maxHeight: 500,
    pageSize: 10,
    // 页码
    total: 0,
    // 是否显示分页
    paging: false,
    // 表头操作行配置
    tableHeader: {
      showColumnCtrl: false, // 显示/隐藏列
      refresh: false // 刷新
    },
    // 是否默认选中第一行
    defaultSeleFirstLine: false,
    // 子系统表头渲染参数
    tableList: [
      // 单据编号
      {show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', align: 'center'},
      // 订单名称
      {show: true, prop: 'orderName', label: 'checkArrival.supplyOrderName'},
      // 供应商名称
      {show: true, prop: 'supplierName', label: 'checkArrival.supplierName'},
      // 订单金额
      { show: true, prop: 'orderAmount', label: 'checkArrival.orderAmount', minWidth: '140', filterName: 'setMoney' },
      // 下单人
      { show: true, prop: 'releaseUserName', label: 'checkArrival.releaseUserName', minWidth: '100' },
      // 下单日期
      { show: true, prop: 'releaseDate', label: 'checkArrival.releaseDate', minWidth: '100', filterName: 'date' }
    ]
  }
};
class Page {
  constructor() {
    this.PageConfig = JSON.parse(JSON.stringify(PageConfig));
    this.init();
  }
  init () {
    Utils.commonUtil.getSelectList(this.PageConfig.selectList, this);
    Utils.commonUtil.getDicAllDataList(this.PageConfig.dictionary, this);
  }
}
export default Page;
