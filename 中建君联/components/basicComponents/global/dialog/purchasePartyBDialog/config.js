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
    { dicCode: 'businessActivityCode', propCode: 'businessActivityCode' },
    { dicCode: 'companyTypeCode', propCode: 'companyTypeCode' }
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
      { show: true, name: '企业性质', prop: 'companyTypeCode', label: 'fConfig.companyType', span: 12,
      formType: 'dicSelect', selectList: []},

      { show: true, name: '供方名称', prop: 'supplierName', label: 'fConfig.supplierName', span: 8, formType: 'input', maxlength: 64 },

      { show: true, name: '业务类型', prop: 'businessActivityCode', label: 'fConfig.businessActivity', span: 12,
      formType: 'dicSelect', selectList: []},

      { show: true, name: '注册日期', prop: 'regDate', label: 'dialog.regDate', span: 8, formType: 'daterange-split',
      propStart: 'regDateFrom', propEnd: 'regDateTo', inputStatus: 'edit'},

      { show: true, name: '入库日期', prop: 'entryDate', label: 'dialog.entryDate', span: 8, formType: 'daterange-split',
      propStart: 'entryDateFrom', propEnd: 'entryDateTo', inputStatus: 'edit'}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [],
  isFooterShow: true,
  // 主表渲染参数
  mainTable: {
    rowKey: 'supplierUscc',
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
      { show: true, name: '企业性质', prop: 'companyTypeValue', label: 'fConfig.companyType', minWidth: '120', align: 'center' },

      { show: true, name: '供方名称', prop: 'supplierName', label: 'fConfig.supplierName'},

      { show: true, name: '营业执照编号', prop: 'supplierUscc', label: 'fConfig.uscc' },

      { show: true, name: '业务类型', prop: 'businessActivityValue', label: 'fConfig.businessActivity', minWidth: '140' },

      { show: true, name: '注册日期', prop: 'regDate', label: 'dialog.regDate', filterName: 'date', minWidth: '120', align: 'center'},

      { show: true, name: '负责人', prop: 'companyContactName', label: 'fConfig.contactUserName', minWidth: '100'},

      { show: true, name: '负责人电话', prop: 'companyContactMobile', label: 'dialog.responsiblePersonMobile', minWidth: '120'},

      { show: true, name: '入库日期', prop: 'entryDate', label: 'dialog.incomingDate', filterName: 'date', minWidth: '120', align: 'center'}

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
