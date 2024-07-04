/*
 * @Author: your name
 * @Date: 2020-07-23 16:08:36
 * @LastEditTime: 2020-08-13 14:29:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\basic\compoent\selectClassify\config.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    saveUrl: {
      url: 'classifyWarehouse/setClassifyEdit'
    }
  },
  // 数据字典
  dictionary: [
    {dicCode: 'costType', propCode: 'costType'}
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
      // 分类名称
      {show: true, label: 'fConfig.classifyName', prop: 'classifyName', span: 8, formType: 'input', maxlength: 32},
      // 分类编码
      {show: true, label: 'fConfig.classifyCode', prop: 'classifyCode', span: 8, formType: 'input', maxlength: 32},
      // 填写人
      {show: true, label: 'fConfig.createByName', prop: 'createByName', span: 8, formType: 'input', maxlength: 32},
      // 备注
      {show: true, label: 'fConfig.remarks', prop: 'classifyDiscription', span: 8, formType: 'input', maxlength: 64}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [],
  isFooterShow: true,
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
      showColumnCtrl: false, // 显示/隐藏列
      refresh: false // 刷新
    },
    // 是否默认选中第一行
    defaultSeleFirstLine: false,
    // 子系统表头渲染参数
    tableList: [
      // 分类名称
      {show: true, prop: 'classifyName', label: 'fConfig.classifyName', minWidth: '100'},
      // 分类编码
      {show: true, prop: 'classifyCode', label: 'fConfig.classifyCode', minWidth: '160'},
      // 同级排序
      {show: true, prop: 'sorts', label: 'fConfig.sort'},
      // 备注
      {show: true, prop: 'classifyDiscription', label: 'fConfig.remarks'},
      // 填写人
      {show: true, prop: 'createByName', label: 'fConfig.createByName', minWidth: '80'},
      // 修改人
      {show: true, prop: 'updateByName', label: 'fConfig.updateByName', minWidth: '100'},
      // 最后更新日期
      {show: true, filterName: 'date', prop: 'updateTime', label: 'fConfig.updateTime', minWidth: '120'}
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
