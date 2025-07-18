/*
 * @Author: zengqin 1058574586@qq.com
 * @Date: 2022-12-08 17:44:04
 * @LastEditors: zengqin 1058574586@qq.com
 * @LastEditTime: 2022-12-08 17:56:03
 * @FilePath: \web_projectmaterial\src\views\promaterial\compoent\calibration\offlineInquiry\config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {},
    // 数据字典
    dictionary: [
        { dicCode: 'projectTypeCode', propCode: 'projectTypeCodes' },
        { dicCode: 'projectStatus', propCode: 'projectStatus' }
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
            {
                name: '项目名称', show: true, label: 'fConfig.projectName', prop: 'projectName',
                formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 128
            },

            {
                name: '申请部门', show: true, label: 'fConfig.applyOrgName', prop: 'belongDeptName',
                formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 128
            },

            {
                name: '项目类别', label: 'dialog.projectTypeName', prop: 'projectTypeCodes', multiple: true,
                formType: 'dicSelect', selectList: [], clearable: true, inputStatus: 'edit'
            },

            {
                name: '项目负责人', show: true, label: 'dialog.projectManagerUserName', prop: 'projectManagerUserName',
                formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 64
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
        //  单选
        isRadio: true,
        // 表格数据
        tableData: [],
        height: 500,
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
            { name: '项目名称', show: true, prop: 'projectName', label: 'fConfig.projectName' },

            { name: '申请部门', show: true, prop: 'belongDeptName', label: 'fConfig.applyDeptName' },

            { name: '项目类别', show: true, prop: 'projectTypeName', label: 'dialog.projectTypeName', minWidth: '100' },

            { name: '配合部门', show: true, prop: 'coordinateDeptName', label: 'dialog.coordinateDeptName' },

            { name: '项目负责人', show: true, prop: 'projectManagerUserName', label: 'dialog.projectManagerUserName', minWidth: '100' }
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
