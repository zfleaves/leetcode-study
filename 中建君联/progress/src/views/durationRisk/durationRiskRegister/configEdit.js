/*
 * @Author: your name
 * @Date: 2021-04-14 09:41:03
 * @LastEditTime: 2021-04-14 11:48:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\durationRisk\durationRiskRegister\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        // 获取下一个节点的处理人信息
        nextInfo: {
            url: 'durationRiskRegister/getWorkflowNextNode',
            parmasList: [
                { receive: 'sid', value: 'taskSid' },
                { receive: 'projectId', value: 'projectId' }
            ]
        },
        // 流程审批
        approveSubmit: {
            url: 'durationRiskRegister/setWorkflowApprove'
        },
        // 删除
        deleteParams: {
            url: 'durationRiskRegister/setDelete',
            params: 'riskRegisterId'
        },
        // // 删除明细
        // deleteDetailsParams: {
        //     url: 'durationRiskRegister/setDeleteDetails'
        // },
        // info
        infoUrl: {
            url: 'durationRiskRegister/getInfo',
            params: 'riskRegisterId'
        },
        // save
        saveUrl: {
            url: 'durationRiskRegister/setEdit'
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
                relationTable: ['progressDurationriskRegisterDeta'], isRule: true
            },
            // 主要风险项
            {
                label: 'durationRiskRegister.mainRiskItem', prop: 'mainRiskItem', span: 24, formType: 'input',
                placeholder: 'durationRiskRegister.mainRiskItemPlaceholder', inputStatus: 'disable'
            },
            // 备注
            { label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 255, minRows: 2 },
            // 附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' }
        ],
        oldRelationList: []
    },
    subTableMatch: [
        { value: 'details', assignment: 'progressDurationriskRegisterDeta' }
    ],
    // 子表
    subTableConfig: {
        // 明细清单
        progressDurationriskRegisterDeta: {
            subTableName: 'progressDurationriskRegisterDeta',
            titleTips: 'purchasePurchaseApplyDetailTips',
            isSelection: true,
            // 子表按钮
            subTableButton: [
                { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'progressDurationriskRegisterDeta', disabled: false },
                { noAuth: true, code: 'sysHandleDeletaAdd', subTableCode: 'progressDurationriskRegisterDeta', disabled: false },
                { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'progressDurationriskRegisterDeta', disabled: false }
            ],
            tableList: {
                // 表头配置
                slaveColumns: [
                    // 风险内容
                    { label: 'durationRiskRegister.riskContent', prop: 'riskContent', formType: 'slot', maxlength: 255 },
                    // 计划时间
                    { label: 'durationRiskRegister.planTimeContent', prop: 'planTimeContent', formType: 'slot', maxlength: 255 },
                    // 当前延误时间
                    { label: 'durationRiskRegister.delayTimeContent', prop: 'delayTimeContent', formType: 'input', maxlength: 64 },
                    // 处理策略
                    { label: 'durationRiskRegister.handerStrategy', prop: 'handerStrategy', formType: 'input', maxlength: 255 },
                    // 备注
                    { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255 }
                ],
                // 校验
                rules: {
                    riskContent: [{ required: true, message: '', trigger: 'blur' }],
                    handerStrategy: [{ required: true, message: '', trigger: 'blur' }],
                    delayTimeContent: [{ required: true, message: '', trigger: 'blur' }]
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
