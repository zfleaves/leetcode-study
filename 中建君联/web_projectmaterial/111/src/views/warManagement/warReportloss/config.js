/*
 * @Author: your name
 * @Date: 2020-07-30 10:35:11
 * @LastEditTime: 2020-08-24 15:52:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\warReportloss\config.js
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'warehouseReportloss',
  // 流程
  processParmas: {
    // 初始化信息
    startInfo: {
      url: 'warReportloss/getStartNode',
      parmasList: [
        {receive: 'sid', value: 'id'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 提交
    startSubmit: {
      url: 'warReportloss/startSubmit'
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
      // 主要报损材料
      {show: true, label: 'warReportloss.mainReportlossMaterials', prop: 'mainReportlossMaterials', span: 8, formType: 'input', maxlength: 128},
      // 仓库名称
      {show: true, label: 'warReportloss.warehouseName', prop: 'warehouseName', span: 8, formType: 'input', maxlength: 64},
      // 报损日期
      {label: 'warReportloss.reportlossDate', span: 8, formType: 'daterange-split',
            propStart: 'reportlossDateFrom', propEnd: 'reportlossDateTo',
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
      // 主要报损材料
      {show: true, prop: 'mainReportlossMaterials', label: 'warReportloss.mainReportlossMaterials', minWidth: '160'},
      // 仓库名称
      {show: true, prop: 'warehouseName', label: 'warReportloss.warehouseName'},
      // 价税合计
      {show: true, prop: 'totalPriceTax', label: 'warReportloss.totalPriceTax', minWidth: '100', formType: 'setMoney', filterName: 'setMoney'},
      // 项目名称
      {show: true, prop: 'projectName', label: 'fConfig.projectName'},
      // 报损办理人
      {show: true, prop: 'reportlossAgentUserName', label: 'warReportloss.reportlossAgentUserName', minWidth: '100'},
      // 报损日期
      {show: true, filterName: 'date', prop: 'reportlossDate', label: 'warReportloss.reportlossDate', minWidth: '100'},
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
