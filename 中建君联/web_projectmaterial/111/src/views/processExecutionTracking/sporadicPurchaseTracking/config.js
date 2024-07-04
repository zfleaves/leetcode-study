
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        exportUrl: {
            url: 'sporadicPurchaseTracking/getExportData'
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
            // // 所属公司
            { show: true, label: 'fConfig.currentOrgName', prop: 'orgName', span: 8, formType: 'input', maxlength: 64 },
            // 项目名称
            { show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64 },
            // 单据编号
            { show: true, label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', maxlength: 32 },
            // 报销状态
            {
                show: true, label: 'sporadicPurchaseTracking.sporadicPurchaseStatus', prop: 'sporadicPurchaseStatus', span: 8, formType: 'dicSelect',
                selectList: [
                    // 零星采购单状态(01未报销,02部分报销,03已完成,04已关闭) ,
                    { dataCode: '01', dataName: '未报销' },
                    { dataCode: '02', dataName: '部分报销' },
                    { dataCode: '03', dataName: '已完成' },
                    { dataCode: '04', dataName: '手动关闭' }
                ], collapseTags: true, multiple: true
            },
            // 零星采购原因
            { show: true, label: 'sporadicPurchaseTracking.sporadicPurchaseReason', prop: 'sporadicPurchaseReason', span: 8, formType: 'input', maxlength: 64 },
            // 申请人
            { show: true, label: 'sporadicPurchaseTracking.applyUserName', prop: 'applyUserName', span: 8, formType: 'input', maxlength: 32 }
        ],
        // 是否显示重置按钮
        isReset: true
    },
    // 表格操作按钮
    mainOperateBtn: [
        { isCustom: false, code: 'sysHandleExport', authCode: 'export' }
    ],
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
            { show: true, prop: 'expandCollapse', label: 'dialog.expandCollapse', minWidth: '80', formType: 'expand' },
            // 报销状态
            {
                show: true, prop: 'sporadicPurchaseStatus', label: 'sporadicPurchaseTracking.sporadicPurchaseStatus',
                minWidth: '100', align: 'center', formType: 'slot', selectList: []
            },
            // 所属公司
            { show: true, prop: 'orgName', label: 'fConfig.currentOrgName', minWidth: '140' },
            // 项目名称
            { show: true, prop: 'projectName', label: 'fConfig.projectName' },
            // 单据编号
            { show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', fn: 'handleInfo' },
            // 零星采购原因
            { show: true, prop: 'sporadicPurchaseReason', label: 'sporadicPurchaseTracking.sporadicPurchaseReason', minWidth: '160'},
            // 采购金额
            {show: true, prop: 'estimatePurchaseAmount', label: 'sporadicPurchaseTracking.estimatePurchaseAmount', minWidth: '120', filterName: 'setMoney'},
            // 已报销金额
            {show: true, prop: 'alreadyReimburseAmount', label: 'sporadicPurchaseTracking.alreadyReimburseAmount', minWidth: '120', filterName: 'setMoney'},
            // 申请人
            { show: true, prop: 'applyUserName', label: 'sporadicPurchaseTracking.applyUserName', minWidth: '80' },
            // 申请日期
            { show: true, filterName: 'date', prop: 'applyDate', label: 'sporadicPurchaseTracking.applyDate', minWidth: '100' },
            // 关闭原因
            { show: true, prop: 'reimburseCloseReason', label: 'dialog.closeReason'},
            // 操作
            {
                show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '80',
                slotButs: [
                    { name: 'button.closed', class: 'danger', fn: 'sysHandleForceUpdate', authCode: 'forceUpdate', isCreateBy: false }
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
        // 名称、编码、规格。型号、品牌、单位、报量数量、送货通知数量、零星采购数量；
          // 名称
          { show: true, label: 'fConfig.varietiesNameSc', prop: 'executeVarietiesName', minWidth: 120 },
          // 编码
          { show: true, label: 'fConfig.varietiesCodeSc', prop: 'varietiesCode', minWidth: 120},
          // 规格
          { show: true, label: 'fConfig.standards', prop: 'executeStandards', minWidth: 120 },
          // 型号
          { show: true, label: 'fConfig.models', prop: 'models', minWidth: 120 },
          // 品牌
          { show: true, label: 'fConfig.brand', prop: 'brand', minWidth: 120 },
          // 计量单位
          { show: true, label: 'fConfig.unit', prop: 'executeUnit'},
          // 申请数量
          { show: true, label: 'sporadicPurchaseTracking.currentApplyQuantity', prop: 'currentApplyQuantity'},
          // 报销数量
          { show: true, label: 'sporadicPurchaseTracking.reimburseQuantity', prop: 'reimburseQuantity'}
      ]
    },
    mainFormConfig: {
      formList: [
        {
            label: 'sporadicPurchaseTracking.forceUpdateTipes', prop: 'forceUpdateTipes', span: 24, formType: 'promptInformation'
        },
        {
          label: 'dialog.closeReason', prop: 'reimburseCloseReason', span: 24, formType: 'textarea', maxlength: 256,
          minRows: '4', maxRows: '8', isRule: true,
          printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
        }
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

