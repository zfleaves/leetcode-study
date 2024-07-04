/*
 * @Author: your name
 * @Date: 2020-07-30 10:43:40
 * @LastEditTime: 2022-11-09 18:03:59
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\paymentApply\configEdit.js
 */
import Utils from 'util';
import store from 'store';

const PageConfig = {
  formCode: 'purchasePaymentApply',
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'paymentApply/getWorkflowNextNode',
      parmasList: [
        { receive: 'sid', value: 'taskSid' },
        { receive: 'projectId', value: 'projectId' },
        { receive: 'whether', value: 'isIssueInvoice' }
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'paymentApply/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'paymentApply/setDelete',
      params: 'paymentId'
    },
    // info
    infoUrl: {
      url: 'paymentApply/getInfo',
      params: 'paymentId'
    },
    // save
    saveUrl: {
      url: 'paymentApply/setEdit'
    },
    // 导出明细
    exportDetail: {
      url: 'paymentApply/exportDetail',
      params: 'paymentId'
    }
  },
  // 数据字典
  dictionary: [
    { dicCode: 'invoiceType', propCode: 'invoiceCode' },
    { dicCode: 'taxRate', propCode: 'taxRate' },
    { dicCode: 'payType', propCode: 'paymentCode' },
    { dicCode: 'payMethodType', propCode: 'paymentMethodCode' },
    { dicCode: 'whether', propCode: 'isIssueInvoice' }
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
          { receive: 'partyBUnitName', value: 'partyBUnitName' },
          { receive: 'partyBUnitId', value: 'partyBUnitId' },
          { receive: 'taxationCode', value: 'taxationCode' },
          { receive: 'taxationValue', value: 'taxationValue' },
          { receive: 'invoiceCode', value: 'invoiceCode' },
          { receive: 'invoiceValue', value: 'invoiceValue' },
          { receive: 'taxRate', value: 'taxRate' },
          { receive: 'paymentClause', value: 'paymentProvision' },
          { receive: 'collectionUnitName', value: 'partyBUnitName' },
          { receive: 'bankAccountNo', value: 'accountName' },
          { receive: 'depositBankName', value: 'accountBankName' },
          { receive: 'contractAmount', value: 'signAmount' },
          { receive: 'totalSettlementAmount', value: 'totalSettlementAmount' },
          { receive: 'totalInvoiceAmount', value: 'totalInvoiceAmount' },
          { receive: 'totalPaymentAmount', value: 'totalPaymentAmount' },
          { receive: 'contractName', value: 'contractName' },
          { receive: 'contractId', value: 'contractId' },
          { receive: 'contractCode', value: 'purchaseCode' },
          { receive: 'costControlRuleValue', value: 'costControlRuleValue' },
          { receive: 'costControlRuleCode', value: 'costControlRuleCode' }
        ],
        isRule: true,
        relationTable: ['purchasePaymentApplyDetail'],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 合同名称
      {
        label: 'paymentApply.contractName', prop: 'contractName', span: 8, formType: 'slot', key: 'contractId',
        isRelation: true,
        relationList: [
          { receive: 'partyBUnitName', value: 'partyBUnitName' },
          { receive: 'partyBUnitId', value: 'partyBUnitId' },
          { receive: 'taxationCode', value: 'taxationCode' },
          { receive: 'taxationValue', value: 'taxationValue' },
          { receive: 'invoiceCode', value: 'invoiceCode' },
          { receive: 'invoiceValue', value: 'invoiceValue' },
          { receive: 'taxRate', value: 'taxRate' },
          { receive: 'paymentClause', value: 'paymentProvision' },
          { receive: 'collectionUnitName', value: 'accountUnitName' },
          { receive: 'bankAccountNo', value: 'accountName' },
          { receive: 'depositBankName', value: 'accountBankName' },
          { receive: 'contractAmount', value: 'signAmount' },
          { receive: 'totalSettlementAmount', value: 'totalSettlementAmount' },
          { receive: 'totalInvoiceAmount', value: 'totalInvoiceAmount' },
          { receive: 'totalPaymentAmount', value: 'totalPaymentAmount' },
          { receive: 'currencyValue', value: 'currencyValue' },
          { receive: 'currencyCode', value: 'currencyCode' },
          { receive: 'contractCode', value: 'contractCode' },
          { receive: 'contractAttachment', value: 'attachment' },
          { receive: 'belongOrgId', value: 'belongOrgId' },
          { receive: 'belongOrgName', value: 'belongOrgName' },
          { receive: 'bankLineNum', value: 'bankLineNum' },
          { receive: 'bankAccountNo', value: 'accountName' },
          { receive: 'depositBankName', value: 'accountBankName' }
        ],
        isRule: true,
        relationTable: ['purchasePaymentApplyDetail'],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 乙方单位
      {
        label: 'paymentApply.partyBUnitName', prop: 'partyBUnitName', span: 8, formType: 'input', inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 合同金额
      {
        label: 'paymentApply.contractAmount', prop: 'contractAmount', span: 8, formType: 'elNumber', precision: 2, maxlength: 12, inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
      },
      // 发票类型
      {
        label: 'paymentApply.invoiceCode', prop: 'invoiceCode', span: 8,
        formType: 'dicSelect', selectList: [],
        isRelation: true, relationList: [{ receive: 'invoiceValue', value: 'dataName' }],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'invoiceValue'
      },
      // 税率(%)
      {
        label: 'paymentApply.taxRate', prop: 'taxRate', span: 8, formType: 'dicSelect', selectList: [],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 累计已结算
      {
        label: 'paymentApply.totalSettlementAmount', prop: 'totalSettlementAmount', span: 8, formType: 'settlementAmount', precision: 2,
        inputStatus: 'disable', setUrl: 'purchaseSettlement/getPageList', contractKey: 'contractId', jumpToUrl: 'purchaseSettlement', ownPage: false,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
      },
      // 累计已收票
      {
        label: 'paymentApply.totalInvoiceAmount', prop: 'totalInvoiceAmount', span: 8, formType: 'InvoiceAmount', precision: 2, inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney', jumpToUrl: 'contractExpendInvoice', ownPage: false,
        setUrl: 'purchaseSettlement/getInvoicePage', contractKey: 'contractId'
      },
      // 累计已支付
      {
        label: 'paymentApply.totalPaymentAmount', prop: 'totalPaymentAmount', span: 8, formType: 'paymentAmount', precision: 2, inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney', jumpToUrl: 'paymentApply', ownPage: true,
        setUrl: 'paymentApply/getPageList', contractKey: 'contractId'
      },
      // 币种
      {
        label: 'paymentApply.currencyValue', prop: 'currencyValue', span: 8, formType: 'input', inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 付款条款
      {
        label: 'paymentApply.paymentClause', prop: 'paymentClause', span: 16, formType: 'input', inputStatus: 'disable',
        printWidth: 16, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 甲方(所属公司)
      { label: 'fConfig.belongOrgName', prop: 'belongOrgName', span: 8, formType: 'input', inputStatus: 'disable' },
      // 合同附件
      { label: 'fConfig.contractAttachment', prop: 'contractAttachment', span: 24, formType: 'upload', inputStatus: 'disable' },
      // 申请付款信息
      {
        label: 'paymentApply.appPaymentInfo', prop: 'appPaymentInfo', span: 24, formType: 'divisionTitle',
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 本次付款类型
      {
        label: 'paymentApply.paymentValue', prop: 'paymentCode', span: 8,
        formType: 'dicSelect', selectList: [], isRule: true,
        isRelation: true, relationList: [{ receive: 'paymentValue', value: 'dataName' }],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'paymentValue'
      },
      // 本次申请支付
      {
        label: 'paymentApply.applyPaymentAmount', prop: 'applyPaymentAmount', span: 8, formType: 'elNumber',
        precision: 2, isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
      },
      // 实际付款金额
      {
        label: 'paymentApply.actualPaymentAmount', prop: 'actualPaymentAmount', span: 8, formType: 'elNumber',
        precision: 2, inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
      },
      // 金额大写
      {
          label: 'fConfig.amountInWords', prop: 'actualPaymentAmount', span: 8, formType: 'input',
          inputStatus: 'disable', filterName: 'amountInWords',
          printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 收款单位
      {
        label: 'paymentApply.collectionUnitName', prop: 'collectionUnitName', span: 8, formType: 'input', maxlength: 64, isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 开户账号
      {
        label: 'paymentApply.bankAccountNo', prop: 'bankAccountNo', span: 8, formType: 'input', maxlength: 32,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 开户行及支行
      {
        label: 'paymentApply.depositBankName', prop: 'depositBankName', span: 8, formType: 'input', maxlength: 64,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 银行联行号
      {
        label: 'fConfig.bankLineNum', prop: 'bankLineNum', span: 8, formType: 'input', maxlength: 32,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 是否开具发票
      {
        label: 'paymentApply.isIssueInvoice', prop: 'isIssueInvoice', span: 8,
        formType: 'dicSelect', selectList: [], isNumber: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'whether'
      },
      // 申请人
      {
        label: 'paymentApply.applyUserName', prop: 'applyUserName', span: 8, formType: 'userRadio', key: 'applyUserId', isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 申请日期
      {
        label: 'paymentApply.applyDate', prop: 'applyDate', span: 8, formType: 'date', isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 申请付款备注
      {
        label: 'paymentApply.fromRemarks', prop: 'remarks', span: 24, formType: 'input', maxlength: 256,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 申付依据(附件)
      { label: 'paymentApply.attachment', prop: 'attachment', span: 24, formType: 'upload' }
    ],
    oldRelationList: []
  },
  subTableMatch: [
    { value: 'paymentApplyDetails', assignment: 'purchasePaymentApplyDetail' }
  ],
  // 子表
  subTableConfig: {
    // 明细清单
    purchasePaymentApplyDetail: {
      subTableName: 'purchasePaymentApplyDetail',
      isSelection: true,
      // 子表按钮
      subTableButton: [
        { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'purchasePaymentApplyDetail', disabled: false },
        // 导出明细
        { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'purchasePaymentApplyDetail', name: 'button.export', authCode: 'export' },
        { noAuth: true, code: 'sysHandleDeletaAdd', subTableCode: 'purchasePaymentApplyDetail', disabled: false }
      ],
      tableList: {
        // 表头配置
        slaveColumns: [
          // 支付方式
          {
            label: 'paymentApply.paymentMethodCode', prop: 'paymentMethodCode', formType: 'dicSelect', selectList: [],
            isRelation: true, relationList: [{ receive: 'paymentMethodValue', value: 'dataName' }],
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'paymentMethodValue'
          },
          // 支付金额
          {
            label: 'paymentApply.paymentAmount', prop: 'paymentAmount', formType: 'number', precision: 2, maxlength: 12,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney',
            operateData: true
          },
          // 付款日期
          {
            label: 'paymentApply.paymentDate', prop: 'paymentDate', formType: 'date',
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 付款账户
          {
            label: 'paymentApply.paymentAccount', prop: 'paymentAccount', formType: 'companyAccount',
            relationList: [
              { receive: 'paymentAccount', value: 'fullAccountName' }
            ], key: 'paymentCardNo',
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  付款卡号
          {
            label: 'paymentApply.paymentCardNo', prop: 'paymentCardNo', formType: 'input', minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0, inputStatus: 'disable'
          },
          //  经办人(出纳)
          {
            label: 'paymentApply.agentUserName', prop: 'agentUserName', formType: 'input', maxlength: 32, minWidth: 120,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  回执单或其他附件
          {
            label: 'paymentApply.detailAttachment', prop: 'detailAttachment', formType: 'attachment', inputStatus: 'edit', limit: 5,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 备注
          {
            label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 更新时间
          {
            label: 'fConfig.updateTime', prop: 'updateTime', formType: 'date', inputStatus: 'disable', minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          }
        ],
        // 校验
        rules: {
          paymentMethodCode: [
            { required: true, message: 'paymentApply.paymentMethodCodeTips', trigger: 'blur' }
          ],
          paymentAmount: [
            { required: true, message: 'paymentApply.paymentAmountTips', trigger: 'blur' }
          ],
          paymentDate: [
            { required: true, message: 'paymentApply.paymentDateTips', trigger: 'blur' }
          ],
          paymentAccount: [
            { required: true, message: 'paymentApply.paymentAccountTips', trigger: 'blur' }
          ],
          agentUserName: [
            { required: true, message: 'paymentApply.agentUserNameTips', trigger: 'blur' }
          ]
        },
        // 初始化行数据
        tableDataRow: {
          createTime: Utils.commonUtil.formatTime(new Date()),
          agentUserName: Utils.Auth.hasUserInfo().userName,
          detailAttachment: '',
          paymentAccount: '',
          paymentAmount: 0,
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
