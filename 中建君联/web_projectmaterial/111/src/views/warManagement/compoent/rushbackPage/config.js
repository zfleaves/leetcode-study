/*
 * @Author: your name
 * @Date: 2021-08-27 14:24:46
 * @LastEditTime: 2022-05-19 11:25:58
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \project_web-长城钻探前端\src\views\procurementImplementation\components\sourcingResults\config.js
 */

import Utils from 'util';

const PageConfig = {
  // 数据字典
  dictionary: [],
  // 搜索
  searchControls: {
    searchSlotShow: false,
    // 是否显示
    formShow: true,
    // 表单配置
    formList: [
      // 单据编号
      { show: true, label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', maxlength: 32 }
    ],
    // 是否显示重置按钮
    isReset: false
  },
  // 表格操作按钮
  mainOperateBtn: [],
  // 当页面为弹出框时 是否显示按钮
  isFooterShow: true,
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
        showColumnCtrl: false, // 显示/隐藏列
        refresh: false // 刷新
    },
    // 是否默认选中第一行
    defaultSeleFirstLine: false,
    // 子系统表头渲染参数
    tableList: [
      // 单据编号
      {show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', align: 'center'},
      // 入库类型
      {show: true, prop: 'incomingTypeValue', label: 'warIncoming.incomingTypeCode'},
      // 主要入库材料
      {show: true, prop: 'mainMaterials', label: 'warIncoming.mainMaterials'},
      // 供应商名称
      {show: true, prop: 'supplierName', label: 'warIncoming.supplierName'},
      // 计税合价
      {show: true, prop: 'totalPriceTax', label: 'warIncoming.totalPriceTax', minWidth: '140', formType: 'setMoney', filterName: 'setMoney'}
    ]
  }
};
class Page {
  constructor() {
    this.PageConfig = PageConfig;
    this.init();
  }
  init() {
    Utils.commonUtil.getSelectList(this.PageConfig.selectList, this);
    Utils.commonUtil.getDicAllDataList(this.PageConfig.dictionary, this);
  }
}
export default Page;
