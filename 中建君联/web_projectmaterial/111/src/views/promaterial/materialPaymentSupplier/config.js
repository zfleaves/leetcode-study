/*
 * @Author: your name
 * @Date: 2020-07-30 10:43:33
 * @LastEditTime: 2022-10-22 09:53:50
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\paymentApply\config.js
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'labourPaymentSupplier',
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
      // 单据编号
      {
        show: true, label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input',
        clearable: true, inputStatus: 'edit', maxlength: 64
      },
      // 审批状态
      { show: true, label: 'fConfig.flowStatus', prop: 'flowStatus', span: 8, formType: 'flowStatus', clearable: true, inputStatus: 'edit' },
      // 合同名称
      {
        show: true, label: 'dialog.contractName', prop: 'contractName', span: 8, formType: 'input',
        clearable: true, inputStatus: 'edit', maxlength: 64
      },
      // 项目名称
      {
        show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input',
        clearable: true, inputStatus: 'edit', maxlength: 64
      },
      // 申请日期
      {
        label: 'fConfig.applyDate', span: 8, formType: 'daterange-split', clearable: true,
        propStart: 'applyDateFrom', propEnd: 'applyDateTo', inputStatus: 'edit'
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
      {show: true, prop: 'flowStatus', label: 'fConfig.flowStatus', formType: 'flowStatus', minWidth: '100', align: 'center'},
      // 单据编号
      {show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '180', fn: 'handleInfo', align: 'center'},
      // 合同名称
      {show: true, prop: 'contractName', label: 'dialog.contractName'},
      // 项目名称
      {show: true, prop: 'projectName', label: 'fConfig.projectName'},
      // 付款类型
      {show: true, prop: 'paymentValue', label: 'dialog.paymentValue', minWidth: '80'},
      // 申请付款金额
      {show: true, prop: 'applyPaymentAmount', label: 'fConfig.applyPaymentAmount', minWidth: '120', formType: 'setMoney', filterName: 'setMoney'},
      // 申请日期
      {show: true, filterName: 'date', prop: 'applyDate', label: 'fConfig.applyDate', minWidth: '100'},
      // 操作
      {show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '60',
      buts: [
        { name: 'button.info', class: '', fn: 'handleInfo', enable: true, noAuth: true}
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
