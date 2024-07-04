/*
 * @Author: your name
 * @Date: 2020-07-30 10:38:48
 * @LastEditTime: 2021-08-16 10:09:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\sporadicReimburse\config.js
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'purchaseSporadicReimburse',
  // 流程
  processParmas: {
    // 初始化信息
    startInfo: {
      url: 'sporadicReimburse/getStartNode',
      parmasList: [
        {receive: 'sid', value: 'id'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 提交
    startSubmit: {
      url: 'sporadicReimburse/startSubmit'
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
      // 报销内容
      {show: true, label: 'sporadicReimburse.reimburseContent', prop: 'reimburseContent', span: 8, formType: 'input', maxlength: 128},
      // 报销人
      {show: true, label: 'sporadicReimburse.reimburseUserName', prop: 'reimburseUserName', span: 8, formType: 'input', maxlength: 32},
      // 报销日期
      {label: 'sporadicReimburse.reimburseDate', span: 8, formType: 'daterange-split',
            propStart: 'reimburseDateFrom', propEnd: 'reimburseDateTo',
            inputStatus: 'edit'},
      // 是否取得发票
      {
        label: 'fConfig.ifAcquireInvoice', prop: 'ifAcquireInvoice', span: 8,
        formType: 'dicSelect', selectList: [
          {dataName: 'tips.yes', dataCode: 1},
          {dataName: 'tips.no', dataCode: 0}
        ], isTranslate: true
      }
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
      // 报销内容
      {show: true, prop: 'reimburseContent', label: 'sporadicReimburse.reimburseContent'},
      // 报销金额
      {show: true, prop: 'reimburseAmount', label: 'sporadicReimburse.reimburseAmount', minWidth: '100', formType: 'setMoney', filterName: 'setMoney'},
      // 实际支付金额
      {show: true, prop: 'actualPaymentAmount', label: 'sporadicReimburse.actualPaymentAmount', minWidth: '120', formType: 'setMoney', filterName: 'setMoney'},
      // 报销人
      {show: true, prop: 'reimburseUserName', label: 'sporadicReimburse.reimburseUserName', minWidth: '80'},
      // 报销日期
      {show: true, filterName: 'date', prop: 'reimburseDate', label: 'sporadicReimburse.reimburseDate', minWidth: '100'},
      // 支付日期
      {show: true, filterName: 'date', prop: 'paymentDate', label: 'sporadicReimburse.paymentDate', minWidth: '100'},
      // 是否取得发票
      {show: true, label: 'fConfig.ifAcquireInvoice', prop: 'ifAcquireInvoice', minWidth: '120', formType: 'slot', align: 'center' },
      // 操作
      {show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '180',
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
