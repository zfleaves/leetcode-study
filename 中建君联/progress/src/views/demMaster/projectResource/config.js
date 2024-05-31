/*
 * @Author: your name
 * @Date: 2021-04-14 09:35:10
 * @LastEditTime: 2021-04-16 12:00:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMaster\projectResource\config.js
 */
import Utils from 'util';

const PageConfig = {
    formCode: 'leasePurchaseApply',
    // 流程
    processParmas: {
        exportUrl: {
            url: 'projectResource/exporttPage'
        }
    },
    // 数据字典
    dictionary: [
        { dicCode: 'accountType', propCode: 'accountType' }
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
            // 取数来源
            { show: true, label: 'projectResource.accountType', prop: 'accountType', span: 8, formType: 'dicSelect', selectList: [] },
            // 所属公司
            { show: true, label: 'dialog.orgName', prop: 'orgName', span: 8, formType: 'input', maxlength: 64 },
            // 项目名称
            { show: true, label: 'dialog.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64 },
            // 资源类型
            {
                show: true, label: 'dialog.resourceTypeValue', prop: 'resourceTypeCode', span: 8, formType: 'dicSelect',
                selectList: [
                    { dataName: 'dialog.reportLabour', dataCode: '01' },
                    { dataName: 'dialog.reportMaterial', dataCode: '02' },
                    { dataName: 'dialog.reportMachinery', dataCode: '03' },
                    { dataName: 'dialog.reportOther', dataCode: '04' }
                ], isTranslate: true
            },
            // 资源名称
            { show: true, label: 'dialog.resourceName', prop: 'resourceName', span: 8, formType: 'input', maxlength: 32 }
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
        rowKey: 'rowKey',
        //  单选
        isRadio: false,
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
            // // 数据来源
            // {
            //     show: true, prop: 'accountType', label: 'projectResource.accountType', formType: 'dicSelect', minWidth: '100',
            //     align: 'center', selectList: []
            // },
            // 所属公司
            { show: true, prop: 'orgName', label: 'dialog.orgName' },
            // 项目名称
            { show: true, prop: 'projectName', label: 'dialog.projectName' },
            // 数据来源
            { show: true, prop: 'dataSourceValue', label: 'dialog.dataSourceValue', minWidth: '120', formType: 'slot' },
            // 资源类型
            { show: true, prop: 'resourceTypeValue', label: 'dialog.resourceTypeValue', minWidth: '100', formType: 'slot' },
            // 资源名称
            { show: true, prop: 'resourceName', label: 'dialog.resourceName' },
            // 规格
            { show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '100' },
            // 单位
            { show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '60' },
            // 数量
            { show: true, prop: 'inputQuantity', label: 'dialog.inputQuantity', minWidth: '100' },
            // 金额(含税)
            { show: true, formType: 'setMoney', prop: 'includeTaxAmount', label: 'dialog.includeTaxAmount', minWidth: '120', filterName: 'setMoney' },
            // 单价(含税)
            { show: true, formType: 'setMoney', prop: 'includeUnitPrice', label: 'dialog.includeUnitPrice', minWidth: '110', filterName: 'setMoney'},
            // 税率
            { show: true, prop: 'taxRate', label: 'dialog.taxRate', minWidth: '80', filterName: 'taxRate' },
            // 税额
            { show: true, formType: 'setMoney', prop: 'taxAmount', label: 'dialog.taxAmount', minWidth: '120', filterName: 'setMoney'},
            // 金额(不含税)
            { show: true, formType: 'setMoney', prop: 'excludeTaxAmount', label: 'dialog.excludeTaxAmount', minWidth: '110', filterName: 'setMoney' },
            // 单价(不含税)
            { show: true, formType: 'setMoney', prop: 'excludeUnitPrice', label: 'dialog.excludeUnitPrice', minWidth: '110', filterName: 'setMoney' },
            // 所属周期/月份
            { show: true, prop: 'applyWeekIdentify', label: 'projectResource.weekreportDocNo', minWidth: '140', formType: 'slot' }
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
