import Utils from 'util';

const PageConfig = {
  formCode: 'warehouseAllocation',
  // 流程
  processParmas: {
    // 初始化信息
    startInfo: {
      url: 'warAllocation/getStartNode',
      parmasList: [
        {receive: 'sid', value: 'id'},
        {receive: 'projectId', value: 'outProjectId'}
      ]
    },
    // 提交
    startSubmit: {
      url: 'warAllocation/startSubmit'
    }
  },
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
      // 调出项目名称
      {show: true, label: 'warAllocation.outProjectName', prop: 'outProjectName', span: 8, formType: 'input', maxlength: 64},
      // 调入项目名称
      {show: true, label: 'warAllocation.inProjectName', prop: 'inProjectName', span: 8, formType: 'input', maxlength: 64},
      // 审批状态
      {show: true, label: 'fConfig.flowStatus', prop: 'flowStatus', span: 8, formType: 'flowStatus'},
      // 主要调拨材料
      {show: true, label: 'warAllocation.mainAllocationMaterials', prop: 'mainAllocationMaterials', span: 8, formType: 'input', maxlength: 128},
      // 单据编号
      {show: true, label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', maxlength: 32},
      // 调拨日期
      {label: 'warAllocation.allocationDate', span: 8, formType: 'daterange-split',
            propStart: 'allocationDateFrom', propEnd: 'allocationDateTo',
            inputStatus: 'edit'}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [
    {isCustom: false, code: 'sysHandleAdd', authCode: 'create'},
    {isCustom: false, code: 'sysHandleStartProcess', authCode: 'startProcess'},
    {isCustom: false, code: 'sysHandleMonitorProcess', authCode: 'monitorProcess'},
    {isCustom: false, code: 'sysHandlePrint', authCode: 'print'}
  ],
  // 主表渲染参数
  mainTable: {
    //  单选
    isRadio: true,
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
      // 审批状态
      {show: true, prop: 'flowStatus', label: 'fConfig.flowStatus', formType: 'flowStatus', minWidth: '100', align: 'center'},
      // 单据编号
      {show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', fn: 'handleInfo', align: 'center'},
      // 调出项目名称
      {show: true, prop: 'outProjectName', label: 'warAllocation.outProjectName'},
      // 主要调拨材料
      {show: true, prop: 'mainAllocationMaterials', label: 'warAllocation.mainAllocationMaterials'},
      // 价税合计
      {show: true, prop: 'totalPriceTax', label: 'warAllocation.totalPriceTax', minWidth: '100', formType: 'setMoney', filterName: 'setMoney'},
      // 调入项目名称
      {show: true, prop: 'inProjectName', label: 'warAllocation.inProjectName'},
      // 调出办理人
      {show: true, prop: 'allocationoutAgentUserName', label: 'warAllocation.allocationoutAgentUserName', minWidth: '100'},
      // 调拨日期
      {show: true, filterName: 'date', prop: 'allocationDate', label: 'warAllocation.allocationDate', minWidth: '100'},
      // 操作
      {show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '100',
      buts: [
          {name: 'button.edit', class: 'warning', fn: 'handleEdit', authCode: 'update', isCreateBy: true},
          {name: 'button.delete', class: 'danger', fn: 'handleDelete', authCode: 'delete', isCreateBy: true}
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
