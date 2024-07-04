/*
 * @Author: wumaoxia 1805428335@qq.com
 * @Date: 2022-07-29 15:53:03
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @LastEditTime: 2022-08-04 13:47:45
 * @FilePath: \web_projectmaterial\src\views\promaterial\compoent\invoiceMultiple\config.js
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
            showColumnCtrl: true, // 显示/隐藏列
            refresh: false // 刷新
        },
        // 是否默认选中第一行
        defaultSeleFirstLine: false,
        // 子系统表头渲染参数
        tableList: [
            // 发票主要内容
            {show: true, prop: 'invoiceContent', label: 'purchaseSettlement.invoiceContent'},
            // 开票单位
            {show: true, prop: 'invoiceUnitName', label: 'purchaseSettlement.invoiceUnitName'},
            // 发票代码
            {show: true, prop: 'invoiceNo', label: 'dialog.invoiceNo'},
            // 开票日期
            {show: true, prop: 'invoiceDate', label: 'purchaseSettlement.invoiceDate', filterName: 'date'},
            // 价税合计
            {show: true, prop: 'totalPriceTax', label: 'purchaseSettlement.totalPriceTax', formType: 'setMoney', filterName: 'setMoney'}
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
