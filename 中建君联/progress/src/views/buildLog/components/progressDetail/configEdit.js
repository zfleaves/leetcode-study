/*
 * @Author: your name
 * @Date: 2022-02-22 14:56:14
 * @LastEditTime: 2022-03-03 15:42:30
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \web_projectprogress-项目进度管理云\src\components\gantt\resourceDetail\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        // 明细模板下载
        dowanloadDetail: {
            url: 'demMonthPlan/downloadResourceDetailTemplate',
            tableName: 'projectBidQuantitiesDetail'
        }
    },
    // 数据字典
    dictionary: [
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
                // 选择明细
                { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'resourcesDetail', disabled: false },
                { noAuth: true, code: 'sysHandleDeletaAdd', subTableCode: 'resourcesDetail', disabled: false },
                { noAuth: true, code: 'sysHandleDownloadTemplate', subTableCode: 'resourcesDetail', disabled: false },
                // 明细导入
                {
                    noAuth: true, code: 'sysHandleImport', subTableCode: 'resourcesDetail', disabled: false, slot: true,
                    name: 'fConfig.sysHandleDetailImport'
                },
                { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'resourcesDetail', disabled: false }
            ],
            tableList: {
                // 表头配置
                slaveColumns: [
                    // 数据来源
                    { label: 'dialog.dataSourceValue', prop: 'dataSourceValue', formType: 'text', minWidth: 100 },
                    // 资源类型
                    { label: 'dialog.resourceTypeValue', prop: 'resourceTypeValue', formType: 'text', minWidth: 100 },
                    // 名称
                    { label: 'dialog.costMaterialName', prop: 'resourceName', formType: 'slot', maxlength: 64 },
                    // 规格
                    { label: 'fConfig.standards', prop: 'standards', formType: 'slot', maxlength: 64 },
                    // 单位
                    { label: 'fConfig.unit', prop: 'unit', formType: 'slot', minWidth: 120, maxlength: 64 },
                    // 资源分解数量
                    {
                        label: 'fConfig.resourceQuantity', prop: 'resourceQuantity', formType: 'text',
                        operateData: true, precision: 4, maxlength: 10, minWidth: 100, min: 0
                    },
                    // // 已投入数量
                    // {
                    //     label: 'fConfig.alreadyQuantity', prop: 'alreadyInputQuantity', formType: 'text',
                    //     operateData: true, precision: 4, maxlength: 10, minWidth: 100, min: 0
                    // },
                    // 本次投入数量
                    {
                        label: 'dialog.currentQuantity', prop: 'inputQuantity', formType: 'number',
                        operateData: true, precision: 4, maxlength: 10, minWidth: 120, min: 0
                    },
                    // 税率
                    {
                        label: 'fConfig.taxRate', prop: 'taxRate', formType: 'dicSelect', maxlength: 255,
                        operateData: true, precision: 2, minWidth: 100, min: 0, selectList: []
                    },
                    // 单价(含税)
                    {
                        label: 'fConfig.includeUnitPrice', prop: 'includeUnitPrice', formType: 'number', maxlength: 255,
                        operateData: true, precision: 2, minWidth: 100, min: 0, filterName: 'setMoney'
                    },
                    // 金额(含税)
                    {
                        label: 'fConfig.includeTaxAmount', prop: 'includeTaxAmount', formType: 'number', maxlength: 255,
                        operateData: true, precision: 2, minWidth: 100, min: 0
                    },
                    // 单价(不含税)
                    {
                        label: 'fConfig.unitPrice', prop: 'excludeUnitPrice', formType: 'number', maxlength: 255,
                        operateData: true, precision: 8, minWidth: 100, min: 0, filterName: 'setMoney'
                    },
                    // 金额(不含税)
                    {
                        label: 'fConfig.excludeTaxAmount', prop: 'excludeTaxAmount', formType: 'number', maxlength: 255,
                        operateData: true, precision: 2, minWidth: 100, min: 0, filterName: 'setMoney'
                    },
                    // 税额
                    {
                        label: 'fConfig.taxAmount', prop: 'taxAmount', formType: 'number', maxlength: 255,
                        precision: 2, minWidth: 100, min: 0, filterName: 'setMoney'
                    },
                    // 备注
                    { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255 }
                ],
                // 校验
                rules: {
                    resourceName: [{ required: true, trigger: 'blur' }],
                    standards: [{ required: true, trigger: 'blur' }],
                    unit: [{ required: true, trigger: 'blur' }],
                    quantity: [{ required: true, trigger: 'blur' }],
                    taxRate: [{ required: true, trigger: 'change' }],
                    // includeUnitPrice: [{ required: true, trigger: 'blur' }],
                    includeTaxAmount: [{ required: true, trigger: 'blur' }]
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
