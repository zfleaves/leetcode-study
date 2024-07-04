/*
 * @Author: wumaoxia 1805428335@qq.com
 * @Date: 2022-12-08 17:44:04
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @LastEditTime: 2022-12-08 17:56:03
 * @FilePath: \web_projectmaterial\src\views\promaterial\compoent\calibration\offlineInquiry\config.js
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
            // 询价描述
            {show: true, label: 'fConfig.inquiryDescription', prop: 'inquiryDescription', span: 8, formType: 'input', maxlength: 128},
            // 定标日期
            {label: 'dialog.dateOfAward', span: 8, formType: 'daterange-split',
                    propStart: 'calibraTimeFrom', propEnd: 'calibraTimeTo',
                    inputStatus: 'edit'},
            // 采购经办人
            {show: true, label: 'fConfig.purchaseOperatorName', prop: 'purchaseOperatorName', span: 8, formType: 'input', maxlength: 32},
            // 填写人
            {show: true, label: 'fConfig.createByName', prop: 'createByName', span: 8, formType: 'input', maxlength: 32}
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
            { show: true, prop: 'docNo', label: 'fConfig.docNo', fn: 'handleInfo', minWidth: '160', align: 'center'},
            // 询价描述
            {show: true, prop: 'inquiryDescription', label: 'fConfig.inquiryDescription'},
            // 采购经办人
            {show: true, prop: 'purchaseOperatorName', label: 'fConfig.purchaseOperatorName', minWidth: '120'},
            // 定标日期
            {show: true, filterName: 'date', prop: 'calibraTime', label: 'dialog.dateOfAward', minWidth: '100'},
            // 定标单位名称
            {show: true, prop: 'bidWinnerUnitName', label: 'fConfig.bidSupplierName', minWidth: '160'},
            // 定标金额
            {show: true, prop: 'bidWinnerAmount', label: 'fConfig.bidAmount', minWidth: '100', filterName: 'setMoney'},
            // 填写人
            {show: true, prop: 'createByName', label: 'fConfig.createByName', minWidth: '100'},
            // 填写日期
            {show: true, filterName: 'date', prop: 'createTime', label: 'fConfig.createTime', minWidth: '120'}
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
