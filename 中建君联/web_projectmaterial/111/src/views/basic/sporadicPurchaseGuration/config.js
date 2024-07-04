/*
 * @Author: your name
 * @Date: 2021-10-25 14:13:14
 * @LastEditTime: 2021-10-26 16:00:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\views\basic\sporadicPurchaseGuration\config.js
 */
import Utils from 'util';

const PageConfig = {
    // 数据字典
    dictionary: [
    ],
    // 搜索
    searchControls: {
        // 是否显示
        formShow: true,
        // 搜索使用插槽
        searchSlotShow: false,
        // 表单配置
        formList: [
            // 项目名称
            { show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64 }
        ],
        // 是否显示重置按钮
        isReset: false
    },
    // 是否现在表格操作按钮
    mainOperateBtnShow: false,
    // 表格操作按钮
    mainOperateBtn: [
        // 批量设置
        {
            isCustom: true, icon: 'el-icon-setting', class: 'more', name: 'sporadicPurchaseGuration.batchSet',
            code: 'handleBatchSet', authCode: 'batchSet', noAuth: false
        }
    ],
    // 主表渲染参数
    mainTable: {
        isCheckbox: true,
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
            // 项目名称
            { show: true, prop: 'projectName', label: 'fConfig.projectName' },
            // 项目编号
            { show: true, prop: 'projectCode', label: 'fConfig.projectCode', minWidth: '200' },
            // 零星采购额度
            { show: true, prop: 'purchaseQuota', label: 'sporadicPurchaseGuration.purchaseQuota', minWidth: '160', filterName: 'setMoney' },
            // 操作
            {
                show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '140',
                buts: [
                    { name: 'sporadicPurchaseGuration.set', class: 'success', fn: 'handleSetMoney', authCode: 'set', enable: true, noAuth: false }
                ]
            }
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
