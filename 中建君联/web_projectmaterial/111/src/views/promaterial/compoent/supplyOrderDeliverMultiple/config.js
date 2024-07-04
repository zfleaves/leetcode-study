/*
 * @Author: your name
 * @Date: 2021-10-26 18:15:24
 * @LastEditTime: 2021-10-26 18:24:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\views\promaterial\compoent\supplyOrderDeliverMultiple\config.js
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
        rowKey: 'supplyOrderDeliverDocNo',
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
            // 电子发货单
            { show: true, prop: 'deliverCode', label: 'checkArrival.deliverCode', minWidth: '200' },
            // 发货单位
            { show: true, prop: 'deliver', label: 'checkArrival.deliver' },
            // 发货人
            { show: true, prop: 'consignor', label: 'checkArrival.consignor' },
            // 发货日期
            { show: true, filterName: 'date', prop: 'deliverTime', label: 'checkArrival.deliverTime', minWidth: '120' },
            // 送货人
            { show: true, prop: 'deliverName', label: 'checkArrival.deliverName' },
            // 送货人联系方式
            { show: true, prop: 'deliverMobile', label: 'checkArrival.deliverMobile' },
            // 送货车牌号码
            { show: true, prop: 'carId', label: 'checkArrival.carId' }
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
