/*
 * @Author: your name
 * @Date: 2020-07-30 10:37:56
 * @LastEditTime: 2022-09-27 11:29:45
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\sporadicPurchase\confidEdit.js
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'purchaseSporadicPurchase',
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'sporadicPurchase/getWorkflowNextNode',
      parmasList: [
        { receive: 'sid', value: 'taskSid' },
        { receive: 'projectId', value: 'projectId' }
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'sporadicPurchase/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'sporadicPurchase/setDelete',
      params: 'sporadicPurchaseId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'sporadicPurchase/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'sporadicPurchase/getInfo',
      params: 'sporadicPurchaseId'
    },
    // save
    saveUrl: {
      url: 'sporadicPurchase/setEdit'
    },
    // 导出明细
    exportDetail: {
      url: 'sporadicPurchase/exportDetail',
      params: 'sporadicPurchaseId'
    }
  },
  // 数据字典
  dictionary: [
    { dicCode: 'taxRate', propCode: 'taxRate' },
    { dicCode: 'taxRate', propCode: 'estimateRate' }
  ],
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
        relationList: [
          { receive: 'projectCode', value: 'projectCode' },
          { receive: 'costControlRuleValue', value: 'costControlRuleValue' },
          { receive: 'costControlRuleCode', value: 'costControlRuleCode' }
        ],
        isRule: true, check: true,
        relationTable: ['purchaseSporadicPurchaseDetail'],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // // 供应商名称
      // {
      //   label: 'fConfig.partyBName', prop: 'supplierName', span: 8, formType: 'slot', key: 'supplierId',
      //   isRule: false, isRelation: true,
      //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      // },
      // 供应商名称
      {
        label: 'fConfig.partyBName', prop: 'supplierName', span: 8, formType: 'partyB', key: 'supplierId'
      },
      // 项目编号
      {
        label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 零星采购单号
      {
        label: 'sporadicPurchase.purchaseCode', prop: 'purchaseCode', span: 8, formType: 'input', maxlength: 32,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 预计采购金额
      {
        label: 'sporadicPurchase.estimatePurchaseAmount', prop: 'estimatePurchaseAmount', span: 8, formType: 'elNumber', min: 0, precision: 2, maxlength: 12, inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
      },
      // 拟采购内容
      {
        label: 'sporadicPurchase.purchaseContent', prop: 'purchaseContent', span: 8, formType: 'input', inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 申请人
      {
        label: 'sporadicPurchase.applyUserName', prop: 'applyUserName', span: 8, formType: 'userRadio', key: 'applyUserId', isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 申请日期
      {
        label: 'sporadicPurchase.applyDate', prop: 'applyDate', span: 8, formType: 'date', isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 预计税率(%)
      {
        label: 'sporadicPurchase.estimateRate', prop: 'estimateRate', span: 8, formType: 'dicSelect', selectList: [],
        otherOperate: true, otherOperateFun: 'changeTaxRate',
        printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0, filterName: 'taxRate'
      },
      // 零星采购原因
      {
        label: 'sporadicPurchase.sporadicPurchaseReason', prop: 'sporadicPurchaseReason', span: 24, formType: 'input', maxlength: 256, isRule: true,
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 附件
      { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' }
    ],
    oldRelationList: []
  },
  subTableMatch: [
    { value: 'sporadicPurchaseDetails', assignment: 'purchaseSporadicPurchaseDetail' }
  ],
  // 子表
  subTableConfig: {
    // 明细清单
    purchaseSporadicPurchaseDetail: {
      subTableName: 'purchaseSporadicPurchaseDetail',
      titleTips: 'purchaseSporadicPurchaseDetailTips',
      isSelection: true,
      // 子表按钮
      subTableButton: [
        { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'purchaseSporadicPurchaseDetail', disabled: false },
        // 导出明细
        { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'purchaseSporadicPurchaseDetail', name: 'button.export', authCode: 'export' },
        { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'purchaseSporadicPurchaseDetail', disabled: false }
      ],
      tableList: {
        // 表头配置
        slaveColumns: [
          // 需求计划单号
          {
            label: 'sporadicPurchase.demandPlanCode', prop: 'demandPlanCode', formType: 'text', maxlength: 64, minWidth: 140,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 材料编码
          {
            label: 'fConfig.varietiesCode', prop: 'varietiesCode', formType: 'text', maxlength: 64, minWidth: 100,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 材料名称
          {
            label: 'fConfig.varietiesName', prop: 'executeVarietiesName', formType: 'text', maxlength: 64, minWidth: 140,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 规格
          {
            label: 'fConfig.standards', prop: 'executeStandards', formType: 'text', maxlength: 64, minWidth: 80,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 计量单位
          {
            label: 'fConfig.unit', prop: 'executeUnit', formType: 'text', minWidth: 50,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 型号
          {
            label: 'fConfig.models', prop: 'models', formType: 'input', maxlength: 32,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 品牌
          {
            label: 'fConfig.brand', prop: 'brand', formType: 'input', maxlength: 32,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 需求类型
          {
            label: 'sporadicPurchase.demandPlanTypeValue', prop: 'demandPlanTypeValue', formType: 'text', maxlength: 32, minWidth: 80,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  需求数量
          {
            label: 'sporadicPurchase.demandPlanQuantity', prop: 'demandPlanQuantity', formType: 'text', filterName: 'number', minWidth: 80,
            printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  已申请采购数量
          {
            label: 'sporadicPurchase.alreadyApplyQuantity', prop: 'alreadyApplyQuantity', formType: 'text', filterName: 'number', minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  本次申请数量
          {
            label: 'sporadicPurchase.currentApplyQuantity', prop: 'currentApplyQuantity', formType: 'number', operateData: true, precision: 4, maxlength: 12, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // //  预计单价
          // { label: 'sporadicPurchase.estimateUnitPrice', prop: 'estimateUnitPrice', formType: 'number', operateData: true, precision: 2, maxlength: 12, minWidth: 120,
          //   printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
          // },
          // //  预计金额
          // { label: 'sporadicPurchase.estimateAmount', prop: 'estimateAmount', formType: 'number', operateData: true, precision: 2, maxlength: 12, minWidth: 100,
          //   printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
          // },
          // 税率(%)
          {
            label: 'fConfig.taxRate', prop: 'taxRate', formType: 'dicSelect', operateData: true,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, minWidth: 100, filterName: 'taxRate', selectList: []
          },
          //  单价(含税)
          {
            label: 'sporadicPurchase.estimateUnitPrice', prop: 'estimateUnitPrice', formType: 'number', operateData: true, precision: 4, min: 0, maxlength: 17, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  金额(含税)
          {
            label: 'sporadicPurchase.estimateAmount', prop: 'estimateAmount', formType: 'number', operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  单价(不含税)
          {
            label: 'fConfig.unitPrice', prop: 'excludeUnitPrice', formType: 'number', operateData: true, precision: 8, min: 0, maxlength: 18, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  金额(不含税)
          {
            label: 'fConfig.excludeTaxAmount', prop: 'excludeTaxAmount', formType: 'number', operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  税额
          {
            label: 'fConfig.taxAmount', prop: 'taxAmount', formType: 'number', filterName: 'setMoney',
            precision: 2,
            printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 备注(型号，品牌等)
          {
            label: 'sporadicPurchase.remarks', prop: 'remarks', formType: 'input', minWidth: 160, maxlength: 255,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 往期采购价
          { label: 'fConfig.frequency', prop: 'purchaseUnitPriceCounts', formType: 'slot', minWidth: 100,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 所属工程量编号字段展示出来，不可编辑（项目为费用类型管控时是所属费用科目字段），且子表有拟使用部位时，将拟使用部位字段隐藏
          // // 所属工程量名称（执行策划管控时显示）
          {
            label: 'fConfig.quantitiesName', prop: 'quantitiesName', formType: 'text', minWidth: 120, inputStatus: 'disable',
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 所属工程量编号（执行策划管控时显示）
          {
            label: 'fConfig.quantitiesCode', prop: 'quantitiesCode', formType: 'text', minWidth: 140, inputStatus: 'disable',
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 所属费用科目 (费用类型管控时显示)
          {
            label: 'fConfig.expenseName', prop: 'expenseName', formType: 'text', maxlength: 64, minWidth: 120, inputStatus: 'hide',
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 所属费用科目编号 (费用类型管控时显示)
          {
            label: 'fConfig.expenseCode', prop: 'expenseCode', formType: 'text', maxlength: 32, minWidth: 140, inputStatus: 'hide',
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 申请班组 => 申报料单位
          {
            label: 'fConfig.applicant', prop: 'projectUnitName', formType: 'text',
            printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 零星采购：子表增加中标单价、成控单价、策划单价，带入，不可编辑
          // 中标单价
          {
            label: 'fConfig.bidUnitPrice', prop: 'bidUnitPrice', formType: 'text',
            filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 成控单价
          {
            label: 'fConfig.controlUnitPrice', prop: 'controlUnitPrice', formType: 'text',
            filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 策划单价
          {
            label: 'fConfig.budgetUnitPrice', prop: 'budgetUnitPrice', formType: 'text',
            filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 需求备注
          {
            label: 'sporadicPurchase.demandRemarks', prop: 'demandRemarks', formType: 'text', minWidth: 120,
            printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
          }
        ],
        // 校验
        rules: {
          estimateUnitPrice: [
            { required: true, message: 'sporadicPurchase.estimateUnitPriceTips', trigger: 'blur' }
          ]
        },
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
