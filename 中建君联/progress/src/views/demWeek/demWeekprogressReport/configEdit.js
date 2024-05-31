/*
 * @Author: your name
 * @Date: 2021-02-01 17:09:53
 * @LastEditTime: 2022-03-02 14:32:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demWeek\demWeekprogressReport\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        // 获取下一个节点的处理人信息
        nextInfo: {
            url: 'demWeekprogressReport/getWorkflowNextNode',
            parmasList: [
                { receive: 'sid', value: 'taskSid' },
                { receive: 'projectId', value: 'projectId' }
            ]
        },
        // 流程审批
        approveSubmit: {
            url: 'demWeekprogressReport/setWorkflowApprove'
        },
        // 删除
        deleteParams: {
            url: 'demWeekprogressReport/setDelete',
            params: 'weekprogressReportId'
        },
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
        { dicCode: 'overallCompleteCode', propCode: 'overallCompleteCode' },
        { dicCode: 'warnStatus', propCode: 'warnStatusCode' }
    ],
    // 接口数据
    selectList: [],
    // 主表
    mainFormConfig: {
        formList: [
            // 单据编号
            {
                label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 填写人
            {
                label: 'fConfig.createByName', prop: 'createByName', span: 8, formType: 'input', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 填写日期
            {
                label: 'fConfig.createTime', prop: 'createTime', span: 8, formType: 'date', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目名称
            {
                label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'project', key: 'projectId',
                isRelation: true,
                relationList: [
                    { receive: 'projectCode', value: 'projectCode' }
                ],
                isRule: true, check: true,
                relationTable: ['progressWeekProgressReportDetail'],
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // // 项目编号
            // {
            //     label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
            //     printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            // },
            // 填报周期
            {
                label: 'demWeekprogressReport.applyWeek', prop: 'applyDate', span: 8, formType: 'week', check: true, isRule: true, filterName: 'week',
                relationTable: ['progressWeekProgressReportDetail'], isRelation: true, isRelationTable: true, clearable: false,
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 预警状态
            {
                label: 'demWeekprogressReport.warnStatusValue', prop: 'warnStatusCode', span: 8, formType: 'dicSelect', selectList: []
            },
            // // 整体完成情况
            // {
            //     label: 'demWeekprogressReport.overallCompleteValue', prop: 'overallCompleteCode', span: 8, formType: 'dicSelect', selectList: []
            // },
            // 工程总体进展情况
            {
                label: 'demWeekprogressReport.overallCompleteValue', prop: 'overallCompleteValue', span: 24, formType: 'textarea', maxlength: 256,
                isRule: false, minRows: 2
            },
            // 主要完成任务及概述
            {
                label: 'demWeekprogressReport.overallTaskOverview', prop: 'overallTaskOverview', span: 24, formType: 'textarea', maxlength: 512,
                inputStatus: 'disable', minRows: 2, placeholder: 'demWeekprogressReport.overallTaskOverviewTips'
            },
            // 总计划形象进度
            {
                label: 'demWeekprogressReport.masterImageProgress', prop: 'masterImageProgress', span: 24, formType: 'textarea', maxlength: 512,
                isRule: false, minRows: 2
            },
            // 总进度计划偏差及风险分析
            {
                label: 'demWeekprogressReport.masterRiskAnalysis', prop: 'masterRiskAnalysis', span: 24, formType: 'textarea', maxlength: 512,
                isRule: false, minRows: 2
            },
            // 纠偏措施
            {
                label: 'demWeekprogressReport.correcteAction', prop: 'correcteAction', span: 24, formType: 'textarea', maxlength: 256,
                isRule: false, minRows: 2
            },
            // 附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' }
        ],
        oldRelationList: []
    },
    subTableMatch: [
        { value: 'demWeekprogressReportDetails', assignment: 'progressWeekProgressReportDetail' }
    ],
    // 子表
    subTableConfig: {
        // 明细清单
        progressWeekProgressReportDetail: {
            subTableName: 'progressWeekProgressReportDetail',
            titleTips: 'demandMonthPlanDetailTips',
            isSelection: true,
            // 子表按钮
            subTableButton: [
                { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'progressWeekProgressReportDetail', disabled: false },
                { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'progressWeekProgressReportDetail', disabled: false, name: 'demWeekprogressReport.getDetail' },
                { noAuth: true, code: 'sysHandleGetApplyData', subTableCode: 'progressWeekProgressReportDetail', disabled: false,
                name: 'demWeekprogressReport.getApplyData', isCustom: true, icon: 'el-icon-plus' }
            ],
            tableList: {
                // 表头配置
                slaveColumns: [
                    // // 任务编号
                    // {
                    //     label: 'dialog.taskNumber', prop: 'taskNumber', formType: 'text', maxlength: 64,
                    //     printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                    // },
                    // 任务名称
                    {
                        label: 'dialog.taskName', prop: 'taskName', formType: 'text', maxlength: 32,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 责任人
                    {
                        label: 'dialog.dutyUserName', prop: 'dutyUserName', formType: 'text', maxlength: 64,
                        printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0, minWidth: 80
                    },
                    // 计划开始日期
                    {
                        label: 'dialog.start_date', prop: 'planStartDate', formType: 'text', maxlength: 32, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'date'
                    },
                    // 实际开始日期
                    {
                        label: 'dialog.realStartDate', prop: 'realStartDate', formType: 'date', minWidth: 100,
                        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'date'
                    },
                    //  计划工期(days)
                    {
                        label: 'dialog.planDuration', prop: 'planDuration', formType: 'text', filterName: 'number', minWidth: 120,
                        printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    //  已完成进度(%)
                    {
                        label: 'demWeekprogressReport.alreadyFinishedProgress', prop: 'alreadyFinishedProgress', formType: 'slot', filterName: 'number',
                        minWidth: 120
                    },
                    // 本周完成进度(%)
                    {
                        label: 'demWeekprogressReport.currentFinishProgress', prop: 'currentFinishProgress', formType: 'slot',
                        operateData: true, precision: 4, maxlength: 10, minWidth: 130, minValue: 'alreadyFinishedProgress'
                    },
                    // 计划完成工作内容
                    {
                        label: 'dialog.planFinishContent', prop: 'planFinishContent', formType: 'text', maxlength: 255,
                        printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0, minWidth: 130
                    },
                    // 实际完成进度(%)
                    {
                        label: 'demWeekprogressReport.realFinishProgress', prop: 'realFinishProgress', formType: 'slot',
                        operateData: true, precision: 2, maxlength: 10, minWidth: 150, minValue: 'alreadyFinishedProgress'
                    },
                    // 实际完成工作内容
                    {
                        label: 'demWeekprogressReport.realFinishContent', prop: 'realFinishContent', formType: 'input', maxlength: 255, minWidth: 150,
                        printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                    },
                    // 备注
                    {
                        label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
                        printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                    }
                ],
                // 校验
                rules: {
                    realStartDate: [{ required: true, trigger: 'change' }],
                    realFinishContent: [{ required: true, trigger: 'blur' }]
                },
                // 初始化行数据
                tableDataRow: {},
                childrenSlaveColumns: [
                    // 工程量名称或描述
                    {
                        label: 'dialog.reportProjectDetailName', prop: 'projectDetailName', formType: 'text', maxlength: 64,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    //  工程量数量
                    {
                        label: 'dialog.projectDetailQuantity', prop: 'projectDetailQuantity', formType: 'text', minWidth: 120,
                        printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0, precision: 2, isRule: true
                    },
                    //  已完成数量
                    {
                        label: 'dialog.alreadyDetailQuantity', prop: 'alreadyDetailQuantity', formType: 'text', minWidth: 120,
                        printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0, precision: 2, isRule: true
                    },
                    //  计划完成数量
                    {
                        label: 'fConfig.currentDetailQuantity', prop: 'planDetailQuantity', formType: 'text', minWidth: 120,
                        printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0, precision: 2
                    },
                    //  实际完成数量
                    {
                        label: 'demWeekprogressReport.currentDetailQuantity', prop: 'currentDetailQuantity', formType: 'number', minWidth: 120,
                        printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0, precision: 2, isRule: true
                    },
                    // 人工
                    {
                        label: 'dialog.reportLabour', prop: 'weekprogressReportLabours', code: '01',
                        fn: 'handleSelectResources', formType: 'slot', value: '人工'
                    },
                    // 材料
                    {
                        label: 'dialog.reportMaterial', prop: 'weekprogressReportMaterials', code: '02',
                        fn: 'handleSelectResources', formType: 'slot', value: '材料'
                    },
                    // 机械
                    {
                        label: 'dialog.reportMachinery', prop: 'weekprogressReportMachineries', code: '03',
                        fn: 'handleSelectResources', formType: 'slot', value: '机械'
                    },
                    // 其它
                    {
                        label: 'dialog.reportOther', prop: 'weekprogressReportOthers', code: '05',
                        fn: 'handleSelectResources', formType: 'slot', value: '其它'
                    },
                    // 备注
                    {
                        label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
                        printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                    },
                    // 操作
                    {
                        formType: 'operate', label: 'fConfig.operate', minWidth: '80',
                        buts: [
                            { name: 'button.delete', class: 'danger', fn: 'sysHandleDelete', disabled: false, childCode: 'childrenName' }
                        ]
                    }
                ],
                childrenRule: {
                    currentDetailQuantity: [{ required: true, trigger: 'blur' }]
                }
            }, // 子表配置
            tableData: [], // 子表数据,
            childrenName: 'details',
            childrenRowKey: 'gantResourceId'
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
