/*
 * @Author: your name
 * @Date: 2020-07-24 17:49:05
 * @LastEditTime: 2020-07-29 12:03:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\components\basicComponents\global\dialog\partyADialog\config.js
 */
import Utils from 'util';

const PageConfig = {
  // 数据字典
  dictionary: [
    {dicCode: 'property', propCode: 'propertyCode'}
  ],
  // 接口数据
  selectList: [],
  // 搜索
  searchControls: {
    // 是否显示
    formShow: true,
    // 搜索使用插槽
    slotFormShow: true,
    // 表单配置
    formList: [
      // 单位名称
      {show: true, label: 'dialog.partyName', prop: 'partyAName', span: 8, formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 128},
      // 所属分类
      // {show: true, label: 'partyAInfo.partyATypeName', prop: 'partyATypeName', span: 8, formType: 'slot', clearable: true, inputStatus: 'edit'},
      // 单位编号
      {show: true, label: 'dialog.partyCode', prop: 'partyACode', span: 8, formType: 'input', maxlength: 32, clearable: true, inputStatus: 'edit'},
      // 单位性质
      {show: true, label: 'dialog.propertyCode', prop: 'propertyCode', span: 8, formType: 'dicSelect', clearable: true, inputStatus: 'edit'},
      // 收录时间
      {label: 'dialog.createTime', span: 8, formType: 'daterange-split', clearable: true,
            propStart: 'createTimeStart', propEnd: 'createTimeEnd',
            inputStatus: 'edit'}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [],
  isFooterShow: true,
  // 主表渲染参数
  mainTable: {
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
      {show: true, prop: 'partyAName', label: 'dialog.partyName'},
      // 单位编号
      {show: true, prop: 'partyACode', label: 'dialog.partyCode'},
      // 所属分类
      {show: true, prop: 'partyATypeName', label: 'dialog.partyTypeName', minWidth: '100'},
      // 单位性质
      {show: true, prop: 'propertyValue', label: 'dialog.propertyValue', minWidth: '100'},
      // 填写人
      {show: true, prop: 'createByName', label: 'fConfig.createByName', minWidth: '100'},
      // 收录日期
      {show: true, filterName: 'date', prop: 'createTime', label: 'dialog.createTime', minWidth: '120', align: 'center'}
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
