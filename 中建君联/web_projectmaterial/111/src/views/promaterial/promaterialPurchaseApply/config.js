/*
 * @Author: your name
 * @Date: 2020-07-30 10:32:28
 * @LastEditTime: 2022-08-08 09:28:11
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\purchaseApply\config.js
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'purchasePurchaseApply',
  // 流程
  processParmas: {
    // 初始化信息
    startInfo: {
      url: 'promaterialPurchaseApply/getStartNode',
      parmasList: [
        {receive: 'sid', value: 'id'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 提交
    startSubmit: {
      url: 'promaterialPurchaseApply/startSubmit'
    }
  },
  // 数据字典
  dictionary: [
    {dicCode: 'purchaseMethod', propCode: 'purchaseMethodCode'}
  ],
  // 接口数据
  selectList: [],
  // 搜索
  searchControls: {
    // 是否显示
    formShow: true,
    // 搜索使用插槽
    searchSlotShow: true,
    // 表单配置
    formList: [
      // 项目名称
      {show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64},
      // 单据编号
      {show: true, label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', maxlength: 32},
      // 审批状态
      {show: true, label: 'fConfig.flowStatus', prop: 'flowStatus', span: 8, formType: 'flowStatus'},
      // 拟采购方式
      {show: true, label: 'promaterialPurchaseApply.purchaseMethodCode', prop: 'purchaseMethodCode', span: 8, formType: 'dicSelect'},
      // 申请人
      {show: true, label: 'promaterialPurchaseApply.applyUserName', prop: 'applyUserName', span: 8, formType: 'input', maxlength: 32},
      // 申请日期
      {label: 'promaterialPurchaseApply.applyDate', span: 8, formType: 'daterange-split',
            propStart: 'applyDateFrom', propEnd: 'applyDateTo',
            inputStatus: 'edit'},
      // 预计总金额
      {label: 'promaterialPurchaseApply.totalEstimateAmount', span: 8, formType: 'slot', prop: 'totalEstimateAmount',
            propStart: 'totalEstimateAmountFrom', propEnd: 'totalEstimateAmountTo', precision: 2, maxlength: 17,
            inputStatus: 'edit'}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [
    // 发标
    {isCustom: false, code: 'sysHandleAdd', authCode: 'create'},
    {isCustom: false, code: 'sysHandleStartProcess', authCode: 'startProcess'},
    {isCustom: false, code: 'sysHandleMonitorProcess', authCode: 'monitorProcess'},
    {isCustom: false, code: 'sysHandlePrint', authCode: 'print'}
  ],
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
    paging: true,
    // 表头操作行配置
    tableHeader: {
      showColumnCtrl: true, // 显示/隐藏列
      refresh: false // 刷新
    },
    // 是否默认选中第一行
    defaultSeleFirstLine: false,
    // 子系统表头渲染参数
    tableList: [
      // 审批状态
      {show: true, prop: 'flowStatus', label: 'fConfig.flowStatus', formType: 'flowStatus', minWidth: '100', align: 'center'},
      // 单据编号
      {show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', fn: 'handleInfo', align: 'center'},
      // 项目名称
      {show: true, prop: 'projectName', label: 'fConfig.projectName'},
      // 拟采购方式
      {show: true, prop: 'purchaseMethodValue', label: 'promaterialPurchaseApply.purchaseMethodCode', minWidth: '120'},
      // 申请人
      {show: true, prop: 'applyUserName', label: 'promaterialPurchaseApply.applyUserName', minWidth: '100'},
      // 申请日期
      {show: true, filterName: 'date', prop: 'applyDate', label: 'promaterialPurchaseApply.applyDate', minWidth: '120'},
      // 预计总金额
      {show: true, prop: 'totalEstimateAmount', label: 'promaterialPurchaseApply.totalEstimateAmount', minWidth: '120', filterName: 'setMoney'},
      // 拟采购内容
      {show: true, prop: 'purchaseContent', label: 'promaterialPurchaseApply.purchaseContent', minWidth: '120'},
      // 申请采购事由
      {show: true, prop: 'purchaseApplyReason', label: 'promaterialPurchaseApply.purchaseApplyReason'},
      // 操作
      {show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '100',
      buts: [
          {name: 'button.edit', class: 'warning', fn: 'handleEdit', authCode: 'update', isCreateBy: true},
          {name: 'button.delete', class: 'danger', fn: 'handleDelete', authCode: 'delete', isCreateBy: true}
      ]}
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
