/*
 * @Author: your name
 * @Date: 2020-07-20 14:03:13
 * @LastEditTime: 2021-11-26 16:37:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_inquire\src\components\basicComponents\global\dialog\projectDailog\config.js
 */
import Utils from 'util';

const PageConfig = {
  // 数据字典
  dictionary: [
    { dicCode: 'businessFormatCode', propCode: 'businessFormatCode' },
    { dicCode: 'projectTypeCode', propCode: 'projectTypeCodes' }
  ],
  // 搜索
  searchControls: {
    searchSlotShow: true,
    // 是否显示
    formShow: true,
    // 表单配置
    formList: [
      {
        name: '工程项目名称', show: true, label: 'fConfig.projectName', prop: 'projectName', span: 12,
        formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 128
      },

      {
        name: '项目编号', show: true, label: 'dialog.projectCode', prop: 'projectCode', span: 12,
        formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 64
      },

      {
        name: '所属事业部', show: true, label: 'dialog.organizationName', prop: 'belongCompanyName', span: 12,
        formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 128
      },

      // {
      //   name: '项目类型', label: 'dialog.projectTypeName', prop: 'projectTypeCodes', span: 12, multiple: true,
      //   formType: 'dicSelect', selectList: [], clearable: true, inputStatus: 'edit'
      // },


      {name: '开工(计划)日期', label: 'dialog.beginTime', span: 12, formType: 'daterange-split', propStart: 'beginDateFrom', propEnd: 'beginDateTo', inputStatus: 'edit'}
    ],
    // 是否显示重置按钮
    isReset: true
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
    height: 300,
    pageSize: 10,
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
      { name: '项目名称', show: true, prop: 'projectName', label: 'fConfig.projectName' },

      { name: '项目编号', show: true, prop: 'projectCode', label: 'dialog.projectCode', minWidth: '180' },

      { name: '所属事业部', show: true, prop: 'belongCompanyName', label: 'dialog.organizationName' },

      // { name: '项目类型', show: true, prop: 'projectTypeName', label: 'dialog.projectTypeName', minWidth: '100' },

      { name: '项目领导', show: true, prop: 'projectManagerName', label: 'dialog.projectLeaderUserName', minWidth: '140' },

      { name: '开工(计划)日期', show: true, filterName: 'date', prop: 'beginDate', label: 'dialog.beginTime', minWidth: '150', align: 'center' }
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
