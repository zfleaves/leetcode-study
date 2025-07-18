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
      // 分包工程名称
      {show: true, label: 'dialog.projectDetailName', prop: 'projectDetailName', span: 8, formType: 'input', maxlength: 64}
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
      // 分包工程名称
      {show: true, prop: 'projectDetailName', label: 'dialog.projectDetailName'},
      // 编号
      {show: true, prop: 'projectDetailCode', label: 'dialog.projectDetailCode', minWidth: '100'},
      // 预算数量
      {show: true, prop: 'quantity', label: 'dialog.budQuantity', minWidth: '100'},
      // 综合单价
      {show: true, prop: 'price', label: 'dialog.price', minWidth: '100', filterName: 'setMoney'}
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
