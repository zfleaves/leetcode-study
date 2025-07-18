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
    { dicCode: 'projectTypeCode', propCode: 'projectTypeCodes' }
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
        name: '姓名', show: true, label: 'dialog.interviewName', prop: 'expertName', span: 8,
        formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 128
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
        { name: '姓名', show: true, prop: 'expertName', label: 'dialog.interviewName' },

        { name: '性别', show: true, prop: 'sex', label: 'dialog.sexValue', formType: 'dicSelect',
          selectList: [
            { dataCode: '01', dataName: 'fConfig.man' }, // 男
            { dataCode: '02', dataName: 'fConfig.female' } // 女
          ], isTranslate: true
        },

        { name: '出生年月', show: true, prop: 'birthDate', label: 'dialog.birthTime', filterName: 'date', minWidth: '100', align: 'center' },

        { name: '职务', show: true, prop: 'dutyAffair', label: 'dialog.dutyAffair' },

        { name: '技术职称', show: true, prop: 'technicalTitle', label: 'dialog.technicalTitle' }
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
