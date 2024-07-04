/*
 * @Author: wumaoxia 1805428335@qq.com
 * @Date: 2022-05-24 14:09:29
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @LastEditTime: 2022-10-12 10:08:58
 * @FilePath: \web_projectmaterial\src\views\processExecutionTracking\checkArrivalTrackingTracking\config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
        exportUrl: {
            url: 'checkArrivalTracking/getExportData'
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
            // 入库状态
            {
                show: true, label: 'checkArrivalTracking.incomingStatus', prop: 'incomingStatus', span: 8, formType: 'dicSelect',
                selectList: [
                    {dataCode: '01', dataName: 'checkArrivalTracking.incomingStatusTips1'}, // 未入库
                    {dataCode: '02', dataName: 'checkArrivalTracking.incomingStatusTips2'}, // 部分入库
                    {dataCode: '03', dataName: 'checkArrivalTracking.incomingStatusTips3'} // 已完成
                ], isTranslate: true, collapseTags: true, multiple: true
            },
            // 订单名称
            {show: true, label: 'checkArrivalTracking.supplyOrderName', prop: 'supplyOrderName', span: 8, formType: 'input', maxlength: 64},
            // 供应商名称
            {show: true, label: 'checkArrivalTracking.supplierName', prop: 'supplierName', span: 8, formType: 'input', maxlength: 64}
        ],
        // 是否显示重置按钮
        isReset: true
    },
    // 表格操作按钮
    mainOperateBtn: [
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
            // 入库状态
            {
                show: true, prop: 'incomingStatus', label: 'checkArrivalTracking.incomingStatus',
                minWidth: '120', align: 'center', formType: 'slot',
                selectList: [
                    {dataCode: '01', dataName: 'checkArrivalTracking.incomingStatusTips1'}, // 未入库
                    {dataCode: '02', dataName: 'checkArrivalTracking.incomingStatusTips2'}, // 部分入库
                    {dataCode: '03', dataName: 'checkArrivalTracking.incomingStatusTips3'} // 已完成
                ], isTranslate: true
            },
            // 所属公司
            { show: true, prop: 'orgName', label: 'fConfig.currentOrgName', minWidth: '140' },
            // 项目名称
            {show: true, prop: 'projectName', label: 'fConfig.projectName'},
            // 单据编号
            {show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', fn: 'handleInfo', align: 'center'},
            // 订单名称
            {show: true, prop: 'supplyOrderName', label: 'checkArrivalTracking.supplyOrderName'},
            // 主要验收材料
            {show: true, prop: 'mainCheckMaterials', label: 'checkArrivalTracking.mainCheckMaterials', minWidth: '160'},
            // 供应商名称
            {show: true, prop: 'supplierName', label: 'checkArrivalTracking.supplierName', minWidth: '120'},
            // 参与验收人员
            {show: true, prop: 'checkTeam', label: 'checkArrivalTracking.checkTeam', minWidth: '120'},
            // 验收日期
            {show: true, filterName: 'date', prop: 'checkDate', label: 'checkArrivalTracking.checkDate', minWidth: '120'},
            // 操作
            {show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '80',
                buts: []
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
          // 到货数量
          { show: true, label: 'checkArrivalTracking.currentArrivalQuantity', prop: 'currentArrivalQuantity'},
          // 验收通过数量
          { show: true, label: 'checkArrivalTracking.checkPassedQuantity', prop: 'checkPassedQuantity'},
          // 入库数量
          { show: true, label: 'checkArrivalTracking.incomingQuantity', prop: 'incomingQuantity', formType: 'slot'}
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

