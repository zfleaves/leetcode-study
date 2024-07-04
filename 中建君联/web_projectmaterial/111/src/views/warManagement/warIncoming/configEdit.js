/*
 * @Author: your name
 * @Date: 2020-07-30 10:35:19
 * @LastEditTime: 2023-02-20 15:45:05
 * @LastEditTime: 2021-07-13 17:05:22
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\warIncoming\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'warehouseIncoming',
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'warIncoming/getWorkflowNextNode',
      parmasList: [
        { receive: 'sid', value: 'taskSid' },
        { receive: 'projectId', value: 'projectId' }
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'warIncoming/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'warIncoming/setDelete',
      params: 'incomingId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'warIncoming/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'warIncoming/getInfo',
      params: 'incomingId'
    },
    // save
    saveUrl: {
      url: 'warIncoming/setEdit'
    },
    // 导出明细
    exportDetail: {
      url: 'warIncoming/exportDetail',
      params: 'incomingId'
    }
  },
  // 数据字典
  dictionary: [
    { dicCode: 'invoiceType', propCode: 'invoiceTypeCode' },
    { dicCode: 'incomingType', propCode: 'incomingTypeCode' },
    { dicCode: 'currencyType', propCode: 'currencyCode' },
    { dicCode: 'taxRate', propCode: 'taxRate' }
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
        check: true, isRelation: true,
        relationList: [{ receive: 'projectCode', value: 'projectCode' },
        { receive: 'warehouseId', value: 'warehouseId' },
        { receive: 'warehouseName', value: 'warehouseName' },
        { receive: 'rushBackIncomingDocNo', value: 'rushBackIncomingDocNo' },
        { receive: 'rushBackIncomingId', value: 'rushBackIncomingId' },
        { receive: 'costControlRuleValue', value: 'costControlRuleValue' },
        { receive: 'costControlRuleCode', value: 'costControlRuleCode' }],
        isRule: true,
        relationTable: ['warehouseIncomingDetail'],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // // 项目编号
      // {
      //   label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
      //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      // },
      // 入库类型
      {
        label: 'warIncoming.incomingTypeCode', prop: 'incomingTypeCode', span: 8,
        formType: 'dicSelect', selectList: [], isRule: true,
        isRelation: true, relationList: [{ receive: 'incomingTypeValue', value: 'dataName' }],
        relationTable: ['warehouseIncomingDetail'],
        otherOperate: true, otherOperateFun: 'changeIncomingType',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'incomingTypeValue'
      },
      // 被冲回单据号
      {
        label: 'warIncoming.rushBackIncomingDocNo', prop: 'rushBackIncomingDocNo', span: 8, formType: 'slot', key: 'rushBackIncomingId', isRule: true,
        isRelation: true,
        relationList: [
          { receive: 'supplierName', value: 'supplierName' },
          { receive: 'supplierId', value: 'supplierId' },
          { receive: 'warehouseId', value: 'warehouseId' },
          { receive: 'warehouseName', value: 'warehouseName' },
          { receive: 'sourceType', value: 'sourceType' },
          { receive: 'expendContractCode', value: 'expendContractCode' },
          { receive: 'expendContractName', value: 'expendContractName' },
          { receive: 'expendContractId', value: 'expendContractId' }
        ],
        relationTable: ['warehouseIncomingDetail'],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, inputStatus: 'hide'
      },
      // 合同/零星采购单
      {
        label: 'dialog.contractSporadicPurchaseName', prop: 'expendContractName', span: 8, formType: 'slot', isRule: true,
        key: 'expendContractId', relationKey: { receive: 'projectId', value: 'projectName' },
        isRelation: true,
        relationList: [
          // { receive: 'expendContractCode', value: 'expendContractCode' },
          { receive: 'supplierName', value: 'partyBUnitName' },
          { receive: 'supplierId', value: 'partyBUnitId' },
          // { receive: 'currencyValue', value: 'currencyValue' },
          // { receive: 'currencyCode', value: 'currencyCode' },
          { receive: 'sourceType', value: 'sourceType' },
          { receive: 'expendContractCode', value: 'purchaseCode' },
          { receive: 'taxRate', value: 'taxRate' }
        ],
        relationTable: ['warehouseIncomingDetail']
      },
      // 供应商名称
      {
        label: 'warIncoming.supplierName', prop: 'supplierName', span: 8, formType: 'partyB', key: 'supplierId', isRule: true,
        relationTable: ['warehouseIncomingDetail'], inputStatus: 'disable'
      },
      // 仓库名称
      {
        label: 'warIncoming.warehouse', prop: 'warehouseId', span: 8, formType: 'select', isRule: true,
        isRelation: true, relationList: [{ receive: 'warehouseName', value: 'warehouseName' }],
        otherOperate: true, otherOperateFun: 'changeWarehouse',
        nameCode: 'warehouseName', valueCode: 'id',
        isRelationTable: true, relationTable: ['warehouseIncomingDetail'],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'warehouseName'
      },
      // 入库日期
      {
        label: 'warIncoming.incomingDate', prop: 'incomingDate', span: 8, formType: 'date', isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 入库办理人
      {
        label: 'warIncoming.incomingAgentUserName', prop: 'incomingAgentUserName', span: 8, formType: 'input', maxlength: 32, isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 发票代码
      {
        label: 'warIncoming.invoiceCode', prop: 'invoiceCode', span: 8, formType: 'input', maxlength: 32,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 发票编号
      {
        label: 'warIncoming.invoiceNo', prop: 'invoiceNo', span: 8, formType: 'input', maxlength: 32,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 发票类型
      {
        label: 'warIncoming.invoiceTypeCode', prop: 'invoiceTypeCode', span: 8,
        formType: 'dicSelect', selectList: [],
        isRelation: true, relationList: [{ receive: 'invoiceTypeValue', value: 'dataName' }],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'invoiceTypeValue'
      },
      // 入库数量累计
      {
        label: 'warIncoming.totalIncomingQuantity', prop: 'totalIncomingQuantity', span: 8, formType: 'input', precision: 4,
        maxlength: 12, inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 金额合计
      {
        label: 'warIncoming.totalAmount', prop: 'totalAmount', span: 8, formType: 'elNumber', precision: 2,
        maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 税额合计
      {
        label: 'warIncoming.totalTaxAmount', prop: 'totalTaxAmount', span: 8, formType: 'elNumber', precision: 2,
        maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 价税合计
      {
        label: 'warIncoming.totalPriceTax', prop: 'totalPriceTax', span: 8, formType: 'elNumber', precision: 2,
        maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 主要入库材料
      {
        label: 'warIncoming.mainMaterials', prop: 'mainMaterials', span: 8, formType: 'input',
        inputStatus: 'disable', placeholder: 'warIncoming.mainMaterialsTips', // 自动获取明细前1-5行明细名称
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 币种
      {
        label: 'warIncoming.currencyCode', prop: 'currencyCode', span: 8,
        formType: 'dicSelect', selectList: [], isRule: true,
        isRelation: true, relationList: [{ receive: 'currencyValue', value: 'dataName' }],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 备注
      {
        label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256,
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 附件
      { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' }
    ],
    oldRelationList: []
  },
  subTableMatch: [
    { value: 'incomingDetails', assignment: 'warehouseIncomingDetail' }
  ],
  // 子表
  subTableConfig: {
    // 明细清单
    warehouseIncomingDetail: {
      subTableName: 'warehouseIncomingDetail',
      titleTips: 'warehouseIncomingDetailTips',
      isSelection: true,
      isSortTable: true, // 拖拽排序
      // 子表按钮
      subTableButton: [
        { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'warehouseIncomingDetail', disabled: false, slot: true },
        // 导出明细
        { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'warehouseIncomingDetail', name: 'button.export', authCode: 'export' },
        { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'warehouseIncomingDetail', disabled: false, slot: true }
      ],
      tableList: {
        // 表头配置
        slaveColumns: [
          // 到货验收单编号
          {
            label: 'warIncoming.preDocNo', prop: 'preDocNo', formType: 'text', maxlength: 64, minWidth: 180,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 材料品种编码
          {
            label: 'fConfig.varietiesCode', prop: 'varietiesCode', formType: 'text', maxlength: 64, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 材料名称
          {
            label: 'fConfig.materialName', prop: 'materialName', formType: 'slot', minWidth: 120, maxlength: 64,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 规格
          {
            label: 'fConfig.standards', prop: 'standards', formType: 'slot', minWidth: 80, maxlength: 64,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 型号
          {
            label: 'fConfig.models', prop: 'models', formType: 'input', minWidth: 120, maxlength: 64,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 品牌
          {
            label: 'fConfig.brand', prop: 'brand', formType: 'input', minWidth: 80, maxlength: 128,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 计量单位
          {
            label: 'fConfig.unit', prop: 'unit', formType: 'slot', minWidth: 80, maxlength: 32,
            printWidth: 5, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  验收通过数量
          {
            label: 'warIncoming.passedQuantity', prop: 'passedQuantity', formType: 'text', filterName: 'number', minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  已入库数量
          {
            label: 'warIncoming.alreadyIncomingQuantity', prop: 'alreadyIncomingQuantity', formType: 'text', filterName: 'number', minWidth: 120,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  本次入库数量
          {
            label: 'warIncoming.currentIncomingQuantity', prop: 'currentIncomingQuantity', formType: 'slot',
            operateData: true, precision: 4, maxlength: 12, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 税率
          {
            label: 'warIncoming.taxRate', prop: 'taxRate', minWidth: 80, formType: 'dicSelect', operateData: true,
            printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  单价(含税)
          {
            label: 'warIncoming.includeUnitPrice', prop: 'includeUnitPrice', formType: 'number', filterName: 'setMoney',
            operateData: true, precision: 4, min: 0, maxlength: 18, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 金额(含税)
          {
            label: 'warIncoming.includeTaxAmount', prop: 'includeTaxAmount', formType: 'number',
            operateData: true, precision: 2, maxlength: 12, minWidth: 120, filterName: 'setMoney',
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  单价(不含税)
          {
            label: 'warIncoming.unitPrice', prop: 'unitPrice', formType: 'number', filterName: 'setMoney',
            operateData: true, precision: 8, min: 0, maxlength: 12, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 金额(不含税)
          {
            label: 'warIncoming.excludeTaxAmount', prop: 'excludeTaxAmount', formType: 'number',
            operateData: true, precision: 2, maxlength: 17, minWidth: 120, filterName: 'setMoney',
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 税额
          {
            label: 'warIncoming.taxAmount', prop: 'taxAmount', formType: 'number',
            operateData: true, precision: 2, maxlength: 12, minWidth: 120, filterName: 'setMoney',
            printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 存放库位
          {
            label: 'warIncoming.warehouseShelvesId', prop: 'warehouseShelvesId', minWidth: 120, formType: 'slot',
            nameCode: 'warehouseShelvesName', valueCode: 'id',
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  质保到期日
          {
            label: 'warIncoming.warrantyExpiredDate', prop: 'warrantyExpiredDate', formType: 'date', minWidth: 120,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 备注
          {
            label: 'fConfig.remarks', prop: 'remarks', formType: 'input', minWidth: 120, maxlength: 255,
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
          // 验收/零星采购单备注
          {
            label: 'warIncoming.checkRemark', prop: 'checkRemark', formType: 'text', minWidth: 140,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          }
        ],
        // 校验
        rules: {
          materialName: [
            { required: true, message: 'warIncoming.materialNameTips', trigger: 'blur' }
          ],
          standards: [
            { required: true, trigger: 'blur' }
          ],
          // models: [
          //   { required: true, trigger: 'blur' }
          // ],
          unit: [
            { required: true, trigger: 'blur' }
          ],
          taxRate: [
            { required: true, message: 'warIncoming.taxRateTips', trigger: 'blur' }
          ],
          unitPrice: [
            { required: true, trigger: 'blur' }
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
