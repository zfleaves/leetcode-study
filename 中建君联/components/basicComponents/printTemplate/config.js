/*
 * @Author: your name
 * @Date: 2020-08-24 10:13:09
 * @LastEditTime: 2023-07-18 16:36:51
 * @LastEditors: zengqin 1058574586@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\printTemplate\config.js
 */
import Utils from 'util';

const PageConfig = {
  // 数据字典列表
  dictionary: ['taxRate'],
  // 接口数据
  selectList: [],
  // 搜索
  searchControls: {
    // 是否显示
    formShow: true,
    // 表单配置
    formList: [
      // 模板名称
        {show: true, label: 'print.printModelName', prop: 'printModelName', span: 8, formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 32},
      // 模板编号
        {show: true, label: 'print.printModelCode', prop: 'printModelCode', span: 8, formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 32},
      // 最后修改人
        {show: true, label: 'print.updateByName', prop: 'updateByName', span: 8, formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 12},
      // 最后修改时间
        {label: 'print.updateTime', prop: 'updateTime', span: 8, formType: 'daterange-split', clearable: true,
              propStart: 'updateTimeFrom', propEnd: 'updateTimeTo',
              inputStatus: 'edit'},
      // 备注
        {show: true, label: 'print.remarks', prop: 'remarks', span: 8, formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 64}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [
    {isCustom: false, code: 'sysHandleAdd', authCode: 'create'},
    {isCustom: true, icon: 'el-icon-reading', slot: false, type: 'primary', plain: false,
    code: 'handleInstructionsForUse', name: 'dialog.instructionsForUse', noAuth: true}
  ],
  // 主表渲染参数
  mainTable: {
    // 表格数据
    tableData: [],
    // 表格高度
    maxHeight: 500,
    pageSize: 10,
    // 页码
    total: 0,
    // 表头操作行配置
    tableHeader: {
      showColumnCtrl: true, // 显示/隐藏列
      refresh: false // 刷新
    },
    // 是否显示分页
    paging: true,
    // 是否默认选中第一行
    defaultSeleFirstLine: false,
    // 合并列
    // 子系统表头渲染参数
    tableList: [
      // 状态
      {show: true, label: 'fConfig.status', prop: 'valid', minWidth: '60', formType: 'slot', align: 'center'},
      // 模板名称
      {show: true, prop: 'printModelName', label: 'print.printModelName'},
      // 模板编号
      {show: true, prop: 'printModelCode', label: 'print.printModelCode', minWidth: '200'},
      // 所属组织
      {show: true, prop: 'organizations', label: 'fConfig.belongCompanyName', printValue: 'belongCompanyName'},
      // 最后修改人
      {show: true, prop: 'updateByName', label: 'print.updateByName', minWidth: '100'},
      // 最后修改时间
      {show: true, filterName: 'time', prop: 'updateTime', label: 'print.updateTime', minWidth: '160', align: 'center'},
      // 备注
      {show: true, prop: 'remarks', label: 'print.remarks'},
      // 操作
      {show: true, formType: 'operate', label: 'print.operate', minWidth: '240',
      // 预览/修改模板
      buts: [
          { name: 'button.edit', class: 'warning', fn: 'handleEdit', authCode: 'edit'},
          {name: 'print.viewEditTemplate', class: 'warning', fn: 'handleViewEditTemplate', authCode: 'viewEditTemplate'}
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
