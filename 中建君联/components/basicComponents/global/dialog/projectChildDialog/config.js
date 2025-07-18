/*
 * @Author: your name
 * @Date: 2020-07-29 09:20:36
 * @LastEditTime: 2020-07-29 14:13:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\components\basicComponents\global\dialog\projectChildDialog\config.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {},
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
      {show: true, label: 'dialog.childProjectName', prop: 'childProjectName', span: 24, formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 32}
    ],
    // 是否显示重置按钮
    isReset: false
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
      // 名称
      {show: true, prop: 'childProjectName', label: 'dialog.childProjectName', minWidth: '100'},
      // 性质
      {show: true, prop: 'attributeName', label: 'dialog.attributeName', minWidth: '160'},
      // 描述
      {show: true, prop: 'describe', label: 'dialog.describe'}
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
