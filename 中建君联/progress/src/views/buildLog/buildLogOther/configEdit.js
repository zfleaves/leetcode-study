/*
 * @Author: your name
 * @Date: 2021-01-26 09:58:11
 * @LastEditTime: 2021-02-01 09:13:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\buildLog\buildLogOther\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        // 获取下一个节点的处理人信息
        nextInfo: {
            url: 'buildLogOther/getWorkflowNextNode',
            parmasList: [
                { receive: 'sid', value: 'taskSid' },
                { receive: 'projectId', value: 'projectId' }
            ]
        },
        // 流程审批
        approveSubmit: {
            url: 'buildLogOther/setWorkflowApprove'
        },
        // 删除
        deleteParams: {
            url: 'buildLogOther/setDelete',
            params: 'buildLogApplyId'
        },
        // info
        infoUrl: {
            url: 'buildLogOther/getInfo',
            params: 'buildLogApplyId'
        },
        // save
        saveUrl: {
            url: 'buildLogOther/setEdit'
        }
    },
    // 数据字典
    dictionary: [
        // { dicCode: 'outboundType', propCode: 'outboundTypeCode' },
        // { dicCode: 'taxRate', propCode: 'taxRate' }
    ],
    // 接口数据
    selectList: [
        { code: 'logTypeCode', fun: 'buildLogType/getList'}
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
                label: 'buildLogOther.applyDate', prop: 'applyDate', span: 8, formType: 'date', isRule: true
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
            // 日志类型
            {
                label: 'buildLogOther.logTypeName', prop: 'logTypeCode', span: 8, formType: 'slot', isRule: 'true',
                relationList: [
                    { receive: 'logTypeName', value: 'dataName' }
                ],
                selectList: []
            },
            // 施工/生产情况(明日完成)
            {
                label: 'buildLogOther.finishedSituation', prop: 'finishedSituation', span: 24, formType: 'textarea',
                maxlength: 255, isRule: true, minRows: 2
            },
            // 明日计划
            {
                label: 'buildLogOther.tomorrowPlanSituation', prop: 'tomorrowPlanSituation', span: 24, formType: 'textarea', maxlength: 256,
                printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, minRows: 2
            },
            // 附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' },
            // 天气
            { label: 'buildLogOther.weather', prop: 'weather', span: 24, formType: 'divisionTitle' },
            // 上午
            { label: 'buildLogOther.morning', prop: 'title', span: 24, formType: 'title' },
            // 天气
            { label: 'buildLogOther.morningWeather', prop: 'morningWeather', span: 12, formType: 'input', maxlength: 32},
            // 风向
            { label: 'buildLogOther.morningWindDirection', prop: 'morningWindDirection', span: 12, formType: 'input', maxlength: 32 },
            // 温度
            { label: 'buildLogOther.morningTemperature', prop: 'morningTemperature', span: 12, formType: 'slot', maxlength: 32 },
            // 风力
            { label: 'buildLogOther.morningWindPower', prop: 'morningWindPower', span: 12, formType: 'input', maxlength: 32 },
            // 下午
            { label: 'buildLogOther.afternoon', prop: 'title', span: 24, formType: 'title' },
            // 天气
            { label: 'buildLogOther.afternoonWeather', prop: 'afternoonWeather', span: 12, formType: 'input', maxlength: 32 },
            // 风向
            { label: 'buildLogOther.afternoonWindDirection', prop: 'afternoonWindDirection', span: 12, formType: 'input', maxlength: 32 },
            // 温度
            { label: 'buildLogOther.afternoonTemperature', prop: 'afternoonTemperature', span: 12, formType: 'slot', maxlength: 32 },
            // 风力
            { label: 'buildLogOther.afternoonWindPower', prop: 'afternoonWindPower', span: 12, formType: 'input', maxlength: 32 }
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
