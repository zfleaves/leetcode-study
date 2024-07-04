
import Utils from 'util';

const PageConfig = {
    formCode: 'receiptTracking',
    // 流程
    processParmas: {
        exportUrl: {
            url: 'receiptTracking/getExportData'
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
        searchSlotShow: true,
        // 表单配置
        formList: [
            // 所属公司
            { show: true, label: 'fConfig.currentOrgName', prop: 'belongOrgName', span: 8, formType: 'input', maxlength: 64 },
            // 项目名称
            { show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64 },
            // 单据编号
            { show: true, label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', maxlength: 32 },
            // 结算状态
            {
                show: true, label: 'receiptTracking.executeStatus', prop: 'executeStatus', span: 8, formType: 'dicSelect',
                selectList: [
                    {dataCode: '01', dataName: '未结算'},
                    {dataCode: '02', dataName: '部分结算'},
                    {dataCode: '03', dataName: '已完成'}
                ]
            },
            // 主要入库材料
            { show: true, label: 'receiptTracking.mainMaterials', prop: 'mainMaterials', span: 8, formType: 'input', maxlength: 64 },
            // 入库日期
            {label: 'receiptTracking.incomingDate', span: 8, formType: 'daterange-split',
            propStart: 'incomingDateFrom', propEnd: 'incomingDateTo',
            inputStatus: 'edit'},
            // 供应商名称
            { show: true, label: 'receiptTracking.supplierName', prop: 'supplierName', span: 8, formType: 'slot'}
        ],
        // 是否显示重置按钮
        isReset: true
    },
    // 表格操作按钮
    mainOperateBtn: [
        // 生成对账单
        { isCustom: true, code: 'sysHandleGenerateStatement', authCode: 'generateStatement', name: 'receiptTracking.generateStatement'},
        { isCustom: false, code: 'sysHandleExport', authCode: 'export' }
    ],
    // 主表渲染参数
    mainTable: {
        isCheckbox: true,
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
            // 结算状态
            { show: true, prop: 'executeStatus', label: 'receiptTracking.executeStatus', minWidth: '100', align: 'center', formType: 'slot', selectList: []},
            // 所属公司
            { show: true, prop: 'belongOrgName', label: 'fConfig.currentOrgName'},
            // 项目名称
            { show: true, prop: 'projectName', label: 'fConfig.projectName'},
            // 单据编号
            { show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', fn: 'handleInfo' },
            // 供应商名称
            { show: true, prop: 'supplierName', label: 'receiptTracking.supplierName'},
            // 主要入库材料
            { show: true, prop: 'mainMaterials', label: 'receiptTracking.mainMaterials', minWidth: '160' },
            // 入库金额
            {show: true, prop: 'totalPriceTax', label: 'receiptTracking.totalAmount', minWidth: '120', filterName: 'setMoney'},
            // 已结算金额
            {show: true, prop: 'settlementIncludeTaxAmount', label: 'receiptTracking.alreadySettlementAmount', minWidth: '120', filterName: 'setMoney'},
            // 入库办理人
            { show: true, prop: 'incomingAgentUserName', label: 'receiptTracking.incomingAgentUserName', minWidth: '100' },
            // 入库日期
            { show: true, filterName: 'date', prop: 'incomingDate', label: 'receiptTracking.incomingDate', minWidth: '100' }
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
          { show: true, label: 'fConfig.varietiesNameSc', prop: 'materialName', minWidth: 120 },
          // 编码
          { show: true, label: 'fConfig.varietiesCodeSc', prop: 'varietiesCode', minWidth: 120},
          // 规格
          { show: true, label: 'fConfig.standards', prop: 'standards', minWidth: 120 },
          // 型号
          { show: true, label: 'fConfig.models', prop: 'models', minWidth: 120 },
          // 品牌
          { show: true, label: 'fConfig.brand', prop: 'brand', minWidth: 120 },
          // 计量单位
          { show: true, label: 'fConfig.unit', prop: 'unit'},
          // 入库数量
          { show: true, label: 'receiptTracking.currentIncomingQuantity', prop: 'currentIncomingQuantity'},
          // 结算数量
          { show: true, label: 'receiptTracking.settlementQuantity', prop: 'settlementQuantity'}
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

