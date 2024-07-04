/*
 * @Author: wumaoxia 1805428335@qq.com
 * @Date: 2022-10-22 09:36:46
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @LastEditTime: 2022-10-22 11:45:42
 * @FilePath: \web_projectsubcontract\src\views\prosubcontract\supplierSettlementDeclaration\config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'materialSettlementDeclaration',
  processType: 'scenarioFlow',
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
      // 项目名称
      {
        show: true, label: 'dialog.projectName', prop: 'projectName', span: 8, formType: 'input',
        clearable: true, inputStatus: 'edit', maxlength: 64
      },
      // 单据编号
      {
        show: true, label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input',
        clearable: true, inputStatus: 'edit', maxlength: 32
      },
      // 审批状态
      { show: true, label: 'fConfig.flowStatus', prop: 'flowStatus', span: 8, formType: 'flowStatus', clearable: true, inputStatus: 'edit' },
      // 结算日期
      {
        label: 'dialog.settlementDate', span: 8, formType: 'daterange-split', clearable: true,
        propStart: 'settlementDateFrom', propEnd: 'settlementDateTo', inputStatus: 'edit'
      }
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [
    {isCustom: false, code: 'sysHandleScenarioFlowMonitor', noAuth: true}
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
      { show: true, prop: 'flowStatus', label: 'fConfig.flowStatus', formType: 'flowStatus', minWidth: '100' },
      // 单据编号
      { show: true, prop: 'docNo', label: 'fConfig.docNo', fn: 'handleInfo', minWidth: '180' },
      // 合同名称
      {show: true, prop: 'contractName', label: 'dialog.contractName'},
      // 项目名称
      { show: true, prop: 'projectName', label: 'dialog.projectName'},
      // 结算金额合计
      { show: true, prop: 'totalPriceTax', label: 'fConfig.totalCurrentPeriod', minWidth: '120', filterName: 'setMoney' },
      // 结算金额(不含税)
      { show: true, prop: 'totalAmount', label: 'fConfig.settlementAmount', minWidth: '140', filterName: 'setMoney' },
      // 发票金额
      { show: true, prop: 'invoiceTotalAmount', label: 'fConfig.expendInvoiceAmount', minWidth: '120', filterName: 'setMoney' },
      // 结算主要内容
      { show: true, prop: 'settlementContent', label: 'fConfig.settlementContent'},
      // 结算日期
      { show: true, filterName: 'date', prop: 'settlementDate', label: 'dialog.settlementDate', minWidth: '120' },
      // 操作
      {
        show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '60',
        buts: [
            { name: 'button.info', class: '', fn: 'handleInfo', enable: true, noAuth: true}
        ]
      }
    ]
  }
};
class Page {
  constructor() {
    this.PageConfig = JSON.parse(JSON.stringify(PageConfig));
    this.init();
  }
  init() {
    Utils.commonUtil.getSelectList(this.PageConfig.selectList, this);
    Utils.commonUtil.getDicAllDataList(this.PageConfig.dictionary, this);
  }
}
export default Page;
