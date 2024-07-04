/*
 * @Author: your name
 * @Date: 2020-07-30 10:35:19
 * @LastEditTime: 2022-06-20 17:10:15
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\checkArrival\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'checkArrival/getWorkflowNextNode',
      parmasList: [
        { receive: 'sid', value: 'taskSid' },
        { receive: 'projectId', value: 'projectId' }
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'checkArrival/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'checkArrival/setDelete',
      params: 'checkArrivalId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'checkArrival/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'checkArrival/getInfo',
      params: 'checkArrivalId'
    },
    // save
    saveUrl: {
      url: 'checkArrival/setEdit'
    },
    exportDetail: {
      url: 'checkArrival/exportDetail',
      params: 'checkArrivalId'
    }
  },
  // 数据字典
  dictionary: [],
  // 接口数据
  selectList: [],
  // 主表
  mainFormConfig: {
    formList: [
      // 单据编号
      {
        label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 填写人
      {
        label: 'fConfig.createByName', prop: 'createByName', span: 8, formType: 'input', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 填写日期
      {
        label: 'fConfig.createTime', prop: 'createTime', span: 8, formType: 'date', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 项目名称
      {
        label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'project', key: 'projectId',
        isRelation: true,
        relationList: [{ receive: 'projectCode', value: 'projectCode' },
        { receive: 'supplyOrderName', value: 'supplyOrderName' },
        { receive: 'supplyOrderId', value: 'supplyOrderId' },
        { receive: 'supplyOrderCode', value: 'supplyOrderCode' },
        { receive: 'supplierId', value: 'supplierId' },
        { receive: 'supplierName', value: 'supplierName' },
        { receive: 'costControlRuleValue', value: 'costControlRuleValue' },
        { receive: 'costControlRuleCode', value: 'costControlRuleCode' }],
        isRule: true, check: true,
        relationTable: ['purchaseCheckArrivalDetail'],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 项目编号
      {
        label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 供货订单名称
      {
        label: 'checkArrival.supplyOrderName', prop: 'supplyOrderName', span: 8, formType: 'slot', key: 'supplyOrderId', isRule: true,
        isRelation: true,
        relationList: [
          { receive: 'supplyOrderName', value: 'orderName' },
          { receive: 'supplyOrderCode', value: 'docNo' },
          { receive: 'supplierId', value: 'supplierId' },
          { receive: 'supplierName', value: 'supplierName' },
          { receive: 'expendContractId', value: 'expendContractId' },
          { receive: 'expendContractName', value: 'expendContractName' }
        ],
        relationTable: ['purchaseCheckArrivalDetail'],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 供货订单编号
      {
        label: 'checkArrival.supplyOrderCode', prop: 'supplyOrderCode', span: 8, formType: 'input', inputStatus: 'disable', placeholder: 'checkArrival.automaticSupplyOrder',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 供应商名称
      {
        label: 'checkArrival.supplierName', prop: 'supplierName', span: 8, formType: 'input', inputStatus: 'disable', placeholder: 'checkArrival.automaticSupplyOrder',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 合同名称
      {
        label: 'dialog.contractName', prop: 'expendContractName', span: 8, formType: 'input', inputStatus: 'disable'
      },
      // 参与验收人员
      {
        label: 'checkArrival.checkTeam', prop: 'checkTeam', span: 8, formType: 'input', maxlength: 64, isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 主要验收材料
      {
        label: 'checkArrival.mainCheckMaterials', prop: 'mainCheckMaterials', span: 16, formType: 'input',
        inputStatus: 'disable', placeholder: 'checkArrival.mainCheckMaterialsTips', // 自动获取明细前1-5行明细名称
        printWidth: 16, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 送货单编号
      {
        label: 'checkArrival.supplyOrderDeliverDocNos', prop: 'supplyOrderDeliverDocNos', span: 16, formType: 'slot',
        isRule: false, placeholder: 'checkArrival.supplyOrderDeliverDocNosTips', // 如需选择送货单明细，请先选择送货单编号
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, printValue: 'supplyOrderDeliverDocNo'
      },
      // 验收日期
      {
        label: 'checkArrival.checkDate', prop: 'checkDate', span: 8, formType: 'date', isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 整体验收情况
      {
        label: 'checkArrival.checkSituation', prop: 'checkSituation', span: 24, formType: 'textarea', maxlength: 256,
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 附件
      { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' }
    ],
    oldRelationList: []
  },
  subTableMatch: [
    { value: 'checkArrivalDetails', assignment: 'purchaseCheckArrivalDetail' }
  ],
  // 子表
  subTableConfig: {
    // 明细清单
    purchaseCheckArrivalDetail: {
      subTableName: 'purchaseCheckArrivalDetail',
      titleTips: 'purchaseCheckArrivalDetailTips',
      isSelection: true,
      // 子表按钮
      subTableButton: [
        { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'purchaseCheckArrivalDetail', disabled: false },
        // 导出明细
        { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'purchaseCheckArrivalDetail', name: 'button.export', authCode: 'export' },
        { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'purchaseCheckArrivalDetail', disabled: false }
      ],
      tableList: {
        // 表头配置
        slaveColumns: [
          // 供货订单编号
          {
            label: 'checkArrival.supplyOrderCode', prop: 'supplyOrderCode', formType: 'text', maxlength: 64, minWidth: 130,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 材料编码
          {
            label: 'fConfig.varietiesCode', prop: 'varietiesCode', formType: 'text', maxlength: 64, minWidth: 100,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 材料名称
          {
            label: 'fConfig.varietiesName', prop: 'executeVarietiesName', formType: 'text', maxlength: 32, minWidth: 140,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 规格
          {
            label: 'fConfig.standards', prop: 'executeStandards', formType: 'text', maxlength: 32, minWidth: 80,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 计量单位
          {
            label: 'fConfig.unit', prop: 'executeUnit', formType: 'text', minWidth: 50,
            printWidth: 5, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 型号
          {
            label: 'fConfig.models', prop: 'models', formType: 'input', minWidth: 100, maxlength: 64,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 品牌
          {
            label: 'fConfig.brand', prop: 'brand', formType: 'input', minWidth: 80, maxlength: 128,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  订单下达数量
          {
            label: 'checkArrival.supplyOrderQuantity', prop: 'supplyOrderQuantity', formType: 'text', filterName: 'number', minWidth: 100,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  预定到货日期
          {
            label: 'checkArrival.arrivalDate', prop: 'arrivalDate', formType: 'text', filterName: 'date', minWidth: 120,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // // 拟使用部位
          // {
          //   label: 'checkArrival.usePlaceName', prop: 'usePlaceName', formType: 'text', maxlength: 255,
          //   printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0, minWidth: 120
          // },
          //  已验收数量
          {
            label: 'checkArrival.alreadyArrivalQuantity', prop: 'alreadyArrivalQuantity', formType: 'text', filterName: 'number', minWidth: 100,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  本次到货数量
          {
            label: 'checkArrival.currentArrivalQuantity', prop: 'currentArrivalQuantity', formType: 'number', operateData: true, precision: 4, min: 0, maxlength: 12, minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  本次验收通过数量
          {
            label: 'checkArrival.checkPassedQuantity', prop: 'checkPassedQuantity', formType: 'slot', precision: 4, maxlength: 12, min: 0, minWidth: 140,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  验收通过率
          {
            label: 'checkArrival.checkPassedRate', prop: 'checkPassedRate', formType: 'text', filterName: 'setMoney', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 验收备注
          {
            label: 'checkArrival.checkRemarks', prop: 'checkRemarks', formType: 'input', maxlength: 255,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 所属工程量编号字段展示出来，不可编辑（项目为费用类型管控时是所属费用科目字段），且子表有拟使用部位时，将拟使用部位字段隐藏
          // // 所属工程量名称（执行策划管控时显示）
          // {
          //   label: 'fConfig.quantitiesName', prop: 'quantitiesName', formType: 'text', minWidth: 120, inputStatus: 'disable',
          //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          // },
          // // 所属工程量编号（执行策划管控时显示）
          // {
          //   label: 'fConfig.quantitiesCode', prop: 'quantitiesCode', formType: 'text', minWidth: 140, inputStatus: 'disable',
          //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          // },
          // // 所属费用科目 (费用类型管控时显示)
          // {
          //   label: 'fConfig.expenseName', prop: 'expenseName', formType: 'text', maxlength: 64, minWidth: 120, inputStatus: 'hide',
          //   printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          // },
          // // 所属费用科目编号 (费用类型管控时显示)
          // {
          //   label: 'fConfig.expenseCode', prop: 'expenseCode', formType: 'text', maxlength: 32, minWidth: 140, inputStatus: 'hide',
          //   printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          // },
          // 供货备注
          {
            label: 'checkArrival.supplyRemarks', prop: 'supplyRemarks', formType: 'text', maxlength: 255,
            printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
          }
        ],
        // 校验
        rules: {},
        // 初始化行数据
        tableDataRow: {}
      }, // 子表配置
      tableData: [] // 子表数据
    }
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
