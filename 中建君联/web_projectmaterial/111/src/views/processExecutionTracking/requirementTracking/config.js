
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        exportUrl: {
            url: 'requirementTracking/getExportData'
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
            // 所属公司
            { show: true, label: 'fConfig.currentOrgName', prop: 'orgName', span: 8, formType: 'input', maxlength: 64 },
            // 项目名称
            { show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64 },
            // 单据编号
            { show: true, label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', maxlength: 32 },
            // 下单状态
            {
                show: true, label: 'requirementTracking.demandOrderStatus', prop: 'demandStatus', span: 8, formType: 'dicSelect',
                selectList: [
                    { dataCode: '01', dataName: '未下单' },
                    { dataCode: '02', dataName: '部分下单' },
                    { dataCode: '03', dataName: '已完成' },
                    { dataCode: '04', dataName: '手动关闭' }
                ], collapseTags: true, multiple: true
            },
            // 填写人
            { show: true, label: 'fConfig.createByName', prop: 'createByName', span: 8, formType: 'input', maxlength: 32 },
            // 填写日期
            { show: true, label: 'fConfig.createTime', prop: 'createTime', span: 8, formType: 'daterange-split',
              propStart: 'createTimeFrom', propEnd: 'createTimeTo', inputStatus: 'edit'}
        ],
        // 是否显示重置按钮
        isReset: true
    },
    // 表格操作按钮
    mainOperateBtn: [
        // 更新
        // { isCustom: true, code: 'sysHandleRenew', authCode: 'renew', name: 'button.renew' },
        { isCustom: false, code: 'sysHandleExport', authCode: 'export' }
    ],
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
            { show: true, prop: 'expandCollapse', label: 'dialog.expandCollapse', minWidth: '80', formType: 'expand' },
            // 序号、下单状态、所属公司、项目名称、需求类型、需求编号、主要需求明细、申请月/周/日、填写人、填写日期、操作。
            // 订单下单状态
            {
                show: true, prop: 'demandStatus', label: 'requirementTracking.demandOrderStatus', minWidth: '120', align: 'center', formType: 'slot', selectList: [
                    // {dataCode: '01', dataName: '未下单'}, {dataCode: '02', dataName: '部分下单'}, {dataCode: '03', dataName: '已全部下单'}
                ]
            },
            // 零采下单状态
            {
                show: true, prop: 'sporadicPurchaseStatus', label: 'requirementTracking.sporadicPurchaseStatus', minWidth: '120', align: 'center', formType: 'slot', selectList: [
                    // {dataCode: '01', dataName: '未下单'}, {dataCode: '02', dataName: '部分下单'}, {dataCode: '03', dataName: '已全部下单'}
                ]
            },
            // 总仓发货状态(01未发料,02部分发料,03已全部发料,04关闭)
            {
                show: true, prop: 'supplyDemandStatus', label: 'requirementTracking.supplyDemandStatus', minWidth: '100', align: 'center',
                 formType: 'slot', selectList: [
                    {dataCode: '01', dataName: '未发料'}, {dataCode: '02', dataName: '部分发料'}, {dataCode: '03', dataName: '全部发料'}
                ]
            },
            // 所属公司
            { show: true, prop: 'orgName', label: 'fConfig.currentOrgName', minWidth: '140' },
            // 项目名称
            { show: true, prop: 'projectName', label: 'fConfig.projectName'},
            // 需求类型
            {
                show: true, prop: 'demandPlanTypeCode', label: 'requirementTracking.demandPlanType', minWidth: '100', formType: 'dicSelect', selectList: [
                    { dataCode: '01', dataName: '月计划' }, { dataCode: '02', dataName: '周计划' }, { dataCode: '03', dataName: '临时计划' }
                ]
            },
            // 单据编号
            { show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', fn: 'handleInfo' },
            // 需求编号
            // { show: true, prop: 'projectCode', label: 'fConfig.projectCode', minWidth: '120' },
            // 主要需求明细
            { show: true, prop: 'mainDemandDetail', label: 'requirementTracking.mainDemandDetail', minWidth: '160' },
            // 拟使用部位
            // { show: true, prop: 'usePlaceName', label: 'requirementTracking.usePlaceName', minWidth: '120' },
            // 申请月/周/日
            { show: true, prop: 'applyDate', label: 'requirementTracking.applyDate', minWidth: '140', formType: 'slot' },
            // 填写人
            { show: true, prop: 'createByName', label: 'fConfig.createByName', minWidth: '80' },
            // 填写日期
            { show: true, filterName: 'date', prop: 'createTime', label: 'fConfig.createTime', minWidth: '100' },
            // 关闭原因
            { show: true, prop: 'closeReason', label: 'dialog.closeReason'},
            // 操作
            {
                show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '160',
                slotButs: [
                    // { name: 'button.edit', class: 'warning', fn: 'handleEdit', authCode: 'update', isCreateBy: false },
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
          // 报量数量
          { show: true, label: 'dialog.demandQuantity', prop: 'currentApplyQuantity'},
          // 送货通知数量
          { show: true, label: 'dialog.deliveryNoticeQuantity', prop: 'supplyOrderQuantity'},
          // 零星采购数量
          { show: true, label: 'dialog.sporadicPurchaseQuantity', prop: 'sporadicPurchaseQuantity'}
      ]
    },
    mainFormConfig: {
      formList: [
        {
            label: 'requirementTracking.forceUpdateTipes', prop: 'forceUpdateTipes', span: 24, formType: 'promptInformation'
        },
        // 关闭原因
        {
          label: 'dialog.closeReason', prop: 'closeReason', span: 24, formType: 'textarea', maxlength: 256,
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

