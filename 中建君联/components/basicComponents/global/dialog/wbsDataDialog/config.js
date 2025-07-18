/*
 * @Author: zengqin 1058574586@qq.com
 * @Date: 2023-02-15 14:11:37
 * @LastEditors: zengqin 1058574586@qq.com
 * @LastEditTime: 2023-02-15 14:13:43
 * @FilePath: \web_projectlabour\src\components\basicComponents\global\dialog\wbsDataDialog\config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
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
      // 任务名称
      {show: true, label: 'dialog.taskName', prop: 'taskName', span: 8, formType: 'input', maxlength: 64}
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
      // 任务名称
      {show: true, prop: 'taskName', label: 'dialog.taskName'},
      // 编号
      {show: true, prop: 'wbs', label: 'dialog.wbs', minWidth: '100'}
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
