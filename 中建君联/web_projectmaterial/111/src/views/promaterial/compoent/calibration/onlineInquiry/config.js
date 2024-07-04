/*
 * @Author: wumaoxia 1805428335@qq.com
 * @Date: 2022-07-18 10:28:33
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @LastEditTime: 2022-09-01 14:27:04
 * @FilePath: \web_contract\src\views\contractExpend\components\calibration\onlineInquiry\config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {},
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
            // 单据编号
            {show: true, label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 32},
            // 询价批次号
            {show: true, label: 'dialog.inquireBatchNo', prop: 'inquireBatchNo', span: 8, formType: 'input', maxlength: 32, clearable: true, inputStatus: 'edit'},
            // 询价单标题
            {show: true, label: 'fConfig.inquireTitle', prop: 'inquireTitle', span: 8, formType: 'input', maxlength: 64, clearable: true, inputStatus: 'edit'},
            // 询价内容概述
            {show: true, label: 'dialog.inquireContent', prop: 'inquireContent', span: 8, formType: 'input', maxlength: 64, clearable: true, inputStatus: 'edit'},
            // 定标单位名称
            {show: true, label: 'fConfig.bidSupplierName', prop: 'bidSupplierName', span: 8, formType: 'input', maxlength: 64, clearable: true, inputStatus: 'edit'}
        ],
        // 是否显示重置按钮
        isReset: true
    },
    // 表格操作按钮
    mainOperateBtn: [],
    isFooterShow: true,
    // 主表渲染参数
    mainTable: {
        //  单选
        isRadio: true,
        // 表格数据
        tableData: [],
        height: 500,
        // 表格高度
        maxHeight: 500,
        pageSize: 10,
        // 页码
        total: 0,
        // 是否显示分页
        paging: true,
        // 表头操作行配置
        tableHeader: {
        showColumnCtrl: false, // 显示/隐藏列
        refresh: false // 刷新
        },
        // 是否默认选中第一行
        defaultSeleFirstLine: false,
        // 子系统表头渲染参数
        tableList: [
            // 单据编号
            {show: true, prop: 'docNo', label: 'fConfig.docNo', fn: 'handleInfo', minWidth: '160'},
            // 询价单标题
            {show: true, prop: 'inquireTitle', label: 'fConfig.inquireTitle'},
            // 询价批次编号
            {show: true, prop: 'inquireBatchNo', label: 'dialog.inquireBatchNo'},
            // 询价内容概述
            {show: true, prop: 'inquireContent', label: 'dialog.inquireContent'},
            // 选商模式
            {show: true, prop: 'selectBusinessModeValue', label: 'fConfig.selectBusinessModeCode', minWidth: '100'},
            // 寻源询价负责人
            {show: true, prop: 'inquireDutyUserName', label: 'fConfig.inquireDutyUserName', minWidth: '140'},
            // 定标单位名称
            {show: true, prop: 'bidSupplierName', label: 'fConfig.bidSupplierName', minWidth: '160'},
            // 定标金额
            {show: true, prop: 'bidAmount', label: 'fConfig.bidAmount', minWidth: '100', filterName: 'setMoney'}
        ]
    }
};
class Page {
    constructor() {
        this.PageConfig = JSON.parse(JSON.stringify(PageConfig));
        this.init();
    }
    init () {
        Utils.commonUtil.getSelectList(this.PageConfig.selectList, this);
        Utils.commonUtil.getDicAllDataList(this.PageConfig.dictionary, this);
    }
}
export default Page;
