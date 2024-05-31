import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        // 获取下一个节点的处理人信息
        nextInfo: {
            url: 'imageProgressWork/getWorkflowNextNode',
            parmasList: [
                { receive: 'sid', value: 'taskSid' },
                { receive: 'projectId', value: 'projectId' }
            ]
        },
        // 流程审批
        approveSubmit: {
            url: 'imageProgressWork/setWorkflowApprove'
        },
        // 删除
        deleteParams: {
            url: 'imageProgressWork/setDelete',
            params: 'imageProgressWorkId'
        },
        // info
        infoUrl: {
            url: 'imageProgressWork/getInfo',
            params: 'imageProgressWorkId'
        },
        // save
        saveUrl: {
            url: 'imageProgressWork/setEdit'
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
                label: 'fConfig.createTime', prop: 'createTime', span: 8, formType: 'date', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目名称
            {
                label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'project', key: 'projectId',
                isRelation: true,
                relationList: [
                    { receive: 'projectCode', value: 'projectCode' },
                    { receive: 'progressTaskCid', value: 'progressTaskCid' },
                    { receive: 'progressTaskId', value: 'progressTaskId' },
                    { receive: 'progressTaskName', value: 'progressTaskName' }
                ],
                isRule: true,
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // // 项目编号
            {
                label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 任务名称
            {
                label: 'imageProgressWork.progressTaskName', prop: 'progressTaskName', span: 8, formType: 'slot',
                key: 'progressTaskId', isRule: true
            },
            // 形象进度完成描述
            {
                label: 'imageProgressWork.imageProgressDescription', prop: 'imageProgressDescription', span: 24, formType: 'textarea', maxlength: 256,
                printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, minRows: 2, isRule: true
            },
            {
                label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256,
                printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, minRows: 2
            },
            // 附件
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
