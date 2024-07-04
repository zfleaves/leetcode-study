
import Utils from 'util';

const PageConfig = {
  formCode: 'warWasteMaterials',
  // 流程
  processParmas: {
    // 初始化信息
    startInfo: {
      url: 'wasteMaterials/getStartNode',
      parmasList: [
        {receive: 'sid', value: 'id'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 提交
    startSubmit: {
      url: 'wasteMaterials/startSubmit'
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
      // 项目名称
      {show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64},
      // 收购单位
      {show: true, label: 'wasteMaterials.buyUnitName', prop: 'buyUnitName', span: 8, formType: 'input', maxlength: 64},
      // 审批状态
      {show: true, label: 'fConfig.flowStatus', prop: 'flowStatus', span: 8, formType: 'flowStatus'},
      // 废旧物资名称
      {show: true, label: 'wasteMaterials.wasteMaterialsName', prop: 'wasteMaterialsName', span: 8, formType: 'input', maxlength: 128},
      // 处置事由
      {show: true, label: 'wasteMaterials.handleReason', prop: 'handleReason', span: 8, formType: 'input', maxlength: 128},
      // 处置日期
      {label: 'wasteMaterials.handleDate', span: 8, formType: 'daterange-split',
            propStart: 'handleDateFrom', propEnd: 'handleDateTo',
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
      // 项目名称
      {show: true, prop: 'projectName', label: 'fConfig.projectName'},
      // 收购单位
      {show: true, prop: 'buyUnitName', label: 'wasteMaterials.buyUnitName'},
      // 拟处理方式
      {show: true, prop: 'handleMethodValue', label: 'wasteMaterials.handleMethodValue', minWidth: '100'},
      // 处置事由
      {show: true, prop: 'handleReason', label: 'wasteMaterials.handleReason'},
      // 废旧物资名称
      {show: true, prop: 'wasteMaterialsName', label: 'wasteMaterials.wasteMaterialsName', minWidth: '120'},
      // 最终处置金额
      {show: true, prop: 'totalFinalHandleAmount', label: 'wasteMaterials.totalFinalHandleAmount',
        minWidth: '120', formType: 'setMoney', filterName: 'setMoney'
      },
      // 收款金额
      {show: true, prop: 'totalCollectionAmount', label: 'wasteMaterials.totalCollectionAmount',
        minWidth: '100', formType: 'setMoney', filterName: 'setMoney'
      },
      // 处理负责人
      {show: true, prop: 'handleDutyUserName', label: 'wasteMaterials.handleDutyUserName', minWidth: '80'},
      // 处置日期
      {show: true, filterName: 'date', prop: 'handleDate', label: 'wasteMaterials.handleDate', minWidth: '100'},
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
