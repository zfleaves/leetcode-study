/*
 * @Author: your name
 * @Date: 2021-01-22 11:41:35
 * @LastEditTime: 2021-01-22 11:59:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\deliverGoods\config.js
 */

import Utils from 'util';

const PageConfig = {
  // 数据字典
  dictionary: [],
  // 接口数据
  selectList: [],
  // 搜索
  searchControls: {
    // 是否显示
    formShow: false,
    // 搜索使用插槽
    searchSlotShow: false,
    // 表单配置
    formList: [],
    // 是否显示重置按钮
    isReset: false
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
      // 电子发货单
      {show: true, prop: 'deliverCode', label: 'supplyOrder.deliverCode', minWidth: '200'},
      // 发货单位
      {show: true, prop: 'deliver', label: 'supplyOrder.deliver'},
      // 发货人
      {show: true, prop: 'consignor', label: 'supplyOrder.consignor'},
      // 发货日期
      {show: true, filterName: 'date', prop: 'deliverTime', label: 'supplyOrder.deliverTime', minWidth: '120'},
      // 送货人
      {show: true, prop: 'deliverName', label: 'supplyOrder.deliverName'},
      // 送货人联系方式
      {show: true, prop: 'deliverMobile', label: 'supplyOrder.deliverMobile'},
      // 送货车牌号码
      {show: true, prop: 'carId', label: 'supplyOrder.carId'},
      // 操作
      {show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '80',
      buts: [
        // 查看记录
        {name: 'button.info', class: '', fn: 'handleInfo', noAuth: true, enable: true}
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
