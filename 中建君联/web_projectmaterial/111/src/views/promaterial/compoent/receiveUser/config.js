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
            // 负责人
            {show: true, label: 'supplyOrder.dutyPersonName', prop: 'dutyPersonName', span: 8, formType: 'input',
                clearable: true, inputStatus: 'edit', maxlength: 32},
            // 负责人电话
            {show: true, label: 'supplyOrder.dutyPersonMobile', prop: 'dutyPersonMobile', span: 8, formType: 'input',
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
            // 负责人
            { show: true, label: 'supplyOrder.dutyPersonName', prop: 'dutyPersonName'},
            // 负责人电话
            { show: true, label: 'supplyOrder.dutyPersonMobile', prop: 'dutyPersonMobile'},
            // 备注
            { show: true, label: 'fConfig.remarks', prop: 'remarks'}
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
