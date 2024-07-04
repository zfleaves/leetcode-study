/*
 * @Author: your name
 * @Date: 2021-04-07 11:21:08
 * @LastEditTime: 2022-10-12 09:49:43
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\views\processExecutionTracking\orderTracking\config.js
 */
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        exportUrl: {
            url: 'orderTracking/getExportData'
        }
    },
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
            // 所属公司
            { show: true, label: 'fConfig.currentOrgName', prop: 'orgName', span: 8, formType: 'input', maxlength: 64 },
            // 项目名称
            { show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64 },
            // 单据编号
            { show: true, label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', maxlength: 32 },
            // 供货状态
            {
                show: true, label: 'orderTracking.supplyOrderStatus', prop: 'supplyOrderStatus', span: 8, formType: 'dicSelect',
                selectList: [
                    { dataCode: '01', dataName: '未执行' },
                    { dataCode: '02', dataName: '发货中' },
                    { dataCode: '03', dataName: '部分供货' },
                    { dataCode: '04', dataName: '已完成' },
                    { dataCode: '05', dataName: '手动关闭' }
                ], collapseTags: true, multiple: true
            }
        ],
        // 是否显示重置按钮
        isReset: true
    },
    // 表格操作按钮
    mainOperateBtn: [
        // 更新
        // { isCustom: true, code: 'sysHandleRenew', authCode: 'renew', name: 'button.renew' },
        { isCustom: false, code: 'sysHandleExport', authCode: 'export' }
    ],
    // 主表渲染参数
    mainTable: {
        //  单选
        isRadio: false,
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
            // 展开/收起
            { show: true, prop: 'expandCollapse', label: 'dialog.expandCollapse', minWidth: '80', formType: 'expand' },
            // 供货状态
            {show: true, prop: 'supplyOrderStatus', label: 'orderTracking.supplyOrderStatus', formType: 'slot', align: 'center', selectList: [],
               minWidth: '100'
            },
            // 所属公司
            { show: true, prop: 'orgName', label: 'fConfig.currentOrgName' },
            // 项目名称
            { show: true, prop: 'projectName', label: 'fConfig.projectName'},
            // 订单名称
            { show: true, prop: 'orderName', label: 'fConfig.orderName'},
            // 订单编号
            { show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', fn: 'handleInfo' },
            // 主要供货明细
            { show: true, prop: 'mainSupplyDetail', label: 'orderTracking.mainSupplyDetail', minWidth: '140' },
            // 验收日期
            { show: true, filterName: 'date', prop: 'releaseDate', label: 'orderTracking.arrivalDate', minWidth: '120' },
            // 下达人
            { show: true, prop: 'releaseUserName', label: 'orderTracking.releaseUserName', minWidth: '80' },
            // 填写日期
            { show: true, filterName: 'date', prop: 'createTime', label: 'fConfig.createTime', minWidth: '100' },
            // 关闭原因
            { show: true, prop: 'closeReason', label: 'dialog.closeReason'},
            // 操作
            {
                show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '80',
                slotButs: [
                    // { name: 'button.edit', class: 'warning', fn: 'handleEdit', authCode: 'update', isCreateBy: false },
                    { name: 'button.closed', class: 'danger', fn: 'sysHandleForceUpdate', authCode: 'forceUpdate', isCreateBy: false }
                ]
            }
        ]
    },
    childrenMainTable: {
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
        // 名称、编码、规格。型号、品牌、单位、报量数量、送货通知数量、零星采购数量；
          // 名称
          { show: true, label: 'fConfig.varietiesNameSc', prop: 'executeVarietiesName', minWidth: 120 },
          // 编码
          { show: true, label: 'fConfig.varietiesCodeSc', prop: 'varietiesCode', minWidth: 120},
          // 规格
          { show: true, label: 'fConfig.standards', prop: 'executeStandards', minWidth: 120 },
          // 型号
          { show: true, label: 'fConfig.models', prop: 'models', minWidth: 120 },
          // 品牌
          { show: true, label: 'fConfig.brand', prop: 'brand', minWidth: 120 },
          // 计量单位
          { show: true, label: 'fConfig.unit', prop: 'executeUnit'},
          // 申请数量
          { show: true, label: 'orderTracking.currentApplyQuantity', prop: 'currentApplyQuantity'},
          // 验收数量
          { show: true, label: 'orderTracking.shippedQuantity', prop: 'arrivalQuantity'}
      ]
    },
    mainFormConfig: {
      formList: [
        {
            label: 'orderTracking.forceUpdateTipes', prop: 'forceUpdateTipes', span: 24, formType: 'promptInformation'
        },
        // 关闭原因
        {
          label: 'dialog.closeReason', prop: 'closeReason', span: 24, formType: 'textarea', maxlength: 256,
          minRows: '4', maxRows: '8', isRule: true,
          printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
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
