/*
 * @Author: your name
 * @Date: 2021-01-28 11:46:12
 * @LastEditTime: 2022-02-22 17:12:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\components\gantt\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
    },
    // 数据字典
    dictionary: [
        // { dicCode: 'limitTypeCode', propCode: 'limitTypeCode' },
        // { dicCode: 'linkType', propCode: 'linkType' }
    ],
    // 接口数据
    selectList: [],
    // 主表
    mainFormConfig: {
        formList: [
            // 任务名称
            { label: 'dialog.taskName', prop: 'text', span: 12, formType: 'input', isRule: true, maxlength: 64 },
            // 责任人
            {
                label: 'dialog.dutyUserName', prop: 'dutyUserName', span: 12, formType: 'userRadio', isRule: false, key: 'dutyUserId'
            },
            // // 工期
            // {
            //     label: 'dialog.duration', prop: 'duration', span: 12, formType: 'elNumber', isRule: true,
            //     min: 0, precision: 0, otherOperate: true, otherOperateFun: 'handleAtuoDuration', inputStatus: 'disable'
            // },
            // 工时
            { label: 'dialog.hours', prop: 'hours', span: 12, formType: 'input', isRule: true, inputStatus: 'disable' },
            // 计划开始日期
            {
                label: 'dialog.start_date', prop: 'start_date', span: 12, formType: 'date', isRule: true, otherOperate: true, otherOperateFun: 'handleAtuoDuration'
            },
            // 计划完成日期
            { label: 'dialog.end_date', prop: 'end_date', span: 12, formType: 'date', isRule: true },
            // 备注
            {
                label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256,
                printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, minRows: 1
            },
            // 实际开始日期
            { label: 'dialog.realStartDate', prop: 'realStartDate', span: 12, formType: 'date', inputStatus: 'disable' },
            // 实际完成日期
            { label: 'dialog.realEndDate', prop: 'realEndDate', span: 12, formType: 'date', inputStatus: 'disable' },
            // 任务创建人
            // { label: 'dialog.createByTaskName', prop: 'createByName', span: 12, formType: 'input', inputStatus: 'disable' },
            // 任务创建时间
            { label: 'dialog.createTaskTime', prop: 'createTime', span: 12, formType: 'date', inputStatus: 'disable' },
            // 最后修改人
            // { label: 'fConfig.updateByName', prop: 'updateByName', span: 12, formType: 'input', inputStatus: 'disable' },
            // 最后修改时间
            { label: 'fConfig.updateTime', prop: 'updateTime', span: 12, formType: 'date', inputStatus: 'disable' }
        ],
        oldRelationList: []
    },
    seniorConfig: {
        formList: [
            // 限制类型
            {
                label: 'dialog.limitTypeCode', prop: 'limitTypeCode', span: 12, formType: 'dicSelect', selectList: [],
                relationList: [{ receive: 'limitTypeName', value: 'dataName' }]
            },
            // 计划完成日期
            { label: 'dialog.limitDate', prop: 'limitDate', span: 12, formType: 'date' },
            // 任务/里程碑  Milestone  Task Project
            {
                label: 'dialog.ifMilepostNode', prop: 'type', span: 12, formType: 'slot', isTranslate: true,
                selectList: [{ value: 'milestone', label: 'dialog.Milestone' }, { value: 'task', label: 'dialog.Task' }]
            },
            // 关键任务
            {
                label: 'dialog.ifCruxTask', prop: 'ifCruxTask', span: 12, formType: 'radio', isTranslate: true,
                selectList: [{ value: '01', label: 'tips.yes' }, { value: '02', label: 'tips.no' }]
            },
            // 任务名称
            { label: 'dialog.wbs', prop: 'wbs', span: 12, formType: 'elNumber', isRule: false, maxlength: 10, precision: 2 }
        ]
    },
    // 子表
    subTableConfig: {
        // 明细清单
        detailedTable: {
            subTableName: 'detailedTable',
            // 子表按钮
            subTableButton: [
                { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'detailedTable', disabled: false },
                { noAuth: true, code: 'sysHandleAdd', subTableCode: 'detailedTable', disabled: false }
            ],
            tableList: {
                // 表头配置
                slaveColumns: [
                    // // 任务编号
                    // {
                    //     label: 'dialog.taskNumber', prop: 'taskNumber', formType: 'text', maxlength: 64,
                    //     printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                    // },
                    // 工程量名称或描述
                    {
                        label: 'dialog.reportProjectDetailName', prop: 'projectDetailName', formType: 'input', maxlength: 64,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0, isRule: true
                    },
                    //  工程量数量
                    {
                        label: 'dialog.projectDetailQuantity', prop: 'projectDetailQuantity', formType: 'number', minWidth: 120,
                        printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0, precision: 2, isRule: true
                    },
                    //  人工
                    { label: 'dialog.reportLabour', prop: 'reportLabour', formType: 'slot', minWidth: '120' },
                    //  机械
                    { label: 'dialog.reportMaterial', prop: 'reportMaterial', formType: 'slot', minWidth: '120' },
                    //  材料
                    { label: 'dialog.reportMachinery', prop: 'reportMachinery', formType: 'slot', minWidth: '120' },
                    //  其他
                    { label: 'dialog.other', prop: 'other', formType: 'slot', minWidth: '120' },
                    // 操作
                    {
                        formType: 'operate', label: 'fConfig.operate', minWidth: '80',
                        buts: [
                            { name: 'button.delete', class: 'danger', fn: 'sysHandleDelete', disabled: false }
                        ]
                    }
                ],
                // 校验
                rules: {
                    projectDetailName: [{ required: true, trigger: 'blur' }],
                    projectDetailQuantity: [{ required: true, trigger: 'blur' }]
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
