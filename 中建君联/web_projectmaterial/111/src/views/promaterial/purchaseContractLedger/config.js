/*
 * @Author: your name
 * @Date: 2020-07-30 10:35:11
 * @LastEditTime: 2023-02-14 09:12:16
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\purchaseContractLedger\config.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    exportUrl: {
      url: 'purchaseContractLedger/getExportData'
    }
  },
  // 数据字典
  dictionary: [
    { dicCode: 'executionStatus', propCode: 'executionStatus' }
  ],
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
      // 合同名称
      {show: true, label: 'fConfig.contractName', prop: 'contractName', span: 8, formType: 'input', maxlength: 64},
      // 合同编号
      {show: true, label: 'dialog.contractCode', prop: 'contractCode', span: 8, formType: 'input', maxlength: 32},
      // 签订人
      {show: true, label: 'dialog.partyASignName', prop: 'signUserName', span: 8, formType: 'input', maxlength: 32},
      // 执行状态
      {
          show: true, label: 'dialog.executionStatus', prop: 'executionStatus', span: 8, formType: 'dicSelect', selectList: [],
          clearable: true, inputStatus: 'edit', multiple: true, collapseTags: true
      },
      // 项目名称
      {show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64},
      // 乙方单位
      {show: true, label: 'dialog.partyB', prop: 'partyBUnitName', span: 8, formType: 'input', maxlength: 64}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [
    {isCustom: true, icon: 'el-icon-reading', slot: false, type: 'primary', plain: false,
    code: 'handleInstructionsForUse', name: 'purchaseContractLedger.instructionsForUse', noAuth: true},
    {isCustom: false, code: 'sysHandleMonitorProcess', authCode: 'monitorProcess'},
    {isCustom: false, code: 'sysHandleExport', authCode: 'export'}
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
      // 执行状态
      { show: true, prop: 'executionStatus', label: 'dialog.executionStatus', minWidth: '100', formType: 'slot' },
      // 合同编号
      {show: true, prop: 'contractCode', label: 'dialog.contractCode', minWidth: '160', fn: 'handleInfo', align: 'center'},
      // 项目名称
      {show: true, prop: 'projectName', label: 'fConfig.projectName'},
      // 合同名称
      {show: true, prop: 'contractName', label: 'fConfig.contractName'},
      // 乙方单位
      {show: true, prop: 'partyBUnitName', label: 'dialog.partyB'},
      // 签订金额
      {show: true, prop: 'signAmount', label: 'purchaseContractLedger.signAmount', formType: 'setMoney', minWidth: '120', filterName: 'setMoney'},
      // 结算金额
      {show: true, prop: 'totalSettlementAmount', label: 'purchaseContractLedger.totalSettlementAmount', minWidth: '120', formType: 'setMoney', filterName: 'setMoney'},
      // 收票金额
      {show: true, prop: 'totalInvoiceAmount', label: 'purchaseContractLedger.totalInvoiceAmount', minWidth: '120', formType: 'setMoney', filterName: 'setMoney'},
      // 已付金额
      {show: true, prop: 'totalPaymentAmount', label: 'purchaseContractLedger.totalPaymentAmount', minWidth: '120', formType: 'setMoney', filterName: 'setMoney'},
      // 应付未付金额
      {show: true, prop: 'payable', label: 'purchaseContractLedger.payable', minWidth: '120', formType: 'setMoney', filterName: 'setMoney'},
      // 入库金额
      {show: true, prop: 'otherSubTotalAmount', label: 'purchaseContractLedger.otherSubTotalAmount', minWidth: '120', formType: 'setMoney', filterName: 'setMoney'},
      // 签订人
      {show: true, prop: 'signUserName', label: 'dialog.partyASignName', minWidth: '100'},
      // 签订日期
      {show: true, filterName: 'date', prop: 'signTime', label: 'dialog.signTime', minWidth: '100'}
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
