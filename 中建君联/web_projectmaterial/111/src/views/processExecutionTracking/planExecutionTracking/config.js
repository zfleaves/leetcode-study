
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
        // 项目名称
        { show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64},
        // 策划内容概述
        {show: true, label: 'planExecutionTracking.schemeContent', prop: 'schemeContent', span: 8, formType: 'input', maxlength: 64},
        // 单据编号
        {show: true, label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', maxlength: 32},
        // 名称
        {show: true, label: 'fConfig.varietiesNameSc', prop: 'varietiesName', span: 8, formType: 'input', maxlength: 64}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [],
  // 主表渲染参数
  mainTable: {
    defaultExpandAll: false,
    // 表格数据
    tableData: [],
    // 表格高度
    maxHeight: 500,
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
      // 展开/收起
      { show: true, prop: 'expandCollapseDetails', label: 'planExecutionTracking.expandCollapseDetails', minWidth: '80', formType: 'expand' },
      // 项目名称
      { show: true, prop: 'projectName', label: 'fConfig.projectName', align: 'center'},
      // 策划次数
      { show: true, prop: 'schemeNum', label: 'planExecutionTracking.schemeNum', minWidth: '160', align: 'center'},
      // 策划内容概述
      { show: true, prop: 'schemeContent', label: 'planExecutionTracking.schemeContent'},
      // 策划总金额
      { show: true, prop: 'afterBudgetTotalAmount', label: 'planExecutionTracking.afterBudgetTotalAmount', filterName: 'setMoney', minWidth: '120' },
      // 单据编号
      { show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', fn: 'handleInfo', align: 'center' },
      {
          name: '操作', show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '80',
          buts: [
              { name: 'button.renew', class: 'success', fn: 'handleRenew', authCode: 'renew', enable: true, noAuth: false, isCreateBy: false }
          ]
      }
    ]
  },
  childrenMainTable: {
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
      showColumnCtrl: true, // 显示/隐藏列
      refresh: false // 刷新
    },
    // 是否默认选中第一行
    defaultSeleFirstLine: false,
    // 子系统表头渲染参数
    tableList: [
        // 名称
        { show: true, label: 'fConfig.varietiesNameSc', prop: 'varietiesName', minWidth: 120 },
        // 编码
        { show: true, label: 'fConfig.varietiesCodeSc', prop: 'materialCode', minWidth: 120},
        // 预算规格
        { show: true, label: 'fConfig.budgetStandards', prop: 'standards', minWidth: 120 },
        // 计量单位
        { show: true, label: 'fConfig.unit', prop: 'unit'},
        // 策划数量
        { show: true, label: 'planExecutionTracking.changeAfterQuantity', prop: 'changeAfterQuantity'},
        // 税率(%)
        { show: true, prop: 'taxRate', label: 'fConfig.taxRate', filterName: 'taxRate' },
        // 策划单价
        { show: true, label: 'planExecutionTracking.changeAfterUnitPrice', prop: 'changeAfterUnitPrice'},
        // 策划合价
        { show: true, label: 'planExecutionTracking.changeAfterAmount', prop: 'changeAfterAmount', filterName: 'setMoney'},
        // 报量数量
        { show: true, label: 'planExecutionTracking.demandQuantity', prop: 'demandQuantity'}
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
