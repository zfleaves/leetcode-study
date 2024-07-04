/*
 * @Author: your name
 * @Date: 2020-07-30 10:38:54
 * @LastEditTime: 2023-05-05 11:32:21
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\sporadicReimburse\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'sporadicReimburse/getWorkflowNextNode',
      parmasList: [
        { receive: 'sid', value: 'taskSid' },
        { receive: 'projectId', value: 'projectId' }
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'sporadicReimburse/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'sporadicReimburse/setDelete',
      params: 'sporadicReimburseId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'sporadicReimburse/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'sporadicReimburse/getInfo',
      params: 'sporadicReimburseId'
    },
    // save
    saveUrl: {
      url: 'sporadicReimburse/setEdit'
    },
    // 导出明细
    exportDetail: {
      url: 'sporadicReimburse/exportDetail',
      params: 'sporadicReimburseId'
    }
  },
  // 数据字典
  dictionary: [
    { dicCode: 'currencyType', propCode: 'currencyCode' },
    { dicCode: 'taxRate', propCode: 'taxRate' },
    { dicCode: 'payMethodType', propCode: 'paymentMethodCode' }
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
      // 1、项目名称
      {
        label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'project', key: 'projectId',
        isRelation: true,
        relationList: [
          { receive: 'projectCode', value: 'projectCode' },
          { receive: 'reimbursePurchases', value: 'reimbursePurchases' },
          { receive: 'purchaseApplyId', value: 'purchaseApplyId' },
          { receive: 'purchaseApplyCode', value: 'purchaseCode' },
          { receive: 'costControlRuleValue', value: 'costControlRuleValue' },
          { receive: 'costControlRuleCode', value: 'costControlRuleCode' }
        ],
        isRule: true, check: true,
        isRelationTable: true,
        relationTable: ['purchaseSporadicReimburseDetail'],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 2、零星采购单
      {
        label: 'sporadicReimburse.purchaseApplyName', prop: 'reimbursePurchases', span: 16, formType: 'slot', key: 'purchaseApplyId',
        isRule: true,
        isRelation: true,
        relationList: [
          { receive: 'purchaseApplyCode', value: 'purchaseCode' },
          { receive: 'collectionUserName', value: 'supplierName' },
          { receive: 'collectionUserId', value: 'supplierId' }
        ],
        isRelationTable: true,
        relationTable: ['purchaseSporadicReimburseDetail'], printValue: 'purchaseApplyCode',
        printWidth: 16, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 3、报销内容
      {
        label: 'sporadicReimburse.reimburseContent', prop: 'reimburseContent', formType: 'textarea', minRows: 2, maxRows: 5, maxlength: 256,
        isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 4、报销人
      {
        label: 'sporadicReimburse.reimburseUserName', prop: 'reimburseUserName', span: 8, formType: 'userRadio', key: 'reimburseUserId', isRule: true,
        isRelation: true, relationList: [
            { receive: 'payeeCardNo', value: 'cardNumber' },
            { receive: 'payeeOpenBank', value: 'openAccountBank' }],
        isAccountInfo: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 5、报销日期
      {
        label: 'sporadicReimburse.reimburseDate', prop: 'reimburseDate', span: 8, formType: 'date', isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 6、报销金额
      {
        label: 'sporadicReimburse.reimburseAmount', prop: 'reimburseAmount', span: 8, formType: 'elNumber', min: 0, precision: 2, maxlength: 12, inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
      },
      // 7、实际支付金额
      {
        label: 'fConfig.actualPaymentAmount', prop: 'actualPaymentAmount', span: 8, formType: 'elNumber',
        precision: 2, inputStatus: 'disable', processStatus: true, placeholder: 'tips.financialFilling',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
      },
      // 8、发票代码
      {
        label: 'fConfig.invoiceCode', prop: 'invoiceCode', span: 8, formType: 'input', maxlength: 64,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 9、发票编号
      {
        label: 'fConfig.invoiceNo', prop: 'invoiceNo', span: 8, formType: 'input', maxlength: 64,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 10、是否抵扣备用金
      {
        label: 'sporadicReimburse.deductionReserveFund', prop: 'deductionReserveFund', span: 8,
        formType: 'slot', selectList: [
          {dataCode: 1, dataName: 'tips.yes'},
          {dataCode: 0, dataName: 'tips.no'}
        ],
        isRule: true, isTranslate: true, filterName: 'whether',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 11、收款人
      {
        label: 'sporadicReimburse.collectionUserName', prop: 'collectionUserName', span: 8, formType: 'slot', isRule: true, maxlength: 32,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 12、收款人卡号
      {
        label: 'fConfig.collectCardNumber', prop: 'payeeCardNo', span: 8, formType: 'slot', maxlength: 32,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 13、收款人开户行
      {
        label: 'fConfig.collectOpenAccountBank', prop: 'payeeOpenBank', span: 8, formType: 'slot', maxlength: 64,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 支付日期
      // {
      //   label: 'fConfig.paymentTime', prop: 'paymentDate', span: 8, formType: 'date',
      //   inputStatus: 'disable', processStatus: true, placeholder: 'tips.financialFilling',
      //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      // },
      // 币种
      {
        label: 'sporadicReimburse.currencyCode', prop: 'currencyCode', span: 8,
        formType: 'dicSelect', selectList: [], isRule: true,
        isRelation: true, relationList: [{ receive: 'currencyValue', value: 'dataName' }],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },

      // 是否取得发票
      {
        label: 'fConfig.ifAcquireInvoice', prop: 'ifAcquireInvoice', span: 8,
        formType: 'dicSelect', selectList: [
          {dataName: 'tips.yes', dataCode: 1},
          {dataName: 'tips.no', dataCode: 0}
        ], isRule: true, isTranslate: true, filterName: 'whether',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 备注
      {
        label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'input', maxlength: 256,
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 收据或发票附件
      { label: 'sporadicReimburse.attachment', prop: 'attachment', span: 24, formType: 'upload',
        isImportantTips: true, placeholder: 'tips.acquireInvoiceAttachmentTips'
      }
    ],
    oldRelationList: []
  },
  subTableMatch: [
    { value: 'sporadicReimburseDetails', assignment: 'purchaseSporadicReimburseDetail' },
    { value: 'payments', assignment: 'purchaseSporadicReimbursePayments' }
  ],
  // 子表
  subTableConfig: {
    // 明细清单
    purchaseSporadicReimburseDetail: {
      subTableName: 'purchaseSporadicReimburseDetail',
      titleTips: 'purchaseSporadicReimburseDetailTips',
      isSelection: true,
      // 子表按钮
      subTableButton: [
        { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'purchaseSporadicReimburseDetail', disabled: false },
        // { noAuth: true, code: 'sysHandleDeletaAdd', subTableCode: 'purchaseSporadicReimburseDetail', disabled: false },
        // 导出明细
        { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'purchaseSporadicReimburseDetail', name: 'button.export', authCode: 'export' },
        { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'purchaseSporadicReimburseDetail', disabled: false }
      ],
      tableList: {
        // 表头配置
        slaveColumns: [
          // 零星采购单编号
          {
            label: 'sporadicReimburse.purchaseApplyCode', prop: 'purchaseApplyCode', formType: 'text', minWidth: 140,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 名称
          {
            label: 'sporadicReimburse.materialName', prop: 'materialName', formType: 'input', maxlength: 64, minWidth: 160,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 规格
          {
            label: 'sporadicReimburse.standards', prop: 'standards', formType: 'input', minWidth: 120, maxlength: 64,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 型号
          {
            label: 'sporadicReimburse.models', prop: 'models', formType: 'input', minWidth: 100, maxlength: 64,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 品牌
          {
            label: 'fConfig.brand', prop: 'brand', formType: 'input', minWidth: 100, maxlength: 64,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 单位
          {
            label: 'sporadicReimburse.unit', prop: 'unit', formType: 'input', minWidth: 80, maxlength: 32,
            printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 零星采购数量
          {
            label: 'sporadicReimburse.sporadicPurchaseQuantity', prop: 'sporadicPurchaseQuantity', formType: 'text', minWidth: 100,
            printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 已报销数量
          {
            label: 'sporadicReimburse.alreadyReimburseQuantity', prop: 'alreadyReimburseQuantity', formType: 'text', minWidth: 100,
            printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  数量
          {
            label: 'sporadicReimburse.quantity', prop: 'quantity', formType: 'number', operateData: true, precision: 4, min: 0, maxlength: 12, minWidth: 100,
            printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 税率(%)
          {
            label: 'fConfig.taxRate', prop: 'taxRate', formType: 'dicSelect', operateData: true,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, minWidth: 100, filterName: 'taxRate', selectList: []
          },
          //  单价(含税)
          {
            label: 'fConfig.includeUnitPrice', prop: 'includeUnitPrice', formType: 'number', operateData: true, precision: 4, min: 0, maxlength: 17, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  金额(含税)
          {
            label: 'fConfig.includeTaxAmount', prop: 'includeTaxAmount', formType: 'number', operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  单价(不含税)
          {
            label: 'fConfig.unitPrice', prop: 'unitPrice', formType: 'number', operateData: true, precision: 8, min: 0, maxlength: 18, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  金额(不含税)
          {
            label: 'fConfig.excludeTaxAmount', prop: 'amount', formType: 'number', operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  税额
          {
            label: 'fConfig.taxAmount', prop: 'taxAmount', formType: 'number', filterName: 'setMoney',
            precision: 2,
            printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 备注
          {
            label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 所属工程量编号字段展示出来，不可编辑（项目为费用类型管控时是所属费用科目字段），且子表有拟使用部位时，将拟使用部位字段隐藏
          // 所属工程量名称（执行策划管控时显示）
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
          // 零星采购报销：子表增加中标单价、成控单价、策划单价，带入，不可编辑；
          // 中标单价
          { label: 'fConfig.bidUnitPrice', prop: 'bidUnitPrice', formType: 'text',
            filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 成控单价
          { label: 'fConfig.controlUnitPrice', prop: 'controlUnitPrice', formType: 'text',
            filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 策划单价
          { label: 'fConfig.budgetUnitPrice', prop: 'budgetUnitPrice', formType: 'text',
            filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          }
        ],
        // 校验
        rules: {
          materialName: [
            { required: true, message: 'sporadicReimburse.materialNameTips', trigger: 'blur' }
          ],
          quantity: [
            { required: true, message: 'sporadicReimburse.quantityTips', trigger: 'blur' }
          ],
          unitPrice: [
            { required: true, message: 'sporadicReimburse.unitPriceTips', trigger: 'blur' }
          ]
        },
        // 初始化行数据
        tableDataRow: {
          createTime: Utils.commonUtil.formatTime(new Date()),
          amount: 0,
          materialName: '',
          models: '',
          quantity: 0,
          remarks: '',
          standards: '',
          unit: '',
          eId: null,
          unitPrice: 0,
          taxRate: '',
          taxAmount: 0
        }
      }, // 子表配置
      tableData: [] // 子表数据
    },
    // 明细清单
    purchaseSporadicReimbursePayments: {
      subTableName: 'purchaseSporadicReimbursePayments',
      titleTips: 'purchaseSporadicReimbursePaymentsTips',
      isSelection: true,
      // 子表按钮
      subTableButton: [
        { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'purchaseSporadicReimbursePayments', disabled: false },
        { noAuth: true, code: 'sysHandleDeletaAdd', subTableCode: 'purchaseSporadicReimbursePayments', disabled: false }
      ],
      tableList: {
        // 表头配置
        slaveColumns: [
          // 支付方式
          {
            label: 'fConfig.paymentMethodCode', prop: 'paymentMethodCode', formType: 'dicSelect', selectList: [],
            isRelation: true, relationList: [{ receive: 'paymentMethodValue', value: 'dataName' }],
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0, printValue: 'paymentMethodValue'
          },
          // 支付金额
          {
            label: 'fConfig.paymentAmount', prop: 'paymentAmount', formType: 'number', precision: 2, min: 0, maxlength: 12, operateData: true,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 付款日期
          {
            label: 'fConfig.paymentDate', prop: 'paymentDate', formType: 'date',
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 付款账户
          {
            label: 'fConfig.paymentAccount', prop: 'paymentAccount', formType: 'companyAccount',
            relationList: [
              { receive: 'paymentAccount', value: 'fullAccountName' }
            ], key: 'paymentCardNo',
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  付款卡号
          {
            label: 'fConfig.paymentCardNo', prop: 'paymentCardNo', formType: 'input', minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0, inputStatus: 'disable'
          },
          //  经办人(出纳)
          {
            label: 'fConfig.agentUserName', prop: 'agentUserName', formType: 'input', maxlength: 32, minWidth: 120,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  回执单或其他附件
          {
            label: 'fConfig.detailAttachment', prop: 'detailAttachment', formType: 'attachment', inputStatus: 'edit', limit: 5,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 备注
          {
            label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          }
        ],
        // 校验
        rules: {
          paymentMethodCode: [
            { required: true, trigger: 'blur' }
          ],
          paymentAmount: [
            { required: true, trigger: 'blur' }
          ],
          paymentDate: [
            { required: true, trigger: 'blur' }
          ],
          paymentAccount: [
            { required: true, trigger: 'blur' }
          ],
          agentUserName: [
            { required: true, trigger: 'blur' }
          ]
        },
        // 初始化行数据
        tableDataRow: {
          createTime: Utils.commonUtil.formatTime(new Date()),
          agentUserName: '',
          detailAttachment: '',
          paymentAccount: '',
          paymentAmount: '',
          paymentCardNo: '',
          paymentDate: '',
          paymentMethodCode: '',
          paymentMethodValue: '',
          remarks: ''
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
