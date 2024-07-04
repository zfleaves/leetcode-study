/*
 * @Author: your name
 * @Date: 2020-08-03 16:31:48
 * @LastEditTime: 2021-11-25 16:23:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\compoent\sporadicPurchase\config.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 初始化信息
    startInfo: {
      url: 'sporadicPurchase/getStartNode',
      parmasList: [
        {receive: 'sid', value: 'id'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 提交
    startSubmit: {
      url: 'sporadicPurchase/startSubmit'
    }
  },
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
      // 项目名称
      {show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64},
      // 单据编号
      {show: true, label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', maxlength: 32},
      // 零星采购原因
      {show: true, label: 'sporadicReimburse.sporadicPurchaseReason', prop: 'sporadicPurchaseReason', span: 8, formType: 'input', maxlength: 128},
      // 申请人
      {show: true, label: 'sporadicReimburse.applyUser', prop: 'applyUserName', span: 8, formType: 'input', maxlength: 32},
      // 申请日期
      {label: 'sporadicReimburse.applyDate', span: 8, formType: 'daterange-split',
            propStart: 'applyDateFrom', propEnd: 'applyDateTo',
            inputStatus: 'edit'}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [],
  isFooterShow: true,
  // 主表渲染参数
  mainTable: {
    rowKey: 'purchaseApplyId',
    //  多选
    isCheckbox: true,
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
      showColumnCtrl: true, // 显示/隐藏列
      refresh: false // 刷新
    },
    // 是否默认选中第一行
    defaultSeleFirstLine: false,
    // 子系统表头渲染参数
    tableList: [
      // 单据编号
      {show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', align: 'center'},
      // 项目名称
      {show: true, prop: 'projectName', label: 'fConfig.projectName'},
      // 项目编号
      {show: true, prop: 'projectCode', label: 'fConfig.projectCode', minWidth: '120'},
      // 零星采购原因
      {show: true, prop: 'sporadicPurchaseReason', label: 'sporadicReimburse.sporadicPurchaseReason'},
      // 预计采购金额
      {show: true, prop: 'estimatePurchaseAmount', label: 'sporadicReimburse.estimatePurchaseAmount', minWidth: '120', formType: 'setMoney', filterName: 'setMoney'},
      // 申请人
      {show: true, prop: 'applyUserName', label: 'sporadicReimburse.applyUser', minWidth: '80'},
      // 申请日期
      {show: true, filterName: 'date', prop: 'applyDate', label: 'sporadicReimburse.applyDate', minWidth: '120'}
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
