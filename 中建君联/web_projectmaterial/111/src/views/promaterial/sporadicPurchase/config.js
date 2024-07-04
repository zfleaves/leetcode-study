/*
 * @Author: your name
 * @Date: 2020-07-30 10:37:49
 * @LastEditTime: 2022-08-22 10:24:29
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\sporadicPurchase\config.js
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'purchaseSporadicPurchase',
  // 流程
  processParmas: {
    // 初始化信息
    startInfo: {
      url: 'sporadicPurchase/getStartNode',
      parmasList: [
        { receive: 'sid', value: 'id' },
        { receive: 'projectId', value: 'projectId' }
      ]
    },
    // 提交
    startSubmit: {
      url: 'sporadicPurchase/startSubmit'
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
      // 项目名称
      { show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64 },
      // 单据编号
      { show: true, label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', maxlength: 32 },
      // 审批状态
      { show: true, label: 'fConfig.flowStatus', prop: 'flowStatus', span: 8, formType: 'flowStatus' },
      // 零星采购原因
      { show: true, label: 'sporadicPurchase.sporadicPurchaseReason', prop: 'sporadicPurchaseReason', span: 8, formType: 'input', maxlength: 128 },
      // 拟采购内容
      { show: true, label: 'sporadicPurchase.purchaseContent', prop: 'purchaseContent', span: 8, formType: 'input', maxlength: 128 },
      // 申请人
      { show: true, label: 'sporadicPurchase.applyUserName', prop: 'applyUserName', span: 8, formType: 'input', maxlength: 32 },
      // 申请日期
      {
        label: 'sporadicPurchase.applyDate', span: 8, formType: 'daterange-split',
        propStart: 'applyDateFrom', propEnd: 'applyDateTo',
        inputStatus: 'edit'
      }
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [
    { isCustom: false, code: 'sysHandleAdd', authCode: 'create' },
    { isCustom: false, code: 'sysHandleStartProcess', authCode: 'startProcess' },
    { isCustom: false, code: 'sysHandleMonitorProcess', authCode: 'monitorProcess' },
    { isCustom: false, code: 'sysHandlePrint', authCode: 'print' }
  ],
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
      // 审批状态
      { show: true, prop: 'flowStatus', label: 'fConfig.flowStatus', formType: 'flowStatus', minWidth: '100', align: 'center' },
      // 单据编号
      { show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160', fn: 'handleInfo', align: 'center' },
      // 项目名称
      { show: true, prop: 'projectName', label: 'fConfig.projectName'},
      // 项目编号
      // { show: true, prop: 'projectCode', label: 'fConfig.projectCode', minWidth: '120' },
      // 零星采购原因
      { show: true, prop: 'sporadicPurchaseReason', label: 'sporadicPurchase.sporadicPurchaseReason'},
      // 拟采购内容
      { show: true, prop: 'purchaseContent', label: 'sporadicPurchase.purchaseContent'},
      // 预计采购金额
      { show: true, prop: 'estimatePurchaseAmount', label: 'sporadicPurchase.estimatePurchaseAmount', minWidth: '120', formType: 'setMoney', filterName: 'setMoney' },
      // 申请人
      { show: true, prop: 'applyUserName', label: 'sporadicPurchase.applyUserName', minWidth: '80' },
      // 申请日期
      { show: true, filterName: 'date', prop: 'applyDate', label: 'sporadicPurchase.applyDate', minWidth: '120' },
      // 是否已快速入库
      {show: true, prop: 'ifFastIncoming', label: 'sporadicPurchase.ifFastIncoming', formType: 'dicSelect', align: 'center', selectList: [
        {dataCode: 1, dataName: 'tips.yes'},
        {dataCode: 0, dataName: 'tips.no'}
       ], isTranslate: true, minWidth: '120'
      },
      // 操作
      {
        show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '160',
        buts: [
          { name: 'button.edit', class: 'warning', fn: 'handleEdit', authCode: 'update', isCreateBy: true },
          { name: 'button.delete', class: 'danger', fn: 'handleDelete', authCode: 'delete', isCreateBy: true }
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
