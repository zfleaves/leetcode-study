/*
 * @Author: your name
 * @Date: 2021-01-29 17:27:12
 * @LastEditTime: 2021-02-04 09:09:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demMonth\demMonthPlan\config.js
 */
import Utils from 'util';

const PageConfig = {
    formCode: 'progressMonthPlan',
    // 流程
    processParmas: {
        // 初始化信息
        startInfo: {
            url: 'demMonthPlan/getStartNode',
            parmasList: [
                { receive: 'sid', value: 'id' },
                { receive: 'projectId', value: 'projectId' }
            ]
        },
        // 提交
        startSubmit: {
            url: 'demMonthPlan/startSubmit'
        }
    },
    // 数据字典
    dictionary: [],
    // 接口数据
    selectList: [],
    // 搜索
    searchControls: {
        // 是否显示
        formShow: true,
        // 搜索使用插槽
        searchSlotShow: false,
        // 表单配置
        formList: [
            // 项目名称
            { show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64 },
            // 单据编号
            { show: true, label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', maxlength: 32 },
            // 审批状态
            { show: true, label: 'fConfig.flowStatus', prop: 'flowStatus', span: 8, formType: 'flowStatus' },
            // 填报月份
            { show: true, label: 'demMonthPlan.applyMonth', prop: 'applyMonth', span: 8, formType: 'month' },
            // 填写人
            { show: true, label: 'fConfig.createByName', prop: 'createByName', span: 8, formType: 'input', maxlength: 32 },
            // 填写日期
            {
                label: 'fConfig.createTime', span: 8, formType: 'daterange-split',
                propStart: 'createTimeFrom', propEnd: 'createTimeTo',
                inputStatus: 'edit'
            }
        ],
        // 是否显示重置按钮
        isReset: true
    },
    // 表格操作按钮
    mainOperateBtn: [
        // 发标
        { isCustom: false, code: 'sysHandleAdd', authCode: 'create' },
        { isCustom: false, code: 'sysHandleStartProcess', authCode: 'startProcess' },
        { isCustom: false, code: 'sysHandleMonitorProcess', authCode: 'monitorProcess' }
    ],
    // 主表渲染参数
    mainTable: {
        //  单选
        isRadio: true,
        // 表格数据
        tableData: [],
        // 表格高度
        maxHeight: 500,
        pageSize: 10,
        // 页码
        total: 0,
        // 是否显示分页
        paging: true,
        // 表头操作行配置
        tableHeader: {
            showColumnCtrl: true, // 显示/隐藏列
            refresh: false // 刷新
        },
        // 是否默认选中第一行
        defaultSeleFirstLine: false,
        // 子系统表头渲染参数
        tableList: [
            // 审批状态
            { show: true, prop: 'flowStatus', label: 'fConfig.flowStatus', formType: 'flowStatus', minWidth: '100', align: 'center' },
            // 单据编号
            { show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '140', fn: 'handleInfo', align: 'center' },
            // 项目名称
            { show: true, prop: 'projectName', label: 'fConfig.projectName' },
            // 项目编号
            // { show: true, prop: 'projectCode', label: 'fConfig.projectCode', minWidth: '120' },
            // 所属月份
            { show: true, prop: 'applyMonth', label: 'demMonthPlan.applyMonth', formType: 'slot', minWidth: '140' },
            // 主要工作内容及内容描述
            { show: true, prop: 'taskOverview', label: 'demMonthPlan.taskOverview', formType: 'input' },
            // 填写人
            { show: true, prop: 'createByName', label: 'fConfig.createByName', minWidth: '100' },
            // 填写日期
            { show: true, filterName: 'date', prop: 'createTime', label: 'fConfig.createTime', minWidth: '120' },
            // 操作
            {
                show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '100',
                buts: [
                    { name: 'button.edit', class: 'warning', fn: 'handleEdit', authCode: 'update', isCreateBy: true },
                    { name: 'button.delete', class: 'danger', fn: 'handleDelete', authCode: 'delete', isCreateBy: true }
                ]
            }
        ]
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
