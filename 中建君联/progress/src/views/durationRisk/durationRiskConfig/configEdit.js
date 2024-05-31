/*
 * @Author: your name
 * @Date: 2021-04-14 09:40:29
 * @LastEditTime: 2021-04-25 15:06:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\durationRisk\durationRiskConfig\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        // 获取下一个节点的处理人信息
        nextInfo: {
            url: 'durationRiskConfig/getWorkflowNextNode',
            parmasList: [
                { receive: 'sid', value: 'taskSid' },
                { receive: 'projectId', value: 'projectId' }
            ]
        },
        // 流程审批
        approveSubmit: {
            url: 'durationRiskConfig/setWorkflowApprove'
        },
        // 删除
        deleteParams: {
            url: 'durationRiskConfig/setDelete',
            params: 'riskConfigId'
        },
        // info
        infoUrl: {
            url: 'durationRiskConfig/getInfo',
            params: 'riskConfigId'
        },
        // save
        saveUrl: {
            url: 'durationRiskConfig/setEdit'
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
            // {
            //     label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
            //     printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            // },
            // 创建人
            {
                label: 'fConfig.createBy', prop: 'createByName', span: 8, formType: 'input', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 创建日期
            {
                label: 'fConfig.createDate', prop: 'createTime', span: 8, formType: 'date', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // // 风险内容
            {
                label: 'durationRiskConfig.riskContent', prop: 'riskContent', span: 24, formType: 'textarea', isRule: 'true', maxlength: 256, minRows: 2
            },
            // // 计划时间
            {
                label: 'durationRiskConfig.planTimeContent', prop: 'planTimeContent', span: 24, formType: 'textarea', isRule: 'true', maxlength: 256, minRows: 2
            },
            // 正产延误(绿色)
            { label: 'durationRiskConfig.deliveryDelay', prop: 'deliveryDelay', span: 8, formType: 'input', isRule: 'true', maxlength: 64 },
            // 可控延误(蓝色)
            { label: 'durationRiskConfig.controllableDelay', prop: 'controllableDelay', span: 8, formType: 'input', isRule: 'true', maxlength: 64 },
            // 一般延误(黄色)
            { label: 'durationRiskConfig.generalDelay', prop: 'generalDelay', span: 8, formType: 'input', isRule: 'true', maxlength: 64 },
            // 严重延误(红色)
            { label: 'durationRiskConfig.seriousDelay', prop: 'seriousDelay', span: 8, formType: 'input', isRule: 'true', maxlength: 64 },
            // 排序
            { label: 'fConfig.sorts', prop: 'sorts', span: 8, formType: 'elNumber', precision: 0, min: 0, maxlength: 12 },
            // 备注
            { label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256, minRows: 2 }
            // // 附件
            // { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' }
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
