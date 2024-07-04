/*
 * @Author: your name
 * @Date: 2021-06-15 10:30:10
 * @LastEditTime: 2021-06-15 13:50:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_project-项目前期管理\src\views\projectManage\components\contract\config.js
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
            // 项目名称
            {
                show: true, label: 'dialog.projectName', prop: 'projectName', span: 8, formType: 'input',
                clearable: true, inputStatus: 'disable', maxlength: 64
            },
            // 合同名称
            {
                show: true, label: 'dialog.contractName', prop: 'contractName', span: 8, formType: 'input',
                clearable: true, inputStatus: 'edit', maxlength: 64
            },
            // 合同编号
            {
                show: true, label: 'dialog.contractCode', prop: 'contractCode', span: 8, formType: 'input',
                clearable: true, inputStatus: 'edit', maxlength: 32
            },
            // 乙方单位
            {
                show: true, label: 'dialog.partyB', prop: 'partyBUnitName', span: 8, formType: 'input',
                clearable: true, inputStatus: 'edit', maxlength: 64
            },
            // 签订人
            {
                show: true, label: 'dialog.partyASignName', prop: 'signUserName', span: 8, formType: 'input',
                clearable: true, inputStatus: 'edit', maxlength: 32
            },
            // 签订日期
            {
                label: 'dialog.signTime', span: 8, formType: 'daterange-split', clearable: true,
                propStart: 'signTimeFrom', propEnd: 'signTimeTo',
                inputStatus: 'edit'
            }
            // // 合同类型
            // {show: true, label: 'dialog.contractClassifyName', prop: 'contractClassifyId', span: 8, formType: 'select', selectList: [],
            //     clearable: true, nameCode: 'classifyName', valueCode: 'id'}
        ],
        // 是否显示重置按钮
        isReset: true
    },
    // 表格操作按钮
    mainOperateBtn: [],
    isFooterShow: true,
    // 主表渲染参数
    mainTable: {
        // 是否能保存显隐列
        customShow: false,
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
            { show: true, prop: 'contractCode', label: 'dialog.contractCode', minWidth: '140' },
            // 项目名称
            { show: true, prop: 'projectName', label: 'dialog.projectName' },
            // 合同名称
            { show: true, prop: 'contractName', label: 'dialog.contractName' },
            // 合同类型
            { show: true, prop: 'contractClassifyName', label: 'dialog.contractClassifyName', minWidth: '120' },
            // 乙方单位
            { show: true, prop: 'partyBUnitName', label: 'dialog.partyB' },
            // 签订金额
            { show: true, prop: 'signAmount', label: 'dialog.signAmount', minWidth: '120', filterName: 'setMoney' },
            // 签订人
            { show: true, prop: 'agentUserName', label: 'dialog.agentUserName', minWidth: '100' },
            // 签订人
            { show: true, prop: 'agentUserMobile', label: 'dialog.agentUserMobile', minWidth: '120' },
            // 签订人
            { show: true, prop: 'signUserName', label: 'dialog.partyASignName', minWidth: '120' },
            // 签订日期
            { show: true, filterName: 'date', prop: 'signTime', label: 'dialog.signTime', minWidth: '120' }
            // 上次收款日期
            // {show: true, filterName: 'date', prop: 'lastCollectionDate', label: 'dialog.lastCollectionDate', minWidth: '120', align: 'center'}
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
