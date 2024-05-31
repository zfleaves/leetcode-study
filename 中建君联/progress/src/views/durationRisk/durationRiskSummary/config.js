/*
 * @Author: your name
 * @Date: 2021-04-14 09:41:19
 * @LastEditTime: 2021-04-16 09:53:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\durationRisk\durationRiskSummary\config.js
 */
import Utils from 'util';

const PageConfig = {
    formCode: 'leasePurchaseApply',
    // 流程
    processParmas: {
        exportUrl: {
            url: 'durationRiskSummary/exporttPage'
        }
    },
    // 数据字典
    dictionary: [
        // { dicCode: 'entryTypeValue', propCode: 'entryTypeCode' }
    ],
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
            // 所属公司
            { show: true, label: 'dialog.orgName', prop: 'orgName', span: 8, formType: 'input', maxlength: 64 },
            // 项目名称
            { show: true, label: 'dialog.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64 },
            // 风险内容
            { show: true, label: 'durationRiskSummary.riskContent', prop: 'riskContent', span: 8, formType: 'input', maxlength: 128 },
            // 填写日期
            {
                label: 'fConfig.createTime', span: 8, formType: 'daterange-split',
                propStart: 'applyDateFrom', propEnd: 'applyDateTo',
                inputStatus: 'edit'
            }
        ],
        // 是否显示重置按钮
        isReset: true
    },
    // 表格操作按钮
    mainOperateBtn: [
        { isCustom: false, code: 'sysHandleExport', authCode: 'export' }
    ],
    // 主表渲染参数
    mainTable: {
        //  单选
        isRadio: false,
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
            // 所属公司
            { show: true, prop: 'orgName', label: 'dialog.orgName' },
            // 项目名称
            { show: true, prop: 'projectName', label: 'dialog.projectName'},
            // 风险内容
            { show: true, prop: 'riskContent', label: 'durationRiskSummary.riskContent' },
            // 计划时间
            { show: true, prop: 'planTimeContent', label: 'durationRiskSummary.planTimeContent' },
            // // 主要风险项
            // { show: true, prop: 'mainRiskItem', label: 'durationRiskRegister.mainRiskItem' },
            // 当前延误时间
            { show: true, prop: 'delayTimeContent', label: 'durationRiskSummary.delayTimeContent' },
            // 处理策略
            { show: true, prop: 'handerStrategy', label: 'durationRiskSummary.handerStrategy' },
            // 填写日期
            { show: true, filterName: 'date', prop: 'applyDate', label: 'fConfig.createTime', minWidth: '100' }
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
