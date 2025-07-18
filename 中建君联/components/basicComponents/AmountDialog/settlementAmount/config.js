/*
 * @Author: your name
 * @Date: 2020-08-18 14:34:17
 * @LastEditTime: 2020-08-20 09:27:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmachinery\src\views\promachinery\compoent\approachMultiple\config.js
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
    isFooterShow: false,
    // 主表渲染参数
    mainTable: {
        //  多选
        isCheckbox: false,
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
            showColumnCtrl: false, // 显示/隐藏列
            refresh: false // 刷新
        },
        // 是否默认选中第一行
        defaultSeleFirstLine: false,
        // 子系统表头渲染参数
        tableList: [
            // 单据编号
            {show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', fn: 'handleInfo', align: 'center'},
            // 主要结算内容
            {show: true, prop: 'settlementContent', label: 'dialog.settlementContent'},
            // 结算金额
            {show: true, filterName: 'setMoney', prop: 'totalPriceTax', label: 'dialog.settlementAmount'},
            // 结算日期
            {show: true, filterName: 'date', prop: 'settlementDate', label: 'dialog.settlementDate', minWidth: '120', align: 'center'}
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
