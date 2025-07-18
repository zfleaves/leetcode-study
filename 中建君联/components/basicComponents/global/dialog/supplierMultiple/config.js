import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {},
    // 数据字典
    dictionary: [
        { dicCode: 'unitNatureCode', propCode: 'unitNatureCode' },
        { dicCode: 'supplierType', propCode: 'supplierCategoryCode' }
    ],
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
            { show: true, name: '供方类别', prop: 'supplierCategoryCode', label: 'fConfig.basicClassifyCode', span: 8, formType: 'dicSelect', selectList: []},

            { show: true, name: '供方名称', prop: 'supplierName', label: 'fConfig.supplierName', span: 8, formType: 'input', maxlength: 64 },

            // { show: true, name: '单位编号', prop: 'supplierCode', label: 'fConfig.supplierCode', span: 8, formType: 'input', maxlength: 32 },

            {show: true, name: '单位性质', prop: 'unitNatureCode', label: 'fConfig.unitNatureValue', span: 8, formType: 'dicSelect', selectList: []},

            { show: true, name: '统一社会信用代码', prop: 'supplierUscc', label: 'fConfig.uscc', span: 8, formType: 'input', maxlength: 64 },

            { show: true, name: '成立时间', prop: 'establishmentTime', label: 'fConfig.establishmentTime', span: 8, formType: 'daterange-split',
               propStart: 'establishmentTimeFrom', propEnd: 'establishmentTimeTo', inputStatus: 'edit'
            }

        ],
        // 是否显示重置按钮
        isReset: true
    },
    // 表格操作按钮
    mainOperateBtn: [],
    isFooterShow: true,
    // 主表渲染参数
    mainTable: {
        rowKey: 'supplierId',
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
            // { show: true, name: '单位编号', prop: 'supplierCode', label: 'fConfig.supplierCode', minWidth: '100', align: 'center' },

            // { show: true, name: '供方类别', prop: 'basicClassifyValue', label: 'fConfig.basicClassifyCode', minWidth: '140', align: 'center' },

            // { show: true, name: '供方名称', prop: 'supplierName', label: 'fConfig.supplierName' },

            // { show: true, name: '单位性质', prop: 'unitNatureValue', label: 'fConfig.unitNatureValue'},

            // { show: true, name: '统一社会信用代码', prop: 'uscc', label: 'fConfig.uscc', minWidth: '140' },

            // { show: true, name: '成立时间', prop: 'establishDate', label: 'fConfig.establishDate', filterName: 'date', minWidth: '120', align: 'center' },

            // { show: true, name: '所属行业', prop: 'ofIndustry', label: 'fConfig.engineeringClassifyCodes' },

            // { show: true, name: '注册地址', prop: 'address', label: 'dialog.address' },

            // { show: true, name: '负责人', prop: 'contactUserName', label: 'fConfig.contactUserName', minWidth: '100' }
            // 从合格供方库里面选择
            { show: true, name: '供方类别', prop: 'supplierCategoryValue', label: 'fConfig.basicClassifyCode', minWidth: '120', align: 'center' },

            { show: true, name: '供方名称', prop: 'supplierName', label: 'fConfig.supplierName'},

            { show: true, name: '单位性质', prop: 'unitNatureValue', label: 'fConfig.unitNatureValue', minWidth: '140' },

            { show: true, name: '统一社会信用代码', prop: 'supplierUscc', label: 'fConfig.uscc', minWidth: '200' },

            { show: true, name: '成立时间', prop: 'establishmentTime', label: 'fConfig.establishmentTime', filterName: 'date', minWidth: '120', align: 'center'},

            { show: true, name: '注册资金', prop: 'registeredCapitalAmount', label: 'fConfig.registeredCapitalAmount', filterName: 'setMoney', align: 'right', minWidth: '120'},

            { show: true, name: '注册地址', prop: 'registeredAddress', label: 'fConfig.registeredAddress' },

            { show: true, name: '负责人', prop: 'supplierResponsiblePerson', label: 'fConfig.contactUserName', minWidth: '100'}
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
