/*
 * @Author: your name
 * @Date: 2020-07-30 10:35:11
 * @LastEditTime: 2022-06-21 09:09:13
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\purchaseContractLedger\config.js
 */
import Utils from 'util';


const PageConfig = {
  // 流程
  processParmas: {
    exportUrl: {
      url: 'warehouseStatistics/inAndOutFlowExportData'
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
        // 仓库名称
        {show: true, label: 'inAndOutFlow.warehouseName', prop: 'warehouseName', span: 8, formType: 'input', maxlength: 64},
        // 材料名称
        {show: true, label: 'fConfig.materialName', prop: 'materialName', span: 8, formType: 'input', maxlength: 64},
        // 类型
        {show: true, label: 'inAndOutFlow.typeCode', prop: 'typeCodes', span: 8, formType: 'dicSelect', multiple: true, selectList: []},
        // 发送日期
        {label: 'inAndOutFlow.occurDate', span: 8, formType: 'daterange-split',
            propStart: 'occurDateFrom', propEnd: 'occurDateTo'}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [
    {isCustom: false, code: 'sysHandleExport', authCode: 'export'}
  ],
  // 主表渲染参数
  mainTable: {
    showSummary: true,
    // 表格数据
    tableData: [],
    // 表格高度
    maxHeight: 500,
    pageSize: 20,
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
      // 项目名称
      {show: true, prop: 'projectName', label: 'fConfig.projectName', minWidth: '150'},
      // 领料单位
      {show: true, prop: 'pickingUnitName', label: 'inAndOutFlow.pickingUnitName', minWidth: '120'},
      // 仓库名称
      {show: true, prop: 'warehouseName', label: 'inAndOutFlow.warehouseName', minWidth: '140'},
      // 材料编码
      {show: true, prop: 'materialCode', label: 'fConfig.materialCode', minWidth: '120'},
      // 材料名称
      {show: true, prop: 'materialName', label: 'fConfig.materialName', minWidth: '140'},
      // 规格
      {show: true, prop: 'standards', label: 'fConfig.standards'},
      // 型号
      {show: true, prop: 'models', label: 'fConfig.models'},
      // 品牌
      {show: true, prop: 'brand', label: 'fConfig.brand'},
      // 单位
      {show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '50'},
      // 类型
      {show: true, prop: 'typeCode', label: 'inAndOutFlow.typeCode', formType: 'dicSelect', selectList: []},
      // 数量
      {show: true, prop: 'quantity', label: 'inAndOutFlow.quantity', minWidth: '80'},
      // 单价(不含税)
      {show: true, prop: 'unitPrice', label: 'inAndOutFlow.unitPrice', formType: 'setMoney', filterName: 'setMoney', align: 'right', minWidth: '120'},
      // 金额(不含税)
      {show: true, prop: 'excludeTaxAmount', label: 'inAndOutFlow.excludeTaxAmount', formType: 'setMoney', filterName: 'setMoney', align: 'right', minWidth: '120'},
      //   税率
      {show: true, prop: 'taxRate', label: 'inAndOutFlow.taxRate', filterName: 'taxRate', minWidth: '80'},
      // 税额
      {show: true, prop: 'taxAmount', label: 'inAndOutFlow.taxAmount', formType: 'setMoney', filterName: 'setMoney', align: 'right', minWidth: '80'},
      // 金额(含税)
      {show: true, prop: 'includeTaxAmount', label: 'inAndOutFlow.includeTaxAmount', formType: 'setMoney', filterName: 'setMoney', align: 'right', minWidth: '120'},
      // 币种
      {show: true, prop: 'currencyValue', label: 'inAndOutFlow.currencyValue', minWidth: '80'},
      //  发生日期
      {show: true, prop: 'occurDate', label: 'inAndOutFlow.occurDate', filterName: 'date', minWidth: '100'},
      //  备注
      {show: true, prop: 'remarks', label: 'fConfig.remarks'}
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
