/*
 * @Author: your name
 * @Date: 2020-07-31 09:19:27
 * @LastEditTime: 2021-08-02 10:14:31
 * @LastEditors: Please set LastEditors
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
        formShow: true,
        // 搜索使用插槽
        searchSlotShow: false,
        // 表单配置
        formList: [
            // 合同名称
            {show: true, label: 'dialog.contractName', prop: 'contractName', span: 8, formType: 'input',
                clearable: true, inputStatus: 'edit', maxlength: 64},
            // 合同编号
            {show: true, label: 'dialog.contractCode', prop: 'contractCode', span: 8, formType: 'input',
                clearable: true, inputStatus: 'edit', maxlength: 32},
            // 乙方单位
            {show: true, label: 'dialog.partyB', prop: 'partyBUnitName', span: 8, formType: 'input',
                clearable: true, inputStatus: 'edit', maxlength: 64},
            // 签订人
            {show: true, label: 'dialog.partyASignName', prop: 'signUserName', span: 8, formType: 'input',
            clearable: true, inputStatus: 'edit', maxlength: 32},
            // 签订日期
            {label: 'dialog.signTime', span: 8, formType: 'daterange-split', clearable: true,
                propStart: 'signTimeFrom', propEnd: 'signTimeTo',
                inputStatus: 'edit'},
            // 填写人
            {show: true, label: 'fConfig.createByName', prop: 'createByName', span: 8, formType: 'input',
            clearable: true, inputStatus: 'edit', maxlength: 32}
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
            // 合同编号
            {show: true, prop: 'contractCode', label: 'dialog.contractCode', minWidth: '140'},
            // 合同名称
            {show: true, prop: 'contractName', label: 'dialog.contractName'},
            // 合同类型
            {show: true, prop: 'contractClassifyName', label: 'dialog.contractClassifyName', minWidth: '140'},
            // 乙方单位
            {show: true, prop: 'partyBUnitName', label: 'dialog.partyB'},
            // 签订金额
            {show: true, prop: 'signAmount', label: 'dialog.signAmount', minWidth: '100', filterName: 'setMoney'},
            // 签订人
            {show: true, prop: 'signUserName', label: 'dialog.partyASignName', minWidth: '80'},
            // 签订日期
            {show: true, filterName: 'date', prop: 'signTime', label: 'dialog.signTime', minWidth: '120'},
            // 填写人
            {show: true, prop: 'createByName', label: 'fConfig.createByName', minWidth: '100'}
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
