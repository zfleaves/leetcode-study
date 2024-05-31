/*
 * @Author: your name
 * @Date: 2021-01-26 09:58:11
 * @LastEditTime: 2022-03-02 14:07:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\buildLog\buildLogApply\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        // 获取下一个节点的处理人信息
        nextInfo: {
            url: 'buildLogApply/getWorkflowNextNode',
            parmasList: [
                { receive: 'sid', value: 'taskSid' },
                { receive: 'projectId', value: 'projectId' }
            ]
        },
        // 流程审批
        approveSubmit: {
            url: 'buildLogApply/setWorkflowApprove'
        },
        // 删除
        deleteParams: {
            url: 'buildLogApply/setDelete',
            params: 'buildLogApplyId'
        },
        // info
        infoUrl: {
            url: 'buildLogApply/getInfo',
            params: 'buildLogApplyId'
        },
        // save
        saveUrl: {
            url: 'buildLogApply/setEdit'
        }
    },
    // 数据字典
    dictionary: [
        // { dicCode: 'outboundType', propCode: 'outboundTypeCode' },
        // { dicCode: 'taxRate', propCode: 'taxRate' }
    ],
    // 接口数据
    selectList: [],
    // 主表
    mainFormConfig: {
        formList: [
            { label: 'buildLogApply.formTips', prop: 'formTips', span: 24, formType: 'slot' },
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
            // 日期
            {
                label: 'buildLogApply.applyDate', prop: 'applyDate', span: 8, formType: 'date', isRule: true,
                otherOperate: true, otherOperateFun: 'handleCheckProjectApply'
            },
            // 项目名称
            {
                label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'slot', key: 'projectId',
                isRelation: true,
                relationList: [
                    { receive: 'projectCode', value: 'projectCode' }
                ],
                isRule: true, relationTable: ['progressBulildlogapplyDetail'],
                otherOperate: true, otherOperateFun: 'handleCheckProjectApply'
            },
            // // 项目编号
            // {
            //     label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
            //     printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            // },
            // 日志类型
            {
                label: 'buildLogApply.logTypeName', prop: 'logTypeName', span: 8, formType: 'input', inputStatus: 'disable',
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 施工部位
            {
                label: 'buildLogApply.constructionPosition', prop: 'constructionPosition', span: 24, formType: 'textarea', maxlength: 256,
                printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, minRows: 3
            },
            // 突发事件
            {
                label: 'buildLogApply.suddenEvent', prop: 'suddenEvent', span: 24, formType: 'textarea', maxlength: 256,
                printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, minRows: 3
            },
            // 施工生产情况记录
            {
                label: 'buildLogApply.finishedSituation', prop: 'finishedSituation', span: 24, formType: 'textarea',
                maxlength: 512, isRule: true, minRows: 3
            },
            // 技术质量安全工作记录
            {
                label: 'buildLogApply.safeWorkRecord', prop: 'safeWorkRecord', span: 24, formType: 'textarea',
                maxlength: 512, isRule: true, minRows: 3
            },
            // 明日计划
            {
                label: 'buildLogApply.tomorrowPlanSituation', prop: 'tomorrowPlanSituation', span: 24, formType: 'textarea', maxlength: 256,
                printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, minRows: 2
            },
            // 附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' },
            // 天气
            { label: 'buildLogApply.weather', prop: 'weather', span: 24, formType: 'divisionTitle' },
            // 上午
            { label: 'buildLogApply.morning', prop: 'title', span: 24, formType: 'title' },
            // 天气
            { label: 'buildLogApply.morningWeather', prop: 'morningWeather', span: 12, formType: 'input', maxlength: 32 },
            // 风向
            { label: 'buildLogApply.morningWindDirection', prop: 'morningWindDirection', span: 12, formType: 'input', maxlength: 32 },
            // 温度
            { label: 'buildLogApply.morningTemperature', prop: 'morningTemperature', span: 12, formType: 'slot', maxlength: 32 },
            // 风力
            { label: 'buildLogApply.morningWindPower', prop: 'morningWindPower', span: 12, formType: 'input', maxlength: 32 },
            // 下午
            { label: 'buildLogApply.afternoon', prop: 'title', span: 24, formType: 'title' },
            // 天气
            { label: 'buildLogApply.afternoonWeather', prop: 'afternoonWeather', span: 12, formType: 'input', maxlength: 32 },
            // 风向
            { label: 'buildLogApply.afternoonWindDirection', prop: 'afternoonWindDirection', span: 12, formType: 'input', maxlength: 32 },
            // 温度
            { label: 'buildLogApply.afternoonTemperature', prop: 'afternoonTemperature', span: 12, formType: 'slot', maxlength: 32 },
            // 风力
            { label: 'buildLogApply.afternoonWindPower', prop: 'afternoonWindPower', span: 12, formType: 'input', maxlength: 32 }
        ],
        oldRelationList: []
    },
    subTableMatch: [
        { value: 'details', assignment: 'progressBulildlogapplyDetail' }
    ],
    // 子表
    subTableConfig: {
        // 明细清单
        progressBulildlogapplyDetail: {
            subTableName: 'progressBulildlogapplyDetail',
            titleTips: 'buildLogApplyDetailTips',
            isSelection: true,
            // 子表按钮
            subTableButton: [
                { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'progressBulildlogapplyDetail', disabled: false },
                { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'progressBulildlogapplyDetail', disabled: false }
            ],
            tableList: {
                // 表头配置
                slaveColumns: [
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
                    //  填写完成进度(%)
                    {
                        label: 'buildLogApply.alreadyFinishedProgress', prop: 'alreadyFinishedProgress', formType: 'slot', filterName: 'number', minWidth: 130
                    },
                    // 本日完成进度(%)
                    {
                        label: 'buildLogApply.currentFinishProgress', prop: 'currentFinishProgress', formType: 'slot',
                        operateData: true, precision: 2, maxlength: 10, minWidth: 150, minValue: 'alreadyFinishedProgress'
                    },
                    // 本日完成工作内容
                    {
                        label: 'buildLogApply.currentFinishContent', prop: 'currentFinishContent', formType: 'input', maxlength: 255,
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
                    realStartDate: [{ required: true, trigger: 'blur' }]
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
                    //  本次完成数量
                    {
                        label: 'dialog.currentDetailQuantity', prop: 'currentDetailQuantity', formType: 'number', minWidth: 120,
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
