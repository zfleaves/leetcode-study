
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // info
    infoUrl: {
      url: 'receiptTracking/getInfo',
      params: 'incomingId'
    }
  },
  // 数据字典
  dictionary: [],
  // 接口数据
  selectList: [],
  // 主表
  mainFormConfig: {
    formList: [
      // 供应商名称
      {
        label: 'receiptTracking.supplierName', prop: 'supplierName', span: 16, formType: 'input', inputStatus: 'disable',
        printWidth: 16, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 对账日期
      {
        label: 'receiptTracking.createTime', prop: 'printIncoming', span: 8, formType: 'input', inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 金额合计
      {
        label: 'receiptTracking.printTotalAmount', prop: 'totalAmount', span: 8, formType: 'elNumber', precision: 2,
        maxlength: 17, inputStatus: 'disable', filterName: 'setMoney',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 税额合计
      {
        label: 'receiptTracking.printTotalTaxAmount', prop: 'totalTaxAmount', span: 8, formType: 'elNumber', precision: 2,
        maxlength: 17, inputStatus: 'disable', filterName: 'setMoney',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 价税合计
      {
        label: 'receiptTracking.printTotalPriceTax', prop: 'totalPriceTax', span: 8, formType: 'elNumber', precision: 2,
        maxlength: 17, inputStatus: 'disable', filterName: 'setMoney',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      }
    ],
    oldRelationList: []
  },
  subTableMatch: [
    { value: 'details', assignment: 'details' }
  ],
  // 子表
  subTableConfig: {
    // 明细清单
    details: {
      subTableName: 'details',
      titleTips: 'detailsTips',
      isSelection: true,
      // 子表按钮
      subTableButton: [],
      tableList: {
        // 表头配置
        slaveColumns: [
          // 材料名称
          {
            label: 'fConfig.materialName', prop: 'materialName', formType: 'input', minWidth: 120, maxlength: 64,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 规格
          {
            label: 'fConfig.standards', prop: 'standards', formType: 'input', minWidth: 80, maxlength: 64,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
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
          // 单位
          {
            label: 'fConfig.unit', prop: 'unit', formType: 'input', minWidth: 80, maxlength: 32,
            printWidth: 5, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  本次入库数量
          {
            label: 'receiptTracking.currentIncomingQuantity', prop: 'currentIncomingQuantity', formType: 'slot',
            operateData: true, precision: 4, maxlength: 12, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  单价(含税)
          {
            label: 'fConfig.includeUnitPrice', prop: 'includeUnitPrice', formType: 'number', filterName: 'setMoney',
            operateData: true, precision: 4, min: 0, maxlength: 18, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 金额(含税)
          {
            label: 'fConfig.includeTaxAmount', prop: 'includeTaxAmount', formType: 'number',
            operateData: true, precision: 2, maxlength: 12, minWidth: 100, filterName: 'setMoney',
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 税率
          {
            label: 'fConfig.taxRate', prop: 'taxRate', minWidth: 80, formType: 'dicSelect', operateData: true,
            printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 税额
          {
            label: 'fConfig.taxAmount', prop: 'taxAmount', formType: 'number',
            operateData: true, precision: 2, maxlength: 12, minWidth: 80, filterName: 'setMoney',
            printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
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
