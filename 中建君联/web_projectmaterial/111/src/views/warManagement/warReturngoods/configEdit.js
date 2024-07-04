/*
 * @Author: your name
 * @Date: 2020-07-30 10:35:19
 * @LastEditTime: 2022-04-26 09:35:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\warReturngoods\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'warReturngoods/getWorkflowNextNode',
      parmasList: [
        { receive: 'sid', value: 'taskSid' },
        { receive: 'projectId', value: 'projectId' }
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'warReturngoods/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'warReturngoods/setDelete',
      params: 'returngoodsId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'warReturngoods/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'warReturngoods/getInfo',
      params: 'returngoodsId'
    },
    // save
    saveUrl: {
      url: 'warReturngoods/setEdit'
    },
    // 导出明细
    exportDetail: {
      url: 'warReturngoods/exportDetail',
      params: 'returngoodsId'
    }
  },
  // 数据字典
  dictionary: [
    { dicCode: 'outboundType', propCode: 'outboundTypeCode' },
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
        isRelation: true,
        relationList: [
          { receive: 'projectCode', value: 'projectCode' },
          { receive: 'supplierName', value: 'supplierName' },
          { receive: 'supplierId', value: 'supplierId' },
          { receive: 'expendContractName', value: 'expendContractName' },
          { receive: 'expendContractId', value: 'expendContractId' },
          { receive: 'incomingDocNo', value: 'incomingDocNo' },
          { receive: 'incomingId', value: 'incomingId' },
          { receive: 'mainReturngoodsMaterials', value: 'mainReturngoodsMaterials' },
          { receive: 'totalAmount', value: 'totalAmount' },
          { receive: 'totalTaxAmount', value: 'totalTaxAmount' },
          { receive: 'totalPriceTax', value: 'totalPriceTax' }
        ],
        isRule: true,
        relationTable: ['warehouseReturngoodsDetail'],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 项目编号
      {
        label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 合同/零星采购单
      {
        label: 'fConfig.expendContractName', prop: 'expendContractName', span: 8, formType: 'slot', isRule: true,
        key: 'expendContractId', relationKey: { receive: 'projectId', value: 'projectName' },
        isRelation: true, inputStatus: 'edit',
        relationList: [
          { receive: 'supplierName', value: 'partyBUnitName' },
          { receive: 'supplierId', value: 'partyBUnitId' },
          { receive: 'sourceType', value: 'sourceType' },
          { receive: 'expendContractCode', value: 'expendContractCode' },
          { receive: 'incomingDocNo', value: 'incomingDocNo' },
          { receive: 'incomingId', value: 'incomingId' },
          { receive: 'mainReturngoodsMaterials', value: 'mainReturngoodsMaterials' },
          { receive: 'totalAmount', value: 'totalAmount' },
          { receive: 'totalTaxAmount', value: 'totalTaxAmount' },
          { receive: 'totalPriceTax', value: 'totalPriceTax' }
        ],
        relationTable: ['warehouseReturngoodsDetail'],
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, printValue: 'expendContractName'
      },
      // 入库单编号
      {
        label: 'warReturngoods.incomingDocNo', prop: 'incomingDocNo', span: 8, formType: 'slot', isRule: true,
        key: 'incomingId', inputStatus: 'edit',
        isRelation: true,
        relationList: [
          { receive: 'mainReturngoodsMaterials', value: 'mainReturngoodsMaterials' },
          { receive: 'totalAmount', value: 'totalAmount' },
          { receive: 'totalTaxAmount', value: 'totalTaxAmount' },
          { receive: 'totalPriceTax', value: 'totalPriceTax' }
        ],
        relationTable: ['warehouseReturngoodsDetail'],
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0, printValue: 'incomingDocNo'
      },
      // 供应商名称
      {
        label: 'warReturngoods.supplierName', prop: 'supplierName', span: 8, formType: 'partyB', key: 'supplierId',
        isRule: false, relationTable: ['warehouseReturngoodsDetail'], inputStatus: 'disable'
      },
      // 主要退货材料
      {
        label: 'warReturngoods.mainReturngoodsMaterials', prop: 'mainReturngoodsMaterials', span: 8, formType: 'input',
        inputStatus: 'disable', placeholder: 'warReturngoods.mainReturngoodsMaterialsTips', // 自动获取明细前1-5行明细名称
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 退货办理人
      {
        label: 'warReturngoods.returngoodsAgentUserName', prop: 'returngoodsAgentUserName', span: 8, formType: 'input', maxlength: 32, isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 退货日期
      {
        label: 'warReturngoods.returngoodsDate', prop: 'returngoodsDate', span: 8, formType: 'date', isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 金额合计
      {
        label: 'warReturngoods.totalAmount', prop: 'totalAmount', span: 8, formType: 'elNumber', min: 0, precision: 2,
        maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 税额合计
      {
        label: 'warReturngoods.totalTaxAmount', prop: 'totalTaxAmount', span: 8, formType: 'elNumber', min: 0, precision: 2,
        maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 价税合计
      {
        label: 'warReturngoods.totalPriceTax', prop: 'totalPriceTax', span: 8, formType: 'elNumber', min: 0, precision: 2,
        maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // (退货原因)备注
      {
        label: 'warReturngoods.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256,
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 附件
      { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' }
    ],
    oldRelationList: []
  },
  subTableMatch: [
    { value: 'returngoodsDetails', assignment: 'warehouseReturngoodsDetail' }
  ],
  // 子表
  subTableConfig: {
    // 明细清单
    warehouseReturngoodsDetail: {
      subTableName: 'warehouseReturngoodsDetail',
      titleTips: 'warehouseReturngoodsDetailTips',
      isSelection: true,
      // 子表按钮
      subTableButton: [
        { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'warehouseReturngoodsDetail', disabled: false },
        // 导出明细
        { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'warehouseReturngoodsDetail', name: 'button.export', authCode: 'export' },
        { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'warehouseReturngoodsDetail', disabled: false }
      ],
      tableList: {
        // 表头配置
        slaveColumns: [
          // 材料编码
          {
            label: 'fConfig.materialCode', prop: 'materialCode', formType: 'text', minWidth: 120,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 材料名称
          {
            label: 'fConfig.materialName', prop: 'materialName', formType: 'text', minWidth: 140,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 规格
          {
            label: 'fConfig.standards', prop: 'standards', formType: 'text', minWidth: 80,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 型号
          {
            label: 'fConfig.models', prop: 'models', formType: 'text', minWidth: 80,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 品牌
          {
            label: 'fConfig.brand', prop: 'brand', formType: 'text', minWidth: 80,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 单位
          {
            label: 'fConfig.unit', prop: 'unit', formType: 'text', minWidth: 60,
            printWidth: 5, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  入库单价(不含税)
          {
            label: 'warReturngoods.unitPrice', prop: 'unitPrice', formType: 'text', precision: 8, maxlength: 12, filterName: 'setMoney',
            minWidth: 120, printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 税率%
          {
            label: 'warReturngoods.taxRate', prop: 'taxRate', minWidth: 60, formType: 'text', filterName: 'taxRate', operateData: true,
            printWidth: 6, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 币种
          {
            label: 'warReturngoods.currencyCode', prop: 'currencyValue', minWidth: 80, formType: 'text',
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 存放库位
          {
            label: 'warReturngoods.warehouseShelvesName', prop: 'warehouseShelvesName', formType: 'text',
            printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // //  可用库存数量
          // {
          //   label: 'warReturngoods.realStock', prop: 'realStock', formType: 'text', filterName: 'number', minWidth: 100,
          //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          // },
          // 隐藏可用库存字段，保存时不校验退货数量是否超过可用库存数量。增加入库数量和已退货数量，只限制本次退货+已退货数量不能超过入库数量。
          // 入库数量
          {
            label: 'warReturngoods.alreadyIncomingQuantity', prop: 'stock', formType: 'text', filterName: 'number', minWidth: 100,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 已退货数量
          {
            label: 'warReturngoods.alreadyReturngoodsQuantity', prop: 'alreadyReturngoodsQuantity', formType: 'text', filterName: 'number', minWidth: 100,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  退货数量
          {
            label: 'warReturngoods.currentReturngoodsQuantity', prop: 'currentReturngoodsQuantity', formType: 'slot',
            operateData: true, precision: 4, min: 0, maxlength: 12, minWidth: 100,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 金额(不含税)
          {
            label: 'warReturngoods.excludeTaxAmount', prop: 'excludeTaxAmount', formType: 'text', filterName: 'setMoney',
            operateData: true, precision: 2, maxlength: 12, minWidth: 100,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 税额
          {
            label: 'warReturngoods.taxAmount', prop: 'taxAmount', formType: 'text', filterName: 'setMoney',
            operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 60,
            printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 价税合计
          {
            label: 'warReturngoods.includeTaxAmount', prop: 'includeTaxAmount', formType: 'text', filterName: 'setMoney',
            operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 80,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 备注
          {
            label: 'warReturngoods.subTableRemarks', prop: 'remarks', formType: 'input', maxlength: 255,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
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
