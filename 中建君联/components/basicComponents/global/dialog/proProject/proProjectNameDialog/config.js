/*
 * @Author: your name
 * @Date: 2020-12-23 14:14:10
 * @LastEditTime: 2020-12-24 09:20:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectsecurity\src\components\secPlan\config.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {},
  // 数据字典
  dictionary: [
    { dicCode: 'projectStatus', propCode: 'projectStatus' },
    { dicCode: 'projectTypeCode', propCode: 'projectTypeCode' }
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
        {
            name: '工程项目名称', show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8,
            formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 128
        },

        {
            name: '创建单位', show: true, label: 'dialog.createUnit', prop: 'belongCompanyName', span: 8,
            formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 128
        },

        {
            name: '项目类别', label: 'dialog.projectTypeName', prop: 'projectTypeCode', span: 8, multiple: true,
            formType: 'dicSelect', selectList: [], clearable: true, inputStatus: 'edit'
        },

        {
            name: '项目分管领导', show: true, label: 'dialog.chargeLeaderUserName', prop: 'chargeLeaderUserName', span: 8,
            formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 64
        },

        {
            name: '开工日期', label: 'dialog.beginTime', formType: 'daterange-split', clearable: true, span: 8,
            propStart: 'beginTimeFrom', propEnd: 'beginTimeTo', inputStatus: 'edit'
        }
    ],
    // 是否显示重置按钮
    isReset: false
  },
  // 表格操作按钮
  mainOperateBtn: [],
  isFooterShow: true,
  // 主表渲染参数
  mainTable: {
    //  单选
    isRadio: true,
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
        { name: '工程项目名称', show: true, prop: 'projectName', label: 'dialog.proProjectName' },

        { name: '工程项目编号', show: true, prop: 'projectCode', label: 'dialog.proProjectCode' },

        { name: '创建单位', show: true, prop: 'belongCompanyName', label: 'dialog.createUnit' },

        { name: '项目类别', show: true, prop: 'projectTypeName', label: 'dialog.projectTypeName', minWidth: '100' },

        { name: '项目分管领导', show: true, prop: 'chargeLeaderUserName', label: 'dialog.chargeLeaderUserName', minWidth: '140' },

        { name: '项目(实际)开工日期', show: true, filterName: 'date', prop: 'beginTime', label: 'dialog.beginTime', minWidth: '150', align: 'center' },

        { name: '项目状态', show: true, prop: 'projectStatus', label: 'dialog.projectStatus', minWidth: '100', formType: 'slot', selectList: [] }

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
