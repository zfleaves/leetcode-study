/*
 * @Author: your name
 * @Date: 2021-05-25 09:30:34
 * @LastEditTime: 2021-05-25 17:10:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\views\promaterial\compoent\returnMultiple\config.js
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
        rowKey: 'returngoodsDocNo',
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
            // 单据编号
            { show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', align: 'center' },
            // 主要退货材料
            { show: true, prop: 'mainReturngoodsMaterials', label: 'purchaseSettlement.mainReturngoodsMaterials' },
            // 供应商名称
            { show: true, prop: 'supplierName', label: 'purchaseSettlement.supplierName' },
            // 计税合价
            { show: true, prop: 'totalPriceTax', label: 'purchaseSettlement.totalPriceTax', minWidth: '140', formType: 'setMoney', filterName: 'setMoney' },
            // 退货办理人
            { show: true, prop: 'returngoodsAgentUserName', label: 'purchaseSettlement.returngoodsAgentUserName', minWidth: '100' },
            // 退货日期
            { show: true, filterName: 'date', prop: 'returngoodsDate', label: 'purchaseSettlement.returngoodsDate', minWidth: '100' }
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
