import Utils from 'util';

const PageConfig = {
  formCode: 'materialSettlementDeclaration',
  processType: 'scenarioFlow',
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'supplierSettlementDeclaration/getWorkflowNextNode',
      parmasList: [
        { receive: 'sid', value: 'sid' },
        { receive: 'projectId', value: 'projectId' }
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'supplierSettlementDeclaration/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'supplierSettlementDeclaration/setDelete',
      params: 'settlementApproveId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'supplierSettlementDeclaration/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'supplierSettlementDeclaration/getInfo',
      params: 'settlementApproveId'
    },
    // save
    saveUrl: {
      url: 'supplierSettlementDeclaration/setEdit'
    },
    // 导出明细
    exportDetail: {
      url: 'supplierSettlementDeclaration/exportDetail',
      params: 'settlementApproveId'
    },
    // 下载模板
    dowanloadDetail: {
      url: 'supplierSettlementDeclaration/getDownloadTemplate',
      tableName: 'purchaseSettlementDetail'
    }
  },
  // 数据字典
  dictionary: [
    { dicCode: 'taxRate', propCode: 'settlementTaxRate' }
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
      // 合同名称
      {
        label: 'dialog.contractName', prop: 'contractName', span: 8, formType: 'input', inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 合同编号
      {
        label: 'dialog.contractCode', prop: 'contractCode', span: 8, formType: 'input', inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 项目名称
      {
        label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 累计已结算
      {
        label: 'dialog.settlementTotalAmount', prop: 'totalSettlementAmount', span: 8, formType: 'input', precision: 2, inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
      },
      // 累计已收票
      {
        label: 'dialog.totalInvoiceAmount', prop: 'totalInvoiceAmount', span: 8, formType: 'input', precision: 2, inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
      },
      // 累计已支付
      {
        label: 'dialog.paymentTotalAmount', prop: 'totalPaymentAmount', span: 8, formType: 'input', precision: 2, inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
      },
      // 供应商
      {
        label: 'purchaseSettlement.supplierName', prop: 'supplierName', span: 8, formType: 'input', inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 结算日期
      {
        label: 'purchaseSettlement.settlementDate', prop: 'settlementDate', span: 8, formType: 'date',
        isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 金额合计
      {
        label: 'purchaseSettlement.totalAmount', prop: 'totalAmount', span: 8, formType: 'elNumber', min: 0, precision: 2,
        maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 税额合计
      {
        label: 'purchaseSettlement.totalTaxAmount', prop: 'totalTaxAmount', span: 8, formType: 'elNumber', min: 0, precision: 2,
        maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 其他款项合计
      // {
      //   label: 'fConfig.totalOtherPaymentsAmount', prop: 'totalOtherPaymentsAmount', span: 8, formType: 'elNumber', precision: 2,
      //   maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
      //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      // },
      // 本期价税合计
      {
        label: 'fConfig.totalCurrentPeriod', prop: 'totalPriceTax', span: 8, formType: 'elNumber', min: 0, precision: 2,
        maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 价税合计:金额大写
      {
          label: 'fConfig.amountInWords', prop: 'totalPriceTax', span: 8, formType: 'input',
          inputStatus: 'disable', filterName: 'amountInWords',
          printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 发票编号
      {
        label: 'purchaseSettlement.settlementInvoiceRelations', prop: 'settlementInvoiceRelations', span: 16, formType: 'slot',
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, printValue: 'invoiceNo'
      },
      // 发票价税合计
      {
        label: 'fConfig.invoiceTotalPriceTax', prop: 'invoiceTotalAmount', span: 8, formType: 'elNumber', min: 0, precision: 2,
        maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
        printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0
      },
      // 入库单编号
      {
        label: 'purchaseSettlement.settlementIncomingRelations', prop: 'settlementIncomingRelations', span: 24, formType: 'slot',
        isRule: false,
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, printValue: 'incomingDocNo'
      },
      // 退货单编号
      {
        label: 'purchaseSettlement.settlementReturngoodsRelations', prop: 'settlementReturngoodsRelations', span: 24, formType: 'slot',
        isRule: false,
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, printValue: 'returngoodsDocNo'
      },
      // 主要结算内容
      {
        label: 'purchaseSettlement.settlementContent', prop: 'settlementContent', span: 24, formType: 'input',
        inputStatus: 'disable', placeholder: 'purchaseSettlement.settlementContentTips', // 自动获取明细前1-5行明细名称
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 合同附件
      { label: 'fConfig.contractAttachment', prop: 'contractAttachment', span: 24, formType: 'upload', inputStatus: 'disable' },
      // 附件
      { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' }
    ],
    oldRelationList: []
  },
  subTableMatch: [
    { value: 'settlementDetails', assignment: 'purchaseSettlementDetail' }
  ],
  // 子表
  subTableConfig: {
    // 明细清单
    purchaseSettlementDetail: {
      subTableName: 'purchaseSettlementDetail',
      titleTips: 'purchaseSettlementDetailTips',
      isSelection: true,
      isProjectNatureB: true,
      // 子表按钮
      subTableButton: [],
      ASubTableButton: [],
      BSubTableButton: [],
      // isProjectNatureAShow A项目显示B类项目不显示
      tableList: {
        // 表头配置
        slaveColumns: [
          // 入库单编号
          {
            label: 'purchaseSettlement.incomingDocNo', prop: 'incomingDocNo', formType: 'text', maxlength: 64, minWidth: 140,
            isProjectNatureAShow: true,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 材料编码
          {
            label: 'fConfig.materialCode', prop: 'materialCode', formType: 'text', maxlength: 64, minWidth: 120,
            isProjectNatureBShow: true,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 材料名称
          {
            label: 'fConfig.materialName', prop: 'materialName', formType: 'text', maxlength: 128, minWidth: 140,
            isProjectNatureBShow: true,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 规格
          {
            label: 'fConfig.standards', prop: 'standards', formType: 'text', maxlength: 64, minWidth: 100,
            isProjectNatureBShow: true,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 型号
          {
            label: 'fConfig.models', prop: 'models', formType: 'text', maxlength: 64, minWidth: 100,
            isProjectNatureBShow: true,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 品牌
          {
            label: 'fConfig.brand', prop: 'brand', formType: 'text', maxlength: 128, minWidth: 100,
            isProjectNatureBShow: true,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 计量单位
          {
            label: 'fConfig.unit', prop: 'unit', formType: 'text', maxlength: 32, minWidth: 80,
            isProjectNatureBShow: true,
            printWidth: 5, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  入库数量
          {
            label: 'purchaseSettlement.incomingQuantity', prop: 'incomingQuantity', formType: 'text', precision: 4,
            filterName: 'number', minWidth: 100,
            isProjectNatureAShow: true,
            printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0
          },
          //  入库单价(不含税)
          {
            label: 'purchaseSettlement.incomingUnitPrice', prop: 'incomingUnitPrice', formType: 'text', precision: 8,
            filterName: 'setMoney', minWidth: 140,
            isProjectNatureAShow: true,
            printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 入库税率(%)
          {
            label: 'purchaseSettlement.incomingTaxRate', prop: 'incomingTaxRate', minWidth: 120, formType: 'text', filterName: 'taxRate',
            operateData: true,
            isProjectNatureAShow: true,
            printWidth: 6, printFlag: false, defaultFlag: false, printStatus: 0
          },
          //  本次结算数量
          {
            label: 'purchaseSettlement.currentSettlementQuantity', prop: 'currentSettlementQuantity', formType: 'text',
            maxValue: 'incomingQuantity',
            operateData: true, precision: 4, min: 0, maxlength: 12, minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 结算税率(%)
          {
            label: 'purchaseSettlement.settlementTaxRate', prop: 'settlementTaxRate', minWidth: 100, formType: 'dicSelect', operateData: true,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  结算单价(含税)
          {
            label: 'fConfig.settlementIncludeUnitPrice', prop: 'settlementIncludeUnitPrice', formType: 'number', filterName: 'setMoney',
            operateData: true, precision: 4, min: 0, maxlength: 18, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  结算金额(含税)
          {
            label: 'purchaseSettlement.settlementIncludeTaxAmount', prop: 'settlementIncludeTaxAmount', formType: 'number',
            operateData: true, precision: 2, filterName: 'setMoney', minWidth: 140, maxlength: 12,
            printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 结算单价(不含税)
          {
            label: 'purchaseSettlement.settlementUnitPrice', prop: 'settlementUnitPrice', formType: 'number',
            operateData: true, precision: 8, min: 0, minWidth: 140, filterName: 'setMoney', maxlength: 17,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  结算金额(不含税)
          {
            label: 'purchaseSettlement.settlementExcludeTaxAmount', prop: 'settlementExcludeTaxAmount', formType: 'number',
            operateData: true, precision: 2, minWidth: 140, filterName: 'setMoney', maxlength: 12,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  结算税额
          {
            label: 'purchaseSettlement.settlementTaxAmount', prop: 'settlementTaxAmount', formType: 'number', filterName: 'setMoney',
            precision: 2, minWidth: 100,
            printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
          },
          //  其它款项
          // {
          //   label: 'tips.otherPaymentsAmount', prop: 'otherPaymentsAmount', formType: 'number', filterName: 'setMoney',
          //   precision: 2, minWidth: 100, operateData: true,
          //   printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
          // },
          // 备注
          {
            label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 所属工程量编号字段展示出来，不可编辑（项目为费用类型管控时是所属费用科目字段），且子表有拟使用部位时，将拟使用部位字段隐藏
          // 所属工程量名称（执行策划管控时显示）
          {
            label: 'fConfig.quantitiesName', prop: 'quantitiesName', formType: 'slot', minWidth: 120,
            isProjectNatureAShow: true,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 所属工程量编号（执行策划管控时显示）
          {
            label: 'fConfig.quantitiesCode', prop: 'quantitiesCode', formType: 'text', minWidth: 140, inputStatus: 'disable',
            isProjectNatureAShow: true,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 所属费用科目 (费用类型管控时显示)
          {
            label: 'fConfig.expenseName', prop: 'expenseName', formType: 'text', maxlength: 64, minWidth: 120, inputStatus: 'hide',
            isProjectNatureAShow: true,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 所属费用科目编号 (费用类型管控时显示)
          {
            label: 'fConfig.expenseCode', prop: 'expenseCode', formType: 'text', maxlength: 32, minWidth: 140, inputStatus: 'hide',
            isProjectNatureAShow: true,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 采购结算：子表增加拟供应来源、中标单价、成控单价、策划单价，带入，不可编辑；
          // 拟供应来源
          {
            label: 'fConfig.supplySourceValue', prop: 'supplySourceValue', formType: 'text', minWidth: 100,
            isProjectNatureAShow: true,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          }
          // // 中标单价
          // { label: 'fConfig.bidUnitPrice', prop: 'bidUnitPrice', formType: 'text',
          //   filterName: 'number', minWidth: 100,
          //   isProjectNatureAShow: true,
          //   printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          // },
          // // 成控单价
          // { label: 'fConfig.controlUnitPrice', prop: 'controlUnitPrice', formType: 'text',
          //   filterName: 'number', minWidth: 100,
          //   isProjectNatureAShow: true,
          //   printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          // },
          // // 策划单价
          // { label: 'fConfig.budgetUnitPrice', prop: 'budgetUnitPrice', formType: 'text',
          //   filterName: 'number', minWidth: 100,
          //   isProjectNatureAShow: true,
          //   printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          // }
        ],
        // 校验
        rules: {
          settlementIncludeUnitPrice: [{ required: true, trigger: 'blur' }]
        },
        ARules: {
          settlementIncludeUnitPrice: [{ required: true, trigger: 'blur' }]
        },
        BRules: {
          materialName: [{ required: true, trigger: 'blur' }],
          standards: [{ required: true, trigger: 'blur' }],
          unit: [{ required: true, trigger: 'blur' }],
          settlementIncludeUnitPrice: [{ required: true, trigger: 'blur' }]
        },
        // 初始化行数据
        tableDataRow: {
          createTime: Utils.commonUtil.formatTime(new Date()),
          alreadySettlementQuantity: '',
          bidQuantity: '',
          bidTotalAmount: '',
          bidUnitPrice: '',
          brand: '',
          budgetQuantity: '',
          budgetTotalAmount: '',
          budgetUnitPrice: '',
          controlQuantity: '',
          controlTotalAmount: '',
          controlUnitPrice: '',
          currentSettlementQuantity: '',
          eId: '',
          expendClassifyId: '',
          expendClassifyName: '',
          expenseCode: '',
          expenseName: '',
          incomingDocNo: '',
          incomingId: '',
          incomingQuantity: '',
          incomingTaxRate: '',
          incomingUnitPrice: '',
          majorCode: '',
          majorValue: '',
          materialClassifyCode: '',
          materialClassifyValue: '',
          materialCode: '',
          materialId: '',
          materialName: '',
          models: '',
          otherPaymentsAmount: '',
          quantitiesCode: '',
          quantitiesName: '',
          budgetCode: '',
          remarks: '',
          settlementExcludeTaxAmount: '',
          settlementApproveId: '',
          settlementIncludeTaxAmount: '',
          settlementIncludeUnitPrice: '',
          settlementTaxAmount: '',
          settlementTaxRate: '',
          settlementUnitPrice: '',
          sourceType: '',
          standards: '',
          supplySourceCode: '',
          supplySourceValue: '',
          unit: '',
          varietiesCode: '',
          varietiesId: ''
        }
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
