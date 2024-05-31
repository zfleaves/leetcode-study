/*
 * @Author: your name
 * @Date: 2021-01-29 17:27:24
 * @LastEditTime: 2022-02-28 13:59:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMonth\demMonthPlan\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        // 获取下一个节点的处理人信息
        nextInfo: {
            url: 'demMonthPlan/getWorkflowNextNode',
            parmasList: [
                { receive: 'sid', value: 'taskSid' },
                { receive: 'projectId', value: 'projectId' }
            ]
        },
        // 流程审批
        approveSubmit: {
            url: 'demMonthPlan/setWorkflowApprove'
        },
        // 删除
        deleteParams: {
            url: 'demMonthPlan/setDelete',
            params: 'monthPlanId'
        },
        // info
        infoUrl: {
            url: 'demMonthPlan/getInfo',
            params: 'monthPlanId'
        },
        // save
        saveUrl: {
            url: 'demMonthPlan/setEdit'
        }
    },
    // 数据字典
    dictionary: [
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
                relationTable: ['progressMonthPlanDetail'],
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // // 项目编号
            // {
            //     label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
            //     printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            // },
            // 所属月份
            {
                label: 'demMonthPlan.applyMonth', prop: 'applyMonth', span: 8, formType: 'month', isRule: true,
                relationTable: ['progressMonthPlanDetail'], isRelation: true, isRelationTable: true, clearable: false
                // pickerOptions: {
                //     disabledDate(time) {
                //         console.log(time);
                //         // return time.getTime() < new Date().getTime() + 60 * 60 * 1000 * 24;
                //         return time.getTime() > new Date().getTime();
                //     }
                // }
            },
            // 月度主要任务概述
            {
                label: 'demMonthPlan.taskOverview', prop: 'taskOverview', span: 24, formType: 'textarea', maxlength: 256,
                printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, minRows: 2
            },
            // 风险预估
            {
                label: 'demMonthPlan.riskEstimate', prop: 'riskEstimate', span: 24, formType: 'textarea', maxlength: 256,
                printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, minRows: 2
            },
            // 资源需求计划
            {
                label: 'demMonthPlan.resourceRequiredPlan', prop: 'resourceRequiredPlan', span: 24, formType: 'textarea', maxlength: 256,
                printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, minRows: 2
            },
            // 附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' }
        ],
        oldRelationList: []
    },
    subTableMatch: [
        { value: 'demMonthPlanDetails', assignment: 'progressMonthPlanDetail' }
    ],
    // 子表
    subTableConfig: {
        // 明细清单
        progressMonthPlanDetail: {
            subTableName: 'progressMonthPlanDetail',
            titleTips: 'demandMonthPlanDetailTips',
            isSelection: true,
            // 子表按钮
            subTableButton: [
                { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'progressMonthPlanDetail', disabled: false },
                { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'progressMonthPlanDetail', disabled: false }
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
                        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    //  计划工期(days)
                    {
                        label: 'dialog.planDuration', prop: 'planDuration', formType: 'text', filterName: 'number', minWidth: 120,
                        printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    //  已完成进度(%)
                    {
                        label: 'demMonthPlan.alreadyFinishedProgress', prop: 'alreadyFinishedProgress', formType: 'slot', filterName: 'number', minWidth: 120
                    },
                    // 本月完成进度
                    {
                        label: 'demMonthPlan.currentFinishProgress', prop: 'currentFinishProgress', formType: 'slot',
                        operateData: true, precision: 2, maxlength: 10, minWidth: 180, minValue: 'alreadyFinishedProgress'
                    },
                    // 计划完成工作内容
                    {
                        label: 'dialog.planFinishContent', prop: 'planFinishContent', formType: 'input', maxlength: 255,
                        printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0, minWidth: 130
                    },
                    // 备注
                    {
                        label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
                        printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                    }
                ],
                // 校验
                rules: {
                    // realStartDate: [{ required: true, trigger: 'blur' }]
                },
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
                        label: 'fConfig.currentDetailQuantity', prop: 'currentDetailQuantity', formType: 'number', minWidth: 120,
                        printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0, precision: 2, isRule: true
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
                },
                // 初始化行数据
                tableDataRow: {}
            }, // 子表配置
            tableData: [], // 子表数据
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

