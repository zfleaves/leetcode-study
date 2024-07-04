/*
 * @Author: your name
 * @Date: 2020-07-23 10:12:08
 * @LastEditTime: 2020-08-14 16:49:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\basic\classifyWarehouse\config.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    exportUrl: {
      url: 'classifyWarehouse/getExportData'
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
        // 材料名称
        {show: true, label: 'fConfig.materialName', prop: 'materialName', span: 8, formType: 'input', maxlength: 64},
        // 材料编码
        {show: true, label: 'fConfig.materialCode', prop: 'materialCode', span: 8, formType: 'input', maxlength: 20},
        // 规格
        {show: true, label: 'fConfig.standards', prop: 'standards', span: 8, formType: 'input', maxlength: 64},
        // 型号
        {show: true, label: 'fConfig.models', prop: 'models', span: 8, formType: 'input', maxlength: 32},
        // 单位
        {show: true, label: 'fConfig.unit', prop: 'unit', span: 8, formType: 'input', maxlength: 32},
        // 品牌
        {show: true, label: 'fConfig.brand', prop: 'brand', span: 8, formType: 'input', maxlength: 32}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [],
  // 主表渲染参数
  mainTable: {
    rowKey: 'id',
    lazy: true,
    treeProps: { hasChildren: 'children', children: 'children'},
    // 表格数据
    tableData: [],
    // 表格高度
    maxHeight: 500,
    pageSize: 10,
    // 页码
    total: 0,
    // 是否显示分页
    paging: false,
    // 表头操作行配置
    tableHeader: {
      showColumnCtrl: true, // 显示/隐藏列
      refresh: false // 刷新
    },
    // 是否默认选中第一行
    defaultSeleFirstLine: false,
    // 子系统表头渲染参数
    tableList: [
        // 单据编号
        {show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '140'},
        // 名称
        {show: true, prop: 'materialName', label: 'fConfig.materialName'},
        // 编码
        {show: true, prop: 'materialCode', label: 'fConfig.materialCode', minWidth: '100'},
        // 规格
        {show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '80'},
        // 型号
        {show: true, prop: 'models', label: 'fConfig.models', minWidth: '80'},
        // 单位
        {show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '60'},
        // 品牌
        {show: true, prop: 'brand', label: 'fConfig.brand', minWidth: '80'},
        // 入库数量
        {show: true, prop: 'currentIncomingQuantity', label: 'materialInfo.currentIncomingQuantity', minWidth: '80'},
        //  单价(不含税)
        {show: true, prop: 'unitPrice', label: 'materialInfo.unitPrice', minWidth: '100', filterName: 'setMoney'},
        // 金额(不含税)
        {show: true, prop: 'excludeTaxAmount', label: 'materialInfo.excludeTaxAmount', minWidth: '100', formType: 'setMoney', filterName: 'setMoney'},
        // 税率
        {show: true, prop: 'taxRate', label: 'materialInfo.taxRate', filterName: 'taxRate', minWidth: '60'},
        // 税额
        {show: true, prop: 'taxAmount', label: 'materialInfo.taxAmount', minWidth: '80', formType: 'setMoney', filterName: 'setMoney'},
        // 金额(含税)
        {show: true, prop: 'includeTaxAmount', label: 'materialInfo.includeTaxAmount', minWidth: '100', formType: 'setMoney', filterName: 'setMoney'},
        // 存放库位
        {show: true, prop: 'warehouseShelvesName', label: 'materialInfo.warehouseShelvesName', minWidth: '100'},
        //  质保到期日
        {show: true, prop: 'warrantyExpiredDate', label: 'materialInfo.warrantyExpiredDate', filterName: 'date', minWidth: '100'}
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
