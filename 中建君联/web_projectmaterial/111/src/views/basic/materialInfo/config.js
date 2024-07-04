/*
 * @Author: your name
 * @Date: 2020-07-23 10:12:08
 * @LastEditTime: 2022-08-29 17:16:24
 * @LastEditors: wumaoxia 1805428335@qq.com
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
        // 名称
        {show: true, label: 'fConfig.materialName', prop: 'materialName', span: 8, formType: 'input', maxlength: 64},
        // 编码
        {show: true, label: 'fConfig.materialCode', prop: 'materialCode', span: 8, formType: 'input', maxlength: 64},
        // 规格
        {show: true, label: 'fConfig.standards', prop: 'standards', span: 8, formType: 'input', maxlength: 64},
        // 型号
        {show: true, label: 'fConfig.models', prop: 'models', span: 8, formType: 'input', maxlength: 64},
        // 品牌
        {show: true, label: 'fConfig.brand', prop: 'brand', span: 8, formType: 'input', maxlength: 64},
        // 名称
        {show: true, label: 'fConfig.varietiesName', prop: 'varietiesName', span: 8, formType: 'input', maxlength: 64}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [],
  // 主表渲染参数
  mainTable: {
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
      showColumnCtrl: false, // 显示/隐藏列
      refresh: false // 刷新
    },
    // 是否默认选中第一行
    defaultSeleFirstLine: false,
    // 子系统表头渲染参数
    tableList: [
        // 名称
        {show: true, prop: 'materialName', label: 'fConfig.materialName'},
        // 编码
        {show: true, prop: 'materialCode', label: 'fConfig.materialCode'},
        // 规格
        { show: true, prop: 'standards', label: 'fConfig.standards'},
        // 型号
        {show: true, prop: 'models', label: 'fConfig.models'},
        // 单位
        {show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '60'},
        // 品牌
        {show: true, prop: 'brand', label: 'fConfig.brand'},
        // 名称
        {show: true, prop: 'varietiesName', label: 'fConfig.varietiesName'},
        // 编码
        {show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: '160'}
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
