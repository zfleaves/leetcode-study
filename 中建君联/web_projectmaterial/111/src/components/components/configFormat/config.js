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
      { show: true, label: 'fConfig.classifyName', prop: 'classifyName', span: 8, formType: 'input', maxlength: 32 },
      // 编号
      { show: true, label: 'dialog.companyAssetsValue', prop: 'companyAssetsValue', span: 8, formType: 'input', maxlength: 32 }
    ],
    // 是否显示重置按钮
    isReset: true,
    isResetStyle: true
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
      {
        name: '业态名称', show: true, prop: 'businessFormatName', label: 'dialog.businessFormatName'
      },

      { name: '层级', show: true, prop: 'reaches', label: 'dialog.reaches' },

      { name: '资产类别', show: true, prop: 'companyAssetsValue', label: 'dialog.companyAssetsValue' },

      { name: '说明', show: true, prop: 'illustrate', label: 'dialog.illustrate' }
    ]
  }
};
class Page {
  constructor() {
    this.PageConfig = JSON.parse(JSON.stringify(PageConfig));
    this.init();
  }
  init() {
    Utils.commonUtil.getSelectList(this.PageConfig.selectList, this);
    Utils.commonUtil.getDicAllDataList(this.PageConfig.dictionary, this);
  }
}
export default Page;
