import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        saveUrl: {
            url: 'historyMateria/setVarietiesEdit'
        },
        exportUrl: {
            url: 'historyMateria/getExportData'
        }
    },
    // 数据字典
    dictionary: [
        { dicCode: 'costType', propCode: 'costType' }
    ],
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
            // 材料名称
            { show: true, label: 'historyMateria.materialName', prop: 'materialName', span: 8, formType: 'input', maxlength: 64 },
            // 规格
            { show: true, label: 'fConfig.standards', prop: 'standards', span: 8, formType: 'input', maxlength: 32 },
            // 型号
            { show: true, label: 'fConfig.models', prop: 'models', span: 8, formType: 'input', maxlength: 32 },
            // 所属分类
            { show: true, label: 'historyMateria.classifyName', prop: 'classifyName', span: 8, formType: 'input', maxlength: 64 },
            // 供应商名称
            { show: true, label: 'historyMateria.supplierName', prop: 'supplierName', span: 8, formType: 'input', maxlength: 20 },
            // 项目名称
            { show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 20 }
        ],
        // 是否显示重置按钮
        isReset: true
    },
    mainBtnSlotShow: true,
    // 表格操作按钮
    mainOperateBtn: [
        { isCustom: false, code: 'sysHandleAdd', authCode: 'create' },
        { isCustom: false, code: 'sysHandleDownloadTemplate', name: 'button.downloadTemplate', authCode: 'downloadTemplate' },
        { isCustom: false, code: 'sysHandleImport', slot: true, name: 'button.Import', authCode: 'Import' },
        { isCustom: false, code: 'sysHandleExport', name: 'button.export', authCode: 'export' },
        { isCustom: false, code: 'sysHandleDeletaBatch', authCode: 'batchDelete' }
    ],
    // 主表渲染参数
    mainTable: {
        // 多选
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
            showColumnCtrl: false, // 显示/隐藏列
            refresh: false // 刷新
        },
        // 是否默认选中第一行
        defaultSeleFirstLine: false,
        // 子系统表头渲染参数
        tableList: [
            // 项目名称
            { show: true, prop: 'projectName', label: 'fConfig.projectName', minWidth: '150' },
            // 项目编号
            { show: true, prop: 'projectCode', label: 'fConfig.projectCode', minWidth: '150' },
            // 材料名称
            { show: true, prop: 'materialName', label: 'historyMateria.materialName', minWidth: '240' },
            // 规格
            { show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '240' },
            // 型号
            { show: true, prop: 'models', label: 'fConfig.models', minWidth: '140' },
            // 品牌
            { show: true, prop: 'brand', label: 'fConfig.brand', minWidth: '100' },
            // 单位
            { show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '50' },
            // 所属分类
            { show: true, prop: 'classifyName', label: 'historyMateria.classifyName', minWidth: '100' },
            // 数量
            { show: true, prop: 'quantity', label: 'fConfig.quantity', minWidth: '100' },
            // 含税单价
            { show: true, label: 'historyMateria.includeUnitPrice', prop: 'includeUnitPrice', minWidth: '120', filterName: 'setMoney', align: 'right' },
            // 含税总价
            { show: true, label: 'historyMateria.includeTaxAmount', prop: 'includeTaxAmount', minWidth: '120', filterName: 'setMoney', align: 'right' },
            // 供应商名称
            { show: true, prop: 'supplierName', label: 'historyMateria.supplierName', minWidth: '180' },
            // 质量标准
            { show: true, prop: 'qualityStandard', label: 'historyMateria.qualityStandard', minWidth: '120' },
            // 备注
            { show: true, prop: 'remarks', label: 'fConfig.remarks', minWidth: '120' },
            // 操作
            {
                show: true, prop: 'operate', formType: 'operate', label: 'fConfig.operate', minWidth: '100',
                buts: [
                    { name: 'button.edit', class: 'warning', fn: 'handleEdit', authCode: 'update', enable: true },
                    { name: 'button.delete', class: 'danger', fn: 'handleDelete', authCode: 'delete', enable: true }
                ]
            }
        ]
    },
    mainFormConfig: {
        formList: [
            // 项目名称
            {
                label: 'fConfig.projectName', prop: 'projectName', span: 24, formType: 'project', key: 'projectId',
                isRelation: true, relationList: [
                    { receive: 'projectCode', value: 'projectCode' }
                ], isRule: true
            },
            // 项目编号
            { label: 'fConfig.projectCode', prop: 'projectCode', span: 24, formType: 'input', inputStatus: 'disable' },
            // 材料名称
            { label: 'historyMateria.materialName', prop: 'materialName', span: 24, formType: 'input', maxlength: 128, isRule: true },
            // 规格
            { label: 'fConfig.standards', prop: 'standards', span: 24, formType: 'input', maxlength: 64, isRule: false },
            // 型号
            { label: 'fConfig.models', prop: 'models', span: 24, formType: 'input', maxlength: 64, isRule: false },
            // 品牌
            { label: 'fConfig.brand', prop: 'brand', span: 24, formType: 'input', maxlength: 128, isRule: false },
            // 单位
            { label: 'fConfig.unit', prop: 'unit', span: 24, formType: 'input', maxlength: 32, isRule: false },
            // 所属分类
            { label: 'historyMateria.classifyName', prop: 'classifyName', span: 24, formType: 'input', maxlength: 64, isRule: false },
            // 数量
            { label: 'fConfig.quantity', prop: 'quantity', span: 24, formType: 'elNumber', maxlength: 12, precision: 2, min: 0 },
            // 含税单价
            {
                label: 'historyMateria.includeUnitPrice', prop: 'includeUnitPrice', span: 24, formType: 'elNumber', maxlength: 12,
                precision: 2, min: 0, otherOperate: true, otherOperateFun: 'hanldeSetMoney'
            },
            // 含税总价
            {
                label: 'historyMateria.includeTaxAmount', prop: 'includeTaxAmount', span: 24, formType: 'elNumber', maxlength: 12,
                precision: 2, min: 0, otherOperate: true, otherOperateFun: 'hanldeSetMoney'
            },
            // 供应商名称
            { label: 'historyMateria.supplierName', prop: 'supplierName', span: 24, formType: 'input', maxlength: 64, isRule: false },
            // 质量标准
            { label: 'historyMateria.qualityStandard', prop: 'qualityStandard', span: 24, formType: 'input', maxlength: 64, isRule: false },
            // 排序
            // { label: 'fConfig.sorts', prop: 'sorts', span: 24, formType: 'elNumber', maxlength: 12, precision: 0, min: 0 },
            // 备注
            { label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'input', maxlength: 255 }
            // 附件
            // { label: 'fConfig.img', prop: 'attachment', span: 24, formType: 'upload', arrayNumber: 1, limit: 1, multiple: false, isPhoto: true }
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
