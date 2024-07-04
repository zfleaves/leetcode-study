/*
 * @Author: your name
 * @Date: 2020-07-30 10:34:13
 * @LastEditTime: 2022-12-08 17:38:34
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\supplyOrder\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'purchaseSupplyOrder',
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'supplyOrder/getWorkflowNextNode',
      parmasList: [
        {receive: 'sid', value: 'taskSid'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'supplyOrder/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'supplyOrder/setDelete',
      params: 'supplyOrderId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'supplyOrder/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'supplyOrder/getInfo',
      params: 'supplyOrderId'
    },
    // save
    saveUrl: {
      url: 'supplyOrder/setEdit'
    },
    // 导出明细
    exportDetail: {
      url: 'supplyOrder/exportDetail',
      params: 'supplyOrderId'
    }
  },
    // 数据字典
    dictionary: [
      {dicCode: 'purchaseMethod', propCode: 'purchaseMethodCode'},
      {dicCode: 'orderType', propCode: 'orderTypeCode'},
      {dicCode: 'taxMethod', propCode: 'taxationCode'},
      {dicCode: 'invoiceType', propCode: 'invoiceCode'},
      {dicCode: 'currencyType', propCode: 'currencyCode'},
      {dicCode: 'taxRate', propCode: 'taxRate'}
    ],
    // 接口数据
    selectList: [],
    // 主表
    mainFormConfig: {
        formList: [
            // 单据编号
            { label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 填写人
            { label: 'fConfig.createByName', prop: 'createByName', span: 8, formType: 'input', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 填写日期
            { label: 'fConfig.createTime', prop: 'createTime', span: 8, formType: 'date', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目名称
            { label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'project', key: 'projectId',
              isRelation: true,
              relationList: [
                {receive: 'projectCode', value: 'projectCode'},
                {receive: 'address', value: 'address'},
                { receive: 'areas', value: 'areas' },
                { areaCode: true, receive: 'areas' },
                { receive: 'costControlRuleValue', value: 'costControlRuleValue' },
                { receive: 'costControlRuleCode', value: 'costControlRuleCode' }
              ],
              clearRelation: [{prop: 'expendContractName', clearFun: 'handleClearExpendContract'}],
              isRule: true, check: true,
              relationTable: ['purchaseSupplyOrderDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 订单类型
            // {
            //   label: 'supplyOrder.orderTypeCode', prop: 'orderTypeCode', span: 8,
            //   formType: 'dicSelect', selectList: [], isRule: true,
            //   isRelation: true, relationList: [{receive: 'orderTypeValue', value: 'dataName'}],
            //   otherOperate: true, otherOperateFun: 'handleRelationExpendContract',
            //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            // },
            // 关联合同
            { label: 'supplyOrder.expendContractName', prop: 'expendContractName', span: 8, formType: 'slot', key: 'expendContractId',
              isRule: true, isRelation: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 订单名称
            { label: 'supplyOrder.orderName', prop: 'orderName', span: 8, formType: 'input', maxlength: 64,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 下达人
            { label: 'supplyOrder.releaseUserName', prop: 'releaseUserName', span: 8, formType: 'userRadio', maxlength: 32, isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, key: 'releaseUserId'
            },
            // 下达日期
            { label: 'supplyOrder.releaseDate', prop: 'releaseDate', span: 8, formType: 'date', isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 供应商名称
            { label: 'supplyOrder.supplierName', prop: 'supplierName', span: 8, formType: 'partyB', key: 'supplierId', isRule: false,
              inputStatus: 'disable',
              // isRelation: true, inputStatus: 'edit',
              // relationList: [{receive: 'contactName', value: 'contactName'}, {receive: 'contactMobile', value: 'contactMobile'}],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 业务联系人
            { label: 'supplyOrder.contactName', prop: 'contactName', span: 8, formType: 'input', maxlength: 32, isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 业务联系人手机号码
            { label: 'supplyOrder.contactMobile', prop: 'contactMobile', span: 8, formType: 'input', maxlength: 32,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 计税方式
            {
              label: 'supplyOrder.taxationCode', prop: 'taxationCode', span: 8,
              formType: 'dicSelect', selectList: [], inputStatus: 'disable',
              isRelation: true, relationList: [{receive: 'taxationValue', value: 'dataName'}],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 发票类型
            {
              label: 'supplyOrder.invoiceCode', prop: 'invoiceCode', span: 8,
              formType: 'dicSelect', selectList: [], inputStatus: 'disable',
              isRelation: true, relationList: [{receive: 'invoiceValue', value: 'dataName'}],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 税率
            {
              label: 'supplyOrder.taxRate', prop: 'taxRate', span: 8,
              formType: 'dicSelect', selectList: [], inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 币种
            {
              label: 'supplyOrder.currencyCode', prop: 'currencyCode', span: 8,
              formType: 'dicSelect', selectList: [], inputStatus: 'disable',
              isRelation: true, relationList: [{receive: 'currencyValue', value: 'dataName'}],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 订单金额
            {
              label: 'supplyOrder.orderAmount', prop: 'orderAmount', span: 8, formType: 'elNumber', min: 0, precision: 2, maxlength: 12, inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
            },
            // 收货人
            { label: 'supplyOrder.receiveUserName', prop: 'receiveUserName', span: 8, formType: 'slot', key: 'receiveUserId', maxlength: 32,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 收货人电话
            { label: 'supplyOrder.receiveUserContactMobile', prop: 'receiveUserContactMobile', span: 8, formType: 'input', maxlength: 32,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 收货地址
            {
              label: 'supplyOrder.areas', prop: 'areas', span: 8, formType: 'area',
               printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 详细地址
            {
              label: 'supplyOrder.address', prop: 'address', span: 8, formType: 'input', maxlength: 256,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 约定到货日期
            { label: 'supplyOrder.arrivalDate', prop: 'arrivalDate', span: 8, formType: 'date', isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 价格依据
            { label: 'supplyOrder.inquiryDocNo', prop: 'inquiryDocNo', span: 8, formType: 'slot', key: 'inquiryId',
              isRelation: true,
              relationList: [
                {receive: 'inquiryTitle', value: 'inquiryTitle'},
                {receive: 'inquirySourceType', value: 'inquirySourceType'}
              ],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 主要供货明细
            { label: 'supplyOrder.mainSupplyDetail', prop: 'mainSupplyDetail', span: 16, formType: 'input', inputStatus: 'disable', placeholder: 'tips.mainDemandDetailTips' },
            // 付款条款
            { label: 'supplyOrder.paymentProvision', prop: 'paymentProvision', span: 24, formType: 'input', maxlength: 256,
              inputStatus: 'disable',
              printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 备注
            { label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256,
              printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload'}
        ],
        oldRelationList: []
    },
    subTableMatch: [
      {value: 'supplyOrderDetails', assignment: 'purchaseSupplyOrderDetail'}
    ],
    // 子表
    subTableConfig: {
      // 明细清单
      purchaseSupplyOrderDetail: {
          subTableName: 'purchaseSupplyOrderDetail',
          titleTips: 'purchaseSupplyOrderDetailTips',
          isSelection: true,
          // 子表按钮
          subTableButton: [
            { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'purchaseSupplyOrderDetail', disabled: false },
            // 导出明细
            { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'purchaseSupplyOrderDetail', name: 'button.export', authCode: 'export' },
            { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'purchaseSupplyOrderDetail', disabled: false },
            // 获取合同单价
            { isCustom: true, noAuth: true, code: 'handleGetContractPrice', name: 'button.getContractPrice', subTableCode: 'purchaseSupplyOrderDetail', disabled: false, slot: true }
          ],
          tableList: {
              // 表头配置
              slaveColumns: [
                  // 需求计划单号
                  { label: 'supplyOrder.demandPlanCode', prop: 'demandPlanCode', formType: 'text', maxlength: 64, minWidth: 140,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 材料编码
                  { label: 'fConfig.varietiesCode', prop: 'varietiesCode', formType: 'text', maxlength: 64, minWidth: 100,
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
                  { label: 'fConfig.models', prop: 'models', formType: 'input', minWidth: 100, maxlength: 64,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 品牌
                  { label: 'fConfig.brand', prop: 'brand', formType: 'input', minWidth: 100, maxlength: 64,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 需求类型
                  { label: 'supplyOrder.demandPlanTypeValue', prop: 'demandPlanTypeValue', formType: 'text', maxlength: 32, minWidth: 80,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  需求数量
                  { label: 'supplyOrder.demandPlanQuantity', prop: 'demandPlanQuantity', formType: 'text', filterName: 'number', minWidth: 80,
                    printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  //  需用日期
                  { label: 'supplyOrder.requiredDate', prop: 'requiredDate', formType: 'text', filterName: 'date', minWidth: 100,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // // 拟使用部位
                  // { label: 'supplyOrder.usePlaceName', prop: 'usePlaceName', formType: 'text', minWidth: 120,
                  //   printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  // },
                  // 合同签订单价
                  { label: 'fConfig.contractUnitPrice', prop: 'contractUnitPrice', formType: 'text', filterName: 'number', minWidth: 120,
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  //  已申请供货数量
                  { label: 'supplyOrder.alreadyApplyQuantity', prop: 'alreadyApplyQuantity', formType: 'text', filterName: 'number', minWidth: 120,
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  //  本次申请数量
                  { label: 'supplyOrder.currentApplyQuantity', prop: 'currentApplyQuantity', formType: 'number', operateData: true, precision: 4, maxlength: 12, minWidth: 120,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  单价
                  { label: 'supplyOrder.unitPrice', prop: 'unitPrice', formType: 'slot', operateData: true, precision: 4, maxlength: 17, minWidth: 120,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
                  },
                  //  金额
                  { label: 'supplyOrder.amount', prop: 'amount', formType: 'number', operateData: true, precision: 2, maxlength: 12, minWidth: 100,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
                  },
                  // 供货备注
                  { label: 'supplyOrder.supplyRemarks', prop: 'supplyRemarks', formType: 'input', maxlength: 255,
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  // 往期采购价
                  { label: 'fConfig.frequency', prop: 'purchaseUnitPriceCounts', formType: 'slot', minWidth: 100,
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
                  // 申请班组 => 申报料单位
                  {
                    label: 'fConfig.applicant', prop: 'projectUnitName', formType: 'text',
                    printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  // 供货订单：子表增加中标单价、成控单价、策划单价，带入，不可编辑
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
                  },
                  // 要求备注
                  { label: 'supplyOrder.subTableRemarks', prop: 'remarks', formType: 'text', maxlength: 255,
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  }
              ],
              // 校验
              rules: {
                unitPrice: [
                  { required: true, message: 'supplyOrder.unitPriceTips', trigger: 'blur' }
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
  init () {
    Utils.commonUtil.getSelectList(this.PageConfig.selectList, this);
    Utils.commonUtil.getDicAllDataList(this.PageConfig.dictionary, this);
  }
}
export default Page;
