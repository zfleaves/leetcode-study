/*
 * @Author: your name
 * @Date: 2022-02-21 11:11:23
 * @LastEditTime: 2022-02-21 11:11:23
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \web_projectmaterial-项目材料管理\src\views\promaterial\compoent\contractPurchase\config.js
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
            // 乙方单位
            {
                show: true, label: 'fConfig.contractSporadicPurchaseName', prop: 'contractName', span: 24, formType: 'input',
                clearable: true, inputStatus: 'edit', maxlength: 64, placeholder: 'fConfig.contractNameTips'
            }
        ],
        // 是否显示重置按钮
        isReset: true,
        // 按钮样式
        isResetStyle: true
    },
    // 表格操作按钮
    mainOperateBtn: [],
    isFooterShow: true,
    // 主表渲染参数
    mainTable: {
        rowKey: 'rowKey',
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
            showColumnCtrl: false, // 显示/隐藏列
            refresh: false // 刷新
        },
        // 是否默认选中第一行
        defaultSeleFirstLine: false,
        // 子系统表头渲染参数
        tableList: [
            // 类型
            { show: true, prop: 'sourceTypeName', label: 'dialog.sourceType', minWidth: '140' },
            // 编号
            { show: true, prop: 'code', label: 'dialog.contractCode', minWidth: '160' },
            // 名称
            { show: true, prop: 'contractName', label: 'fConfig.contractSporadicPurchaseName' },
            // 乙方单位
            { show: true, prop: 'supplierName', label: 'dialog.partyB' },
            // 填写人
            { show: true, prop: 'createByName', label: 'fConfig.createByName', minWidth: '80' },
            // 填写日期
            { show: true, filterName: 'date', prop: 'createTime', label: 'fConfig.createTime', minWidth: '100' }
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
