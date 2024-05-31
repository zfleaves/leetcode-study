/*
 * @Author: your name
 * @Date: 2021-04-14 09:36:56
 * @LastEditTime: 2021-04-14 17:36:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\inspect\inspectReport\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        // 获取下一个节点的处理人信息
        nextInfo: {
            url: 'inspectReport/getWorkflowNextNode',
            parmasList: [
                { receive: 'sid', value: 'taskSid' },
                { receive: 'projectId', value: 'projectId' }
            ]
        },
        // 流程审批
        approveSubmit: {
            url: 'inspectReport/setWorkflowApprove'
        },
        // 删除
        deleteParams: {
            url: 'inspectReport/setDelete',
            params: 'inspectReportId'
        },
        // // 删除明细
        // deleteDetailsParams: {
        //     url: 'inspectReport/setDeleteDetails'
        // },
        // info
        infoUrl: {
            url: 'inspectReport/getInfo',
            params: 'inspectReportId'
        },
        // save
        saveUrl: {
            url: 'inspectReport/setEdit'
        }
    },
    // 数据字典
    dictionary: [
    ],
    // 接口数据
    selectList: [
        { code: 'inspectTypeId', fun: 'inspectType/getList' }
    ],
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
                label: 'fConfig.createTime', prop: 'applyDate', span: 8, formType: 'date', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目名称
            {
                label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'project', key: 'projectId',
                isRelation: true,
                relationList: [
                    { receive: 'projectCode', value: 'projectCode' }
                ],
                relationTable: ['progressInspectReportDetail'], isRule: true
            },
            // 巡检类型
            // {
            //     label: 'inspectRegister.inspectTypeId', prop: 'inspectTypeId', span: 8, formType: 'select',
            //     selectList: [], isRule: true, nameCode: 'inspectTypeName', valueCode: 'id'
            // },
            { label: 'inspectReport.inspectTypeValue', prop: 'inspectTypeValue', span: 8, formType: 'slot', inputStatus: 'disable' },
            // 巡查人员
            { label: 'inspectReport.inspectUserName', prop: 'inspectUserName', span: 8, formType: 'input', maxlength: 32, isRule: true },
            // 巡查部位
            { label: 'inspectReport.inspectPosition', prop: 'inspectPosition', span: 8, formType: 'input', maxlength: 128, isRule: true },
            // 巡查结果
            { label: 'inspectReport.inspectResult', prop: 'inspectResult', span: 8, formType: 'input', maxlength: 256, isRule: true },
            // 进度状况分析
            {
                label: 'inspectReport.progressAnalysis', prop: 'progressAnalysis', span: 24, formType: 'textarea', maxlength: 255,
                minRows: 2, isRule: true
            },
            // 备注
            { label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 255, minRows: 2 },
            // 附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' }
        ],
        oldRelationList: []
    },
    subTableMatch: [
        { value: 'details', assignment: 'progressInspectReportDetail' }
    ],
    // 子表
    subTableConfig: {
        // 明细清单
        progressInspectReportDetail: {
            subTableName: 'progressInspectReportDetail',
            titleTips: 'purchasePurchaseApplyDetailTips',
            isSelection: true,
            // 子表按钮
            subTableButton: [
                { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'progressInspectReportDetail', disabled: false },
                { noAuth: true, code: 'sysHandleDeletaAdd', subTableCode: 'progressInspectReportDetail', disabled: false },
                { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'progressInspectReportDetail', disabled: false }
            ],
            tableList: {
                // 表头配置
                slaveColumns: [
                    // 任务名称
                    { label: 'dialog.taskName', prop: 'taskName', formType: 'slot', maxlength: 255 },
                    // 计划完成日期
                    { label: 'inspectReport.planFinishedDate', prop: 'planFinishedDate', formType: 'slot', maxlength: 255, minWidth: 120 },
                    // 实际完成日期
                    { label: 'inspectReport.realFinishedDate', prop: 'realFinishedDate', formType: 'slot', maxlength: 255, minWidth: 120 },
                    // 计划完成进度
                    {
                        label: 'inspectReport.planFinishedProgress', prop: 'planFinishedProgress', formType: 'slot', maxlength: 64,
                        minWidth: 100, min: 0, max: 100
                    },
                    // 实际完成进度
                    {
                        label: 'inspectReport.realFinishedProgress', prop: 'realFinishedProgress', formType: 'number', maxlength: 255,
                        minWidth: 120, min: 0, max: 100, precision: 2
                    },
                    // 计划资源投入
                    { label: 'inspectReport.planInvestResourse', prop: 'planInvestResourse', formType: 'input', maxlength: 255, minWidth: 120 },
                    // 实际资源投入
                    { label: 'inspectReport.realInvestResourse', prop: 'realInvestResourse', formType: 'input', maxlength: 255, minWidth: 120 },
                    // 滞后天数
                    {
                        label: 'inspectReport.lagDays', prop: 'lagDays', formType: 'slot', maxlength: 10, minWidth: 100,
                        operateData: true
                    },
                    // 预警信号
                    { label: 'inspectReport.warnColourValue', prop: 'warnColourValue', formType: 'slot', minWidth: 80, align: 'center' },
                    // 备注
                    { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255 }
                ],
                // 校验
                rules: {
                    taskName: [{ required: true, message: '', trigger: 'blur' }],
                    realFinishedDate: [{ required: true, message: '', trigger: 'blur' }],
                    realFinishedProgress: [{ required: true, message: '', trigger: 'blur' }],
                    lagDays: [{ required: true, message: '', trigger: 'blur' }]
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
