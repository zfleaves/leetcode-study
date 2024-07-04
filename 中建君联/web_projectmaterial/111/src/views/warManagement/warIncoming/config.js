/*
 * @Author: your name
 * @Date: 2020-07-30 10:35:11
 * @LastEditTime: 2021-08-10 17:16:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\warIncoming\config.js
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'warehouseIncoming',
  // 流程
  processParmas: {
    // 初始化信息
    startInfo: {
      url: 'warIncoming/getStartNode',
      parmasList: [
        {receive: 'sid', value: 'id'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 提交
    startSubmit: {
      url: 'warIncoming/startSubmit'
    }
  },
  // 数据字典
  dictionary: [
    {dicCode: 'incomingType', propCode: 'incomingTypeCode'}
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
      // 项目名称
      {show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64},
      // 单据编号
      {show: true, label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', maxlength: 32},
      // 审批状态
      {show: true, label: 'fConfig.flowStatus', prop: 'flowStatus', span: 8, formType: 'flowStatus'},
      // 供应商名称
      {show: true, label: 'warIncoming.supplierName', prop: 'supplierName', span: 8, formType: 'input', maxlength: 64},
      // 入库类型
      {show: true, label: 'warIncoming.incomingTypeCode', prop: 'incomingTypeCode', span: 8, formType: 'dicSelect', selectList: [], maxlength: 64},
      // 入库日期
      {label: 'warIncoming.incomingDate', span: 8, formType: 'daterange-split',
            propStart: 'incomingDateFrom', propEnd: 'incomingDateTo',
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
    {isCustom: false, code: 'sysHandlePrint', authCode: 'print'},
    {isCustom: false, code: 'sysHandleBatchPrint', authCode: 'print'},
    {isCustom: false, code: 'sysHandlePrintLabel', authCode: 'printLabel'}
  ],
  // 主表渲染参数
  mainTable: {
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
      { show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', fn: 'handleInfo', align: 'center' },
       // 主要入库材料
      { show: true, prop: 'mainMaterials', label: 'warIncoming.mainMaterials', minWidth: '160'},
      // 项目名称
      {show: true, prop: 'projectName', label: 'fConfig.projectName'},
      // 入库类型
      { show: true, prop: 'incomingTypeValue', label: 'warIncoming.incomingTypeCode'},
      // 计税合价
      {show: true, prop: 'totalPriceTax', label: 'warIncoming.totalPriceTax', minWidth: '100', filterName: 'setMoney'},
      // 供应商名称
      { show: true, prop: 'supplierName', label: 'warIncoming.supplierName', minWidth: '160'},
      // 入库办理人
      {show: true, prop: 'incomingAgentUserName', label: 'warIncoming.incomingAgentUserName', minWidth: '100'},
      // 入库日期
      {show: true, filterName: 'date', prop: 'incomingDate', label: 'warIncoming.incomingDate', minWidth: '100'},
      // 填写人
      { show: true, prop: 'createByName', label: 'fConfig.createByName'},
      // 填写日期
      { show: true, filterName: 'date', prop: 'createTime', label: 'fConfig.createTime', minWidth: '100' },
      // 是否已一键出库
      {show: true, prop: 'ifOneClickOutbound', label: 'warIncoming.ifOneClickOutbound', formType: 'dicSelect', align: 'center', minWidth: '120', selectList: [
        {dataCode: 1, dataName: 'tips.yes'},
        {dataCode: 0, dataName: 'tips.no'}
      ], isTranslate: true},
      // 操作
      {show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '160',
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
