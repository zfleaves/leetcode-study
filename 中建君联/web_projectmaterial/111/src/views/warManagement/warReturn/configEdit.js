import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'warReturn/getWorkflowNextNode',
      parmasList: [
        {receive: 'sid', value: 'taskSid'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'warReturn/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'warReturn/setDelete',
      params: 'returnId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'warReturn/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'warReturn/getInfo',
      params: 'returnId'
    },
    // save
    saveUrl: {
      url: 'warReturn/setEdit'
    },
    // 导出明细
    exportDetail: {
      url: 'warReturn/exportDetail',
      params: 'returnId'
    }
  },
    // 数据字典
    dictionary: [
      {dicCode: 'outboundType', propCode: 'outboundTypeCode'},
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
              check: true, isRelation: true,
              relationList: [
                {receive: 'projectCode', value: 'projectCode'},
                {receive: 'warehouseName', value: 'warehouseName'},
                {receive: 'warehouseId', value: 'warehouseId'}
              ],
              isRule: true,
              relationTable: ['warehouseReturnDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目编号
            { label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 退回仓库
            {
              label: 'warReturn.warehouseName', prop: 'warehouseId', span: 8, formType: 'slot', isRule: true,
              isRelation: true, relationList: [{receive: 'warehouseName', value: 'warehouseName'}],
              nameCode: 'warehouseName', valueCode: 'id',
              // isRelationTable: true, relationTable: ['warehouseReturnDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'warehouseName'
            },
            // 主要退回材料
            { label: 'warReturn.mainReturnMaterials', prop: 'mainReturnMaterials', span: 8, formType: 'input',
              inputStatus: 'disable', placeholder: 'warReturn.mainReturnMaterialsTips', // 自动获取明细前1-5行明细名称
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 退回办理人
            { label: 'warReturn.returnAgentUserName', prop: 'returnAgentUserName', span: 8, formType: 'input', maxlength: 32, isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 退回日期
            { label: 'warReturn.returnDate', prop: 'returnDate', span: 8, formType: 'date', isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // (退回说明)备注
            { label: 'warReturn.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256,
              printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload'}
        ],
        oldRelationList: []
    },
    subTableMatch: [
      {value: 'returnDetails', assignment: 'warehouseReturnDetail'}
    ],
    // 子表
    subTableConfig: {
      // 明细清单
      warehouseReturnDetail: {
          subTableName: 'warehouseReturnDetail',
          titleTips: 'warehouseReturnDetailTips',
          isSelection: true,
          // 子表按钮
          subTableButton: [
            { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'warehouseReturnDetail', disabled: false },
             // 导出明细
            { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'warehouseReturnDetail', name: 'button.export', authCode: 'export' },
            {noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'warehouseReturnDetail', disabled: false}
          ],
          tableList: {
              // 表头配置
              slaveColumns: [
                  // 材料编码
                  { label: 'fConfig.materialCode', prop: 'materialCode', formType: 'text', minWidth: 120,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 材料名称
                  { label: 'fConfig.materialName', prop: 'materialName', formType: 'text', minWidth: 140,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 规格
                  { label: 'fConfig.standards', prop: 'standards', formType: 'text',
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 型号
                  { label: 'fConfig.models', prop: 'models', formType: 'text',
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 品牌
                  { label: 'fConfig.brand', prop: 'brand', formType: 'text',
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 单位
                  { label: 'fConfig.unit', prop: 'unit', formType: 'text', minWidth: 60,
                    printWidth: 5, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 出库单价(不含税)
                  { label: 'warReturn.outboundUnitPrice', prop: 'outboundUnitPrice', formType: 'text', filterName: 'setMoney',
                    operateData: true, precision: 8, min: 0, maxlength: 12, minWidth: 120,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 税率
                  {
                    label: 'warReturn.taxRate', prop: 'taxRate', minWidth: 60, formType: 'text', filterName: 'taxRate', operateData: true,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 币种
                  {
                    label: 'warReturn.currencyCode', prop: 'currencyValue', minWidth: 80, formType: 'text',
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  领料单位
                  { label: 'warReturn.pickingUnitName', prop: 'pickingUnitName', formType: 'text', minWidth: 100,
                    printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  // 存放库位
                  { label: 'warReturn.warehouseShelvesName', prop: 'warehouseShelvesName', formType: 'text', minWidth: 100,
                    printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  //  出库数量
                  { label: 'warReturn.outboundQuantity', prop: 'outboundQuantity', formType: 'text', filterName: 'number', precision: 4, minWidth: 80,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 已退回数量
                  { label: 'warReturn.alreadyReturnQuantity', prop: 'alreadyReturnQuantity', formType: 'text', filterName: 'number', precision: 4, minWidth: 100,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  本次退回数量
                  { label: 'warReturn.currentReturnQuantity', prop: 'currentReturnQuantity', formType: 'slot',
                    operateData: true, precision: 4, min: 0, maxlength: 12, minWidth: 120,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 金额(不含税)
                  { label: 'warReturn.excludeTaxAmount', prop: 'excludeTaxAmount', formType: 'text', filterName: 'setMoney',
                    operateData: true, precision: 2, maxlength: 12, minWidth: 100,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 税额
                  { label: 'warReturn.taxAmount', prop: 'taxAmount', formType: 'text', filterName: 'setMoney',
                    operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 60,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 金额(含税)
                  { label: 'warReturn.includeTaxAmount', prop: 'includeTaxAmount', formType: 'text', filterName: 'setMoney', precision: 2,
                    maxlength: 12, minWidth: 100,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 退回原因(备注)
                  { label: 'warReturn.subTableRemarks', prop: 'remarks', formType: 'input', minWidth: 120, maxlength: 255,
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
  init () {
    Utils.commonUtil.getSelectList(this.PageConfig.selectList, this);
    Utils.commonUtil.getDicAllDataList(this.PageConfig.dictionary, this);
  }
}
export default Page;
