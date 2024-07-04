/*
 * @Author: your name
 * @Date: 2020-07-31 09:19:27
 * @LastEditTime: 2022-07-14 14:37:42
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\compoent\expendRegister\config.js
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
        searchSlotShow: false,
        // 表单配置
        formList: [],
        // 是否显示重置按钮
        isReset: false
    },
    // 表格操作按钮
    mainOperateBtn: [],
    // 主表渲染参数
    mainTable: {
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
            // 单据编号、填写人、填写日期、暂估单价
            {show: true, prop: 'docNo', label: 'fConfig.docNo'},
            // 填写人
            { show: true, prop: 'createByName', label: 'fConfig.createByName'},
            // 填写日期
            { show: true, filterName: 'date', prop: 'createTime', label: 'fConfig.createTime'},
            // 暂估单价
            {show: true, prop: 'unitPrice', label: 'dialog.estimatedUnitPrice'}
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
