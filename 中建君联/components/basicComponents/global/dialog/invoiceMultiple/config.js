/*
 * @Author: your name
 * @Date: 2020-08-14 15:33:31
 * @LastEditTime: 2022-06-22 14:06:13
 * @LastEditors: zengqin 1058574586@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectlabour-项目劳务\src\components\projectlabourDetail\invoiceMultiple\config.js
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
        formShow: false,
        // 搜索使用插槽
        searchSlotShow: false
    },
    // 表格操作按钮
    mainOperateBtn: [],
    isFooterShow: true,
    // 主表渲染参数
    mainTable: {
        rowKey: 'invoiceId',
        //  多选
        isCheckbox: true,
        // 表格数据
        tableData: [],
        // 表格高度
        maxHeight: 500,
        pageSize: 10,
        // 页码
        total: 0,
        // 是否显示分页
        paging: false,
        // 表头操作行配置
        tableHeader: {
            showColumnCtrl: false, // 显示/隐藏列
            refresh: false // 刷新
        },
        // 是否默认选中第一行
        defaultSeleFirstLine: false,
        // 子系统表头渲染参数
        tableList: [
            // 发票主要内容
            {show: true, prop: 'invoiceContent', label: 'dialog.invoiceContent'},
            // 开票单位
            {show: true, prop: 'invoiceUnitName', label: 'dialog.invoiceUnitName'},
            // 发票代码
            {show: true, prop: 'invoiceNo', label: 'dialog.invoiceNo'},
            // 开票日期
            {show: true, prop: 'invoiceDate', label: 'dialog.invoiceDate', filterName: 'date', align: 'center'},
            // 价税合计
            {show: true, prop: 'totalPriceTax', label: 'dialog.totalPriceTax', formType: 'setMoney', filterName: 'setMoney'}
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
