/*
 * @Author: your name
 * @Date: 2020-07-30 10:32:35
 * @LastEditTime: 2022-07-28 13:47:52
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\purchaseApply\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'promaterialPurchaseApply/getWorkflowNextNode',
      parmasList: [
        { receive: 'sid', value: 'taskSid' },
        { receive: 'projectId', value: 'projectId' }
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'promaterialPurchaseApply/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'promaterialPurchaseApply/setDelete',
      params: 'purchaseApplyId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'promaterialPurchaseApply/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'promaterialPurchaseApply/getInfo',
      params: 'purchaseApplyId'
    },
    // save
    saveUrl: {
      url: 'promaterialPurchaseApply/setEdit'
    },
    exportDetail: {
      url: 'promaterialPurchaseApply/exportDetail',
      params: 'purchaseApplyId'
    }
  },
  // 数据字典
  dictionary: [
    { dicCode: 'purchaseMethod', propCode: 'purchaseMethodCode' },
    { dicCode: 'purchaseStrategyCode', propCode: 'purchaseStrategyCode' }
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
        relationList: [{ receive: 'projectCode', value: 'projectCode' },
        { receive: 'partyAUnitName', value: 'partyAUnitName' },
        { receive: 'costControlRuleCode', value: 'costControlRuleCode' }],
        isRule: true,
        relationTable: ['purchasePurchaseApplyDetail'],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 项目编号
      // {
      //   label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
      //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      // },
      // 采购策略
      {
        label: 'promaterialPurchaseApply.purchaseStrategyCode', prop: 'purchaseStrategyCode', span: 8,
        formType: 'slot', selectList: [], isRule: true,
        isRelation: true, relationList: [{ receive: 'purchaseStrategyValue', value: 'dataName' }],
        relationTable: ['purchasePurchaseApplyDetail'],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'purchaseStrategyValue'
      },
      // 拟采购方式
      {
        label: 'promaterialPurchaseApply.purchaseMethodCode', prop: 'purchaseMethodCode', span: 8,
        formType: 'dicSelect', selectList: [], isRule: true,
        isRelation: true, relationList: [{ receive: 'purchaseMethodValue', value: 'dataName' }],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'purchaseMethodValue'
      },
      // 申请人
      {
        label: 'promaterialPurchaseApply.applyUserName', prop: 'applyUserName', span: 8, formType: 'userRadio', key: 'applyUserId', isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 申请日期
      {
        label: 'promaterialPurchaseApply.applyDate', prop: 'applyDate', span: 8, formType: 'date', isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 预计总金额
      {
        label: 'promaterialPurchaseApply.totalEstimateAmount', prop: 'totalEstimateAmount', span: 8, formType: 'elNumber', min: 0, precision: 2, maxlength: 12, inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
      },
      // 拟采购内容
      {
        label: 'promaterialPurchaseApply.purchaseContent', prop: 'purchaseContent', span: 24, formType: 'input',
        inputStatus: 'disable', placeholder: 'promaterialPurchaseApply.purchaseContentTips', // 自动获取明细前1-5行明细名称
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 方案简要说明
      {
        label: 'promaterialPurchaseApply.purchaseApplyReason', prop: 'purchaseApplyReason', span: 24,
        formType: 'textarea', minRows: 3, maxRows: 5, maxlength: 256, isRule: true, placeholder: 'promaterialPurchaseApply.purchaseApplyReasonTips',
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 附件
      { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' }
    ],
    oldRelationList: []
  },
  subTableMatch: [
    { value: 'purchaseApplyDetails', assignment: 'purchasePurchaseApplyDetail' }
  ],
  // 子表
  subTableConfig: {
    // 明细清单
    purchasePurchaseApplyDetail: {
      subTableName: 'purchasePurchaseApplyDetail',
      titleTips: 'purchasePurchaseApplyDetailTips',
      isSelection: true,
      // 子表按钮
      subTableButton: [
        { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'purchasePurchaseApplyDetail', disabled: false },
        // 导出明细
        { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'purchasePurchaseApplyDetail', name: 'button.export', authCode: 'export' },
        { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'purchasePurchaseApplyDetail', disabled: false }
      ],
      tableList: {
        // 表头配置
        slaveColumns: [
          // 需求计划单号
          {
            label: 'promaterialPurchaseApply.demandPlanCode', prop: 'demandPlanCode', formType: 'text', maxlength: 64, minWidth: 120,
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
            label: 'fConfig.models', prop: 'models', formType: 'input', maxlength: 32, minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 品牌
          {
            label: 'fConfig.brand', prop: 'brand', formType: 'input', minWidth: 100, maxlength: 32,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  已申请采购数量
          {
            label: 'promaterialPurchaseApply.alreadyApplyQuantity', prop: 'alreadyApplyQuantity', formType: 'text', filterName: 'number', minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  拟采购数量；–自动获取 选择数据 的报量的数量赋值，可以修改。
          {
            label: 'promaterialPurchaseApply.currentApplyQuantity', prop: 'currentApplyQuantity',
            formType: 'number', operateData: true, precision: 4, maxlength: 17, minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  拟采购限价
          {
            label: 'promaterialPurchaseApply.purchaseUnitPrice', prop: 'purchaseUnitPrice',
            formType: 'number', operateData: true, precision: 2, maxlength: 17, minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  金额
          {
            label: 'promaterialPurchaseApply.purchaseAmount', prop: 'purchaseAmount',
            formType: 'number', operateData: true, precision: 2, maxlength: 17, minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 采购备注
          {
            label: 'promaterialPurchaseApply.purchaseRemarks', prop: 'purchaseRemarks', formType: 'input', maxlength: 255,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 往期采购价
          { label: 'fConfig.frequency', prop: 'purchaseUnitPriceCounts', formType: 'slot', minWidth: 100,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 需求类型
          {
            label: 'promaterialPurchaseApply.demandPlanTypeValue', prop: 'demandPlanTypeValue', formType: 'text', maxlength: 32, minWidth: 80,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 现场报量
          {
            label: 'promaterialPurchaseApply.budgetQuantity', prop: 'demandPlanQuantity', formType: 'text', filterName: 'number', minWidth: 80,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  需用日期
          {
            label: 'promaterialPurchaseApply.requiredDate', prop: 'requiredDate', formType: 'text', filterName: 'date', minWidth: 100,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 拟使用部位
          {
            label: 'promaterialPurchaseApply.usePlaceName', prop: 'usePlaceName', formType: 'text', minWidth: 100,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 型号/质量/性能/品牌等要求备注
          {
            label: 'promaterialPurchaseApply.subTableRemarks', prop: 'remarks', formType: 'text', maxlength: 255, minWidth: 140,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 采购申请：子表增加策划数量、策划单价、策划合价、中标数量、中标单价、中标合价、成控数量、成控单价、成控合价、物资类别、专业、带入不可编辑。
          // 策划数量
          {
            label: 'fConfig.budgetQuantity', prop: 'budgetQuantity', formType: 'text',
            filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 策划单价
          {
            label: 'fConfig.budgetUnitPrice', prop: 'budgetUnitPrice', formType: 'text',
            filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 策划合价
          {
            label: 'fConfig.budgetTotalAmount', prop: 'budgetTotalAmount', formType: 'text',
            filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 中标数量
          {
            label: 'fConfig.bidQuantity', prop: 'bidQuantity', formType: 'text',
            filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 中标单价
          {
            label: 'fConfig.bidUnitPrice', prop: 'bidUnitPrice', formType: 'text',
            filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 中标合价
          {
            label: 'fConfig.bidTotalAmount', prop: 'bidTotalAmount', formType: 'text',
            filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 成控数量
          {
            label: 'fConfig.controlQuantity', prop: 'controlQuantity', formType: 'text',
            filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 成控单价
          {
            label: 'fConfig.controlUnitPrice', prop: 'controlUnitPrice', formType: 'text',
            filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 成控合价
          {
            label: 'fConfig.controlTotalAmount', prop: 'controlTotalAmount', formType: 'text',
            filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 物资类别
          {
            label: 'fConfig.materialClassifyValue', prop: 'materialClassifyValue', formType: 'text', minWidth: 100,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 专业
          {
            label: 'fConfig.majorValue', prop: 'majorValue', formType: 'text', minWidth: 100,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          }
        ],
        // 校验
        rules: {
          purchaseUnitPrice: [{ required: true, trigger: 'blur' }],
          purchaseAmount: [{ required: true, trigger: 'blur' }]
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
