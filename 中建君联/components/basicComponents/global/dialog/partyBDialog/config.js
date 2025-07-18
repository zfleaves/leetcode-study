/*
 * @Author: your name
 * @Date: 2020-07-30 20:16:47
 * @LastEditTime: 2021-06-03 16:29:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\components\basicComponents\global\dialog\partyBDialog\config.js
 */
import Utils from 'util';

const PageConfig = {
  // 数据字典
  dictionary: [
    { dicCode: 'dealingsPropertyCode', propCode: 'partyBProperties' }
  ],
  // 接口数据
  selectList: [],
  // 搜索
  searchControls: {
    // 是否显示
    formShow: true,
    // 搜索使用插槽
    slotFormShow: false,
    // 表单配置
    formList: [
      // 单位名称
      {show: true, label: 'fConfig.partyBName', prop: 'partyBName', span: 8, formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 64},
      // 统一社会信用代码
      {show: true, label: 'fConfig.uscc', prop: 'uscc', span: 8, formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 64},
      // 业务联系人
      {show: true, label: 'fConfig.contactName', prop: 'contactName', span: 8, formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 32},
      // 往来性质
      {show: true, label: 'fConfig.dealingsPropertyCode', prop: 'partyBProperties', span: 8, formType: 'dicSelect', selectList: [], multiple: true, clearable: true, inputStatus: 'edit'}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [],
  isFooterShow: true,
  // 主表渲染参数
  mainTable: {
    rowKey: 'id',
    //   单选
    isRadio: true,
    // 表格数据
    tableData: [],
    // 表格高度
    maxHeight: 300,
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
      // 单位名称
      {show: true, prop: 'partyBName', label: 'fConfig.partyBName'},
      // 统一社会信用代码
      {show: true, prop: 'uscc', label: 'fConfig.uscc', minWidth: '200'},
      // 单位编号
      {show: true, prop: 'partyBCode', label: 'fConfig.partyBCode'},
      // 往来性质
      {show: true, prop: 'properties', label: 'fConfig.dealingsPropertyCode', printValue: 'dealingsPropertyValue'},
      // 业务联系人
      {show: true, prop: 'contactName', label: 'fConfig.contactName', minWidth: '120'},
      // 业务联系人手机
      {show: true, prop: 'contactMobile', label: 'fConfig.contactMobile', minWidth: '140'}

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
