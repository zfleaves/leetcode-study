/*
 * @Author: your name
 * @Date: 2020-08-11 17:17:27
 * @LastEditTime: 2022-06-24 09:35:55
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\purchaseSettlement\config.js
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'purchaseSettlement',
  // 流程
  processParmas: {
    // 初始化信息
    startInfo: {
      url: 'purchaseSettlement/getStartNode',
      parmasList: [
        {receive: 'sid', value: 'id'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 提交
    startSubmit: {
      url: 'purchaseSettlement/startSubmit'
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
      // 审批状态
      {show: true, label: 'fConfig.flowStatus', prop: 'flowStatus', span: 8, formType: 'flowStatus'},
      // 合同名称
      {show: true, label: 'fConfig.contractName', prop: 'contractName', span: 8, formType: 'input', maxlength: 64},
      // 乙方单位
      {show: true, label: 'purchaseSettlement.supplierName', prop: 'supplierName', span: 8, formType: 'input', maxlength: 64},
      // 结算办理人
      {show: true, label: 'purchaseSettlement.settlementAgentUserName', prop: 'settlementAgentUserName', span: 8, formType: 'input', maxlength: 64},
      // 结算日期
      {label: 'purchaseSettlement.settlementDate', span: 8, formType: 'daterange-split',
            propStart: 'settlementDateFrom', propEnd: 'settlementDateTo',
            inputStatus: 'edit'}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [
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
      // 合同名称
      {show: true, prop: 'contractName', label: 'dialog.contractSporadicPurchaseName', fn: 'handleContractInfo'},
      // 主要结算内容
      {show: true, prop: 'settlementContent', label: 'purchaseSettlement.settlementContent'},
      // 乙方单位
      {show: true, prop: 'supplierName', label: 'purchaseSettlement.supplierName'},
      // 本期价税合计
      { show: true, prop: 'totalPriceTax', label: 'fConfig.totalCurrentPeriod', minWidth: '120', formType: 'setMoney', filterName: 'setMoney'},
      // 发票金额
      { show: true, prop: 'relationInvoiceAmount', label: 'fConfig.expendInvoiceAmount', minWidth: '120', filterName: 'setMoney' },
      // 结算办理人
      {show: true, prop: 'settlementAgentUserName', label: 'purchaseSettlement.settlementAgentUserName', minWidth: '100'},
      // 结算日期
      {show: true, filterName: 'date', prop: 'settlementDate', label: 'purchaseSettlement.settlementDate', minWidth: '120'},
      // 操作
      {show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '160',
      buts: [
          // 关联发票
          { name: 'button.relationInvoice', class: 'warning', fn: 'handleRelationInvoice', authCode: 'relationInvoice', isFlowStatus: true },
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
