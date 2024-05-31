/*
 * @Author: your name
 * @Date: 2021-01-28 09:04:10
 * @LastEditTime: 2021-03-01 11:35:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMaster\demMasterPlanAdjust\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        // 获取下一个节点的处理人信息
        nextInfo: {
            url: 'demMasterPlanAdjust/getWorkflowNextNode',
            parmasList: [
                { receive: 'sid', value: 'taskSid' },
                { receive: 'projectId', value: 'projectId' }
            ]
        },
        // 流程审批
        approveSubmit: {
            url: 'demMasterPlanAdjust/setWorkflowApprove'
        },
        // 删除
        deleteParams: {
            url: 'demMasterPlanAdjust/setDelete',
            params: 'masterPlanAdjustId'
        },
        // info
        infoUrl: {
            url: 'demMasterPlanAdjust/getInfo',
            params: 'masterPlanAdjustId'
        },
        // save
        saveUrl: {
            url: 'demMasterPlanAdjust/setEdit'
        }
    },
    // 数据字典
    dictionary: [
    ],
    // 接口数据
    selectList: [
        // { code: 'inspectTypeId', fun: 'inspectType/getList' }
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
                label: 'fConfig.createTime', prop: 'createTime', span: 8, formType: 'date', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目名称
            {
                label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'project', key: 'projectId',
                isRelation: true, check: true,
                relationList: [
                    { receive: 'projectCode', value: 'projectCode' }
                ],
                isRule: true,
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // // 项目编号
            // {
            //     label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
            //     printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            // },
            // 计划开始日期
            { label: 'demMasterPlanAdjust.planStartDate', prop: 'planStartDate', span: 8, formType: 'date', isRule: true },
            // 计划完成日期
            { label: 'demMasterPlanAdjust.planFinishedDate', prop: 'planFinishedDate', span: 8, formType: 'date', isRule: true },
            // 调整前版本号
            { label: 'demMasterPlanAdjust.beforeVersionNumber', prop: 'beforeVersionNumber', span: 8, formType: 'input', inputStatus: 'disable' },
            // 调整前计划开始日期
            { label: 'demMasterPlanAdjust.beforePlanStartDate', prop: 'beforePlanStartDate', span: 8, formType: 'date', inputStatus: 'disable' },
            // 调整前计划完成日期
            { label: 'demMasterPlanAdjust.beforePlanFinishedDate', prop: 'beforePlanFinishedDate', span: 8, formType: 'date', inputStatus: 'disable'},
            // 调整原因
            {
                label: 'demMasterPlanAdjust.adjustReason', prop: 'adjustReason', span: 24, formType: 'textarea', maxlength: 256, minRows: 2, isRule: true
            },
            // 进度甘特图
            { label: 'demMasterPlanAdjust.demMasterPlanGants', prop: 'demMasterPlanGants', span: 24, formType: 'slot' },
            // 调整原因
            {
                label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256, minRows: 2
            },
            // 其它说明附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' }
        ],
        oldRelationList: []
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
