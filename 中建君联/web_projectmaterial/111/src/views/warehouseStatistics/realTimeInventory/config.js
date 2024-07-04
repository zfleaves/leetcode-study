/*
 * @Author: your name
 * @Date: 2020-07-30 10:35:11
 * @LastEditTime: 2021-08-02 11:52:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\purchaseContractLedger\config.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    exportUrl: {
      url: 'warehouseStatistics/realTimeInventoryExportData'
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
        {show: true, label: 'realTimeInventory.warehouseName', prop: 'warehouseName', span: 8, formType: 'input', maxlength: 64},
        // 材料名称
        {show: true, label: 'fConfig.materialName', prop: 'materialName', span: 8, formType: 'input', maxlength: 64},
        // 材料编码
        {show: true, label: 'fConfig.materialCode', prop: 'materialCode', span: 8, formType: 'input', maxlength: 20},
        // 质保到期截至日
       { label: 'realTimeInventory.warrantyExpiredDate', prop: 'warrantyExpiredDateTo', span: 8, formType: 'time' },
         // 型号
        {show: true, label: 'fConfig.models', prop: 'models', span: 8, formType: 'input', maxlength: 64}
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
    rowStyle: '',
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
      // 仓库名称
      {show: true, prop: 'warehouseName', label: 'realTimeInventory.warehouseName', minWidth: '140'},
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
      // 税率(%)
      {show: true, prop: 'taxRate', label: 'realTimeInventory.taxRate', filterName: 'taxRate', minWidth: '80'},
      // 存放库位
      {show: true, prop: 'warehouseShelvesName', label: 'realTimeInventory.warehouseShelvesName'},
      // 质保到期日
      {show: true, prop: 'warrantyExpiredDate', label: 'realTimeInventory.warrantyExpiredDate', filterName: 'date', minWidth: '120'},
      // 币种
      {show: true, prop: 'currencyValue', label: 'realTimeInventory.currencyValue'},
      // 累计入库数量
      {show: true, prop: 'totalIncomingQuantity', label: 'realTimeInventory.totalIncomingQuantity', minWidth: '110'},
      // 累计出库数量
      {show: true, prop: 'totalOutboundQuantity', label: 'realTimeInventory.totalOutboundQuantity', minWidth: '110'},
      // 可以库存数量
      {show: true, prop: 'availableStock', label: 'realTimeInventory.availableStock', minWidth: '110'},
      // 已锁定数量
      {show: true, prop: 'frozenStock', label: 'realTimeInventory.frozenStock', minWidth: '100'},
      // 动态单价(不含税)
      {show: true, prop: 'unitPrice', label: 'realTimeInventory.unitPrice', formType: 'setMoney', filterName: 'setMoney', align: 'right', minWidth: '130'},
      // 库存金额(不含税)
      {show: true, prop: 'realExcludeTaxAmount', label: 'realTimeInventory.realExcludeTaxAmount', formType: 'setMoney', filterName: 'setMoney', align: 'right', minWidth: '130'},
      // 税额
      {show: true, prop: 'realTaxAmount', label: 'realTimeInventory.realTaxAmount', formType: 'setMoney', filterName: 'setMoney', align: 'right', minWidth: '80'},
      // 库存金额(含税)
      {show: true, prop: 'realIncludeTaxAmount', label: 'realTimeInventory.realIncludeTaxAmount', formType: 'setMoney', filterName: 'setMoney', align: 'right', minWidth: '120'}
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
