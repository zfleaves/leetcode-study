/*
 * @Author: your name
 * @Date: 2021-04-12 17:06:44
 * @LastEditTime: 2021-12-16 17:25:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMaster\component\weekResources\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        // info
        infoUrl: {
            url: 'demWeekprogressReport/getInfo',
            params: 'weekprogressReportId'
        },
        // save
        saveUrl: {
            url: 'demWeekprogressReport/setEdit'
        }
    },
    // 数据字典
    dictionary: [
        { dicCode: 'currencyType', propCode: 'currencyCode' },
        { dicCode: 'taxRate', propCode: 'taxRate' }
    ],
    // 接口数据
    selectList: [],
    subTableMatch: [
        { value: 'resourcesDetail', assignment: 'resourcesDetail' }
    ],
    // 子表
    subTableConfig: {
        // 明细清单
        resourcesDetail: {
            subTableName: 'resourcesDetail',
            titleTips: 'resourcesDetailTips',
            isSelection: true,
            // 子表按钮
            subTableButton: [
                { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'resourcesDetail', disabled: false },
                { noAuth: true, code: 'sysHandleDeletaAdd', subTableCode: 'resourcesDetail', disabled: false },
                { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'resourcesDetail', disabled: false, slot: true }
            ],
            tableList: {
                // 表头配置
                slaveColumns: [
                    // 所属周期
                    { label: 'demMonthprogressReport.weekreportDocNo', prop: 'weekreportDocNo', formType: 'slot', minWidth: 120 },
                    // 数据来源
                    { label: 'dialog.dataSourceValue', prop: 'dataSourceValue', formType: 'slot', minWidth: 100 },
                    // 资源类型
                    { label: 'dialog.resourceTypeValue', prop: 'resourceTypeValue', formType: 'slot', minWidth: 80 },
                    // 资源名称
                    { label: 'dialog.resourceName', prop: 'resourceName', formType: 'input', minWidth: 80, maxlength: 64 },
                    // 规格
                    { label: 'fConfig.standards', prop: 'standards', formType: 'input', minWidth: 100, maxlength: 64 },
                    // 单位
                    { label: 'fConfig.unit', prop: 'unit', formType: 'input', minWidth: 80, maxlength: 64 },
                    // 投入数量
                    {
                        label: 'dialog.inputQuantity', prop: 'inputQuantity', formType: 'number',
                        operateData: true, precision: 4, maxlength: 10, minWidth: 100, min: 0
                    },
                    // 金额(含税)
                    {
                        label: 'dialog.includeTaxAmount', prop: 'includeTaxAmount', formType: 'number',
                        operateData: true, precision: 2, maxlength: 12, minWidth: 100, filterName: 'setMoney'
                    },
                    // 单价(含税)
                    {
                        label: 'dialog.includeUnitPrice', prop: 'includeUnitPrice', formType: 'number', maxlength: 255,
                        operateData: true, precision: 2, minWidth: 100
                    },
                    // 税率
                    {
                        label: 'dialog.taxRate', prop: 'taxRate', minWidth: 80, formType: 'dicSelect', operateData: true,
                        printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0, selectList: []
                    },
                    // 金额(不含税)
                    {
                        label: 'dialog.excludeTaxAmount', prop: 'excludeTaxAmount', formType: 'number',
                        operateData: true, precision: 2, maxlength: 12, minWidth: 100, filterName: 'setMoney'
                    },
                    // 税额
                    {
                        label: 'dialog.taxAmount', prop: 'taxAmount', formType: 'number', filterName: 'setMoney',
                        operateData: true, precision: 2, maxlength: 12, minWidth: 80
                    },
                    // 单价(不含税)
                    {
                        label: 'dialog.excludeUnitPrice', prop: 'excludeUnitPrice', formType: 'number',
                        operateData: true, precision: 8, maxlength: 12, minWidth: 100
                    },
                    // 备注
                    { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255 }
                ],
                // 校验
                rules: {
                    resourceName: [{ required: true, trigger: 'blur' }],
                    unit: [{ required: true, trigger: 'blur' }]
                },
                // 初始化行数据
                tableDataRow: {}
            }, // 子表配置
            tableData: [] // 子表数据
        }
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
