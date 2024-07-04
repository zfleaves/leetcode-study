/*
 * @Author: your name
 * @Date: 2020-07-30 10:35:11
 * @LastEditTime: 2023-02-20 15:28:48
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\warOutbound\config.js
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'warehouseOutbound',
  // 流程
  processParmas: {
    // 初始化信息
    startInfo: {
      url: 'warOutbound/getStartNode',
      parmasList: [
        {receive: 'sid', value: 'id'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 提交
    startSubmit: {
      url: 'warOutbound/startSubmit'
    }
  },
  // 数据字典
  dictionary: [
    {dicCode: 'outboundType', propCode: 'outboundTypeCode'}
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
      // 主要出库材料
      {show: true, label: 'warOutbound.mainOutboundMaterials', prop: 'mainOutboundMaterials', span: 8, formType: 'input', maxlength: 128},
      // 出库类型
      {show: true, label: 'warOutbound.outboundTypeCode', prop: 'outboundTypeCode', span: 8, formType: 'dicSelect', selectList: []},
      // 出库日期
      {label: 'warOutbound.outboundDate', span: 8, formType: 'daterange-split',
            propStart: 'outboundDateFrom', propEnd: 'outboundDateTo',
            inputStatus: 'edit'},
      // 领料单位
      {show: true, label: 'warOutbound.pickingUnitName', prop: 'pickingUnitName', span: 8, formType: 'input', maxlength: 64}

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
      {show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', fn: 'handleInfo', align: 'center'},
      // 出库类型
      {show: true, prop: 'outboundTypeValue', label: 'warOutbound.outboundTypeCode', minWidth: '100'},
      // 主要出库材料
      {show: true, prop: 'mainOutboundMaterials', label: 'warOutbound.mainOutboundMaterials', minWidth: '160'},
      // 领料单位
      {show: true, prop: 'pickingUnitName', label: 'warOutbound.pickingUnitName', formType: 'slot'},
      // 项目名称
      {show: true, prop: 'projectName', label: 'fConfig.projectName'},
      // 出库办理人
      {show: true, prop: 'outboundAgentUserName', label: 'warOutbound.outboundAgentUserName', minWidth: '100'},
      // 出库日期
      {show: true, filterName: 'date', prop: 'outboundDate', label: 'warOutbound.outboundDate', minWidth: '100'},
      // 填写人
      { show: true, prop: 'createByName', label: 'fConfig.createByName', minWidth: '80' },
      // 填写日期
      { show: true, filterName: 'date', prop: 'createTime', label: 'fConfig.createTime', minWidth: '100' },
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
