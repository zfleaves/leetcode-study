/*
 * @Author: your name
 * @Date: 2020-07-30 10:35:11
 * @LastEditTime: 2022-05-23 10:49:39
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\checkArrival\config.js
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'purchaseCheckArrival',
  // 流程
  processParmas: {
    // 初始化信息
    startInfo: {
      url: 'checkArrival/getStartNode',
      parmasList: [
        {receive: 'sid', value: 'id'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 提交
    startSubmit: {
      url: 'checkArrival/startSubmit'
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
      // 订单名称
      {show: true, label: 'checkArrival.supplyOrderName', prop: 'supplyOrderName', span: 8, formType: 'input', maxlength: 64},
      // 供应商名称
      {show: true, label: 'checkArrival.supplierName', prop: 'supplierName', span: 8, formType: 'input', maxlength: 64},
      // 验收日期
      {label: 'checkArrival.checkDate', span: 8, formType: 'daterange-split',
            propStart: 'checkDateFrom', propEnd: 'checkDateTo',
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
      // 主要验收材料
      {show: true, prop: 'mainCheckMaterials', label: 'checkArrival.mainCheckMaterials', minWidth: '160'},
      // 项目名称
      {show: true, prop: 'projectName', label: 'fConfig.projectName'},
      // 订单名称
      {show: true, prop: 'supplyOrderName', label: 'checkArrival.supplyOrderName'},
      // 供应商名称
      {show: true, prop: 'supplierName', label: 'checkArrival.supplierName'},
      // 参与验收人员
      {show: true, prop: 'checkTeam', label: 'checkArrival.checkTeam', minWidth: '120'},
      // 验收日期
      {show: true, filterName: 'date', prop: 'checkDate', label: 'checkArrival.checkDate', minWidth: '120'},
      // 是否已快速入库
      {show: true, prop: 'ifFastIncoming', label: 'checkArrival.ifFastIncoming', formType: 'dicSelect', align: 'center', selectList: [
        {dataCode: 1, dataName: 'tips.yes'},
        {dataCode: 0, dataName: 'tips.no'}
       ], isTranslate: true, minWidth: '120'
      },
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
