/*
 * @Author: your name
 * @Date: 2021-01-26 10:02:17
 * @LastEditTime: 2021-02-04 09:42:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\inspect\inspectRegister\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        // 获取下一个节点的处理人信息
        nextInfo: {
            url: 'inspectRegister/getWorkflowNextNode',
            parmasList: [
                { receive: 'sid', value: 'taskSid' },
                { receive: 'projectId', value: 'projectId' }
            ]
        },
        // 流程审批
        approveSubmit: {
            url: 'inspectRegister/setWorkflowApprove'
        },
        // 删除
        deleteParams: {
            url: 'inspectRegister/setDelete',
            params: 'inspectRegisterId'
        },
        // info
        infoUrl: {
            url: 'inspectRegister/getInfo',
            params: 'inspectRegisterId'
        },
        // save
        saveUrl: {
            url: 'inspectRegister/setEdit'
        }
    },
    // 数据字典
    dictionary: [
        { dicCode: 'outboundType', propCode: 'outboundTypeCode' },
        { dicCode: 'taxRate', propCode: 'taxRate' }
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
            // 日期
            {
                label: 'inspectRegister.inspectDate', prop: 'inspectDate', span: 8, formType: 'date', isRule: true
            },
            // 项目名称
            {
                label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'project', key: 'projectId',
                isRelation: true,
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
            // 巡检类型
            {
                label: 'inspectRegister.inspectTypeId', prop: 'inspectTypeId', span: 8, formType: 'select',
                selectList: [], isRule: true, nameCode: 'inspectTypeName', valueCode: 'id'
            },
            // 巡检内容
            {
                label: 'inspectRegister.inspectContent', prop: 'inspectContent', span: 24, formType: 'textarea', maxlength: 256,
                printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, minRows: 2, isRule: true
            },
            // 巡检内容事项状态
            {
                label: 'inspectRegister.inspectContentFlg', prop: 'inspectContentFlg', span: 24, formType: 'radio', isTranslate: true,
                selectList: [{ value: '01', label: 'inspectRegister.notice' }, { value: '02', label: 'inspectRegister.update' }]
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
