import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'warAllocation/getWorkflowNextNode',
      parmasList: [
        {receive: 'sid', value: 'taskSid'},
        {receive: 'projectId', value: 'outProjectId'}
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'warAllocation/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'warAllocation/setDelete',
      params: 'allocationId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'warAllocation/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'warAllocation/getInfo',
      params: 'allocationId'
    },
    // save
    saveUrl: {
      url: 'warAllocation/setEdit'
    },
    // 导出明细
    exportDetail: {
      url: 'warAllocation/exportDetail',
      params: 'allocationId'
    }
  },
    // 数据字典
    dictionary: [
      {dicCode: 'outboundType', propCode: 'outboundTypeCode'},
      {dicCode: 'taxRate', propCode: 'taxRate'},
      {dicCode: 'allocationType', propCode: 'allocationTypeCode'}
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
            // 调拨类型(01调往公司总仓,02调往其他项目)
            { label: 'warAllocation.allocationTypeCode', prop: 'allocationTypeCode', span: 8, formType: 'dicSelect', isRule: true,
              selectList: [], isTranslate: true, inputStatus: 'edit',
              isRelation: true, relationList: [{receive: 'allocationTypeValue', value: 'dataName'}],
              relationTable: ['warehouseAllocationDetail'],
              otherOperate: true, otherOperateFun: 'allocationTypeFun',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 调出项目名称
            { label: 'warAllocation.outProjectName', prop: 'outProjectName', span: 8, formType: 'project', key: 'outProjectId',
              isRule: true,
              relationTable: ['warehouseAllocationDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 调入项目名称
            { label: 'warAllocation.inProjectName', prop: 'inProjectName', span: 8, formType: 'project', key: 'inProjectId',
              check: true, isRule: true, isNoAutn: true, inputStatus: 'hide',
              relationTable: ['warehouseAllocationDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 总仓名称
            {
              label: 'warAllocation.generalWarehouseName', prop: 'generalWarehouseId', span: 8, formType: 'select',
              isRelation: true, relationList: [{receive: 'warehouseName', value: 'warehouseName'}],
              nameCode: 'warehouseName', valueCode: 'id', inputStatus: 'hide',
              isRelationTable: true, relationTable: ['warehouseAllocationDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'generalWarehouseName'
            },
            // 调拨日期
            { label: 'warAllocation.allocationDate', prop: 'allocationDate', span: 8, formType: 'date', isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 调出办理人
            { label: 'warAllocation.allocationoutAgentUserName', prop: 'allocationoutAgentUserName', span: 8, formType: 'input', maxlength: 32, isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 调入办理人
            { label: 'warAllocation.allocationinAgentUserName', prop: 'allocationinAgentUserName', span: 8, formType: 'input', maxlength: 32, isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 主要调拨材料
            { label: 'warAllocation.mainAllocationMaterials', prop: 'mainAllocationMaterials', span: 8, formType: 'input',
              inputStatus: 'disable', placeholder: 'warAllocation.mainAllocationMaterialsTips', // 自动获取明细前1-5行明细名称
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 金额合计
            {
              label: 'warAllocation.totalAmount', prop: 'totalAmount', span: 8, formType: 'elNumber', min: 0, precision: 2,
              maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 税额合计
            {
              label: 'warAllocation.totalTaxAmount', prop: 'totalTaxAmount', span: 8, formType: 'elNumber', min: 0, precision: 2,
              maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 价税合计
            {
              label: 'warAllocation.totalPriceTax', prop: 'totalPriceTax', span: 8, formType: 'elNumber', min: 0, precision: 2,
              maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // (调拨原因)备注
            { label: 'warAllocation.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256,
              printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload'}
        ],
        oldRelationList: []
    },
    subTableMatch: [
      {value: 'allocationDetails', assignment: 'warehouseAllocationDetail'}
    ],
    // 子表
    subTableConfig: {
      // 明细清单
      warehouseAllocationDetail: {
          subTableName: 'warehouseAllocationDetail',
          titleTips: 'warehouseAllocationDetailTips',
          isSelection: true,
          // 子表按钮
          subTableButton: [
            {noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'warehouseAllocationDetail', disabled: false},
            // 导出明细
            { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'warehouseAllocationDetail', name: 'button.export', authCode: 'export' },
            { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'warehouseAllocationDetail', disabled: false }
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
                    printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  // 单位
                  { label: 'fConfig.unit', prop: 'unit', formType: 'text', minWidth: 60,
                    printWidth: 5, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  //  调出单价(不含税)
                  { label: 'warAllocation.inUnitPrice', prop: 'inUnitPrice', formType: 'number', filterName: 'setMoney',
                    operateData: true, precision: 8, min: 0, maxlength: 12, minWidth: 120,
                    printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  // 税率%
                  {
                    label: 'warAllocation.inTaxRate', prop: 'inTaxRate', minWidth: 60, formType: 'text', filterName: 'taxRate', operateData: true,
                    printWidth: 6, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  // 币种
                  {
                    label: 'warAllocation.currencyCode', prop: 'currencyValue', minWidth: 80, formType: 'text',
                    printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  // 调出前存放仓库
                  {
                    label: 'warAllocation.outWarehouseName', prop: 'outWarehouseName', minWidth: 140, formType: 'text',
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 调出前存放库位
                  {
                    label: 'warAllocation.outWarehouseShelvesName', prop: 'outWarehouseShelvesName', minWidth: 140, formType: 'text',
                    printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  //  可用库存数量
                  { label: 'warAllocation.realStock', prop: 'realStock', formType: 'text', filterName: 'number', minWidth: 100,
                    printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  //  调出数量
                  { label: 'warAllocation.outAllocationQuantity', prop: 'outAllocationQuantity', formType: 'slot',
                    operateData: true, precision: 4, min: 0, maxlength: 12, minWidth: 100,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 金额(不含税)
                  { label: 'warAllocation.inExcludeTaxAmount', prop: 'inExcludeTaxAmount', formType: 'text', filterName: 'setMoney',
                    operateData: true, precision: 2, maxlength: 12, minWidth: 100,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 税额
                  { label: 'warAllocation.inTaxAmount', prop: 'inTaxAmount', formType: 'text', filterName: 'setMoney',
                    operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 60,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 价税合计
                  { label: 'warAllocation.inIncludeTaxAmount', prop: 'inIncludeTaxAmount', formType: 'text', filterName: 'setMoney',
                    operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 80,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 调入仓库
                  {
                    label: 'warAllocation.inWarehouse', prop: 'inWarehouseId', minWidth: 100, formType: 'slot', isRule: true,
                    isRelation: true, relationList: [{receive: 'inWarehouseName', value: 'warehouseName'}],
                    otherOperate: true, otherOperateFun: 'changeWarehouse',
                    nameCode: 'warehouseName', valueCode: 'id',
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'inWarehouseName'
                  },
                  // 调入后存放库位
                  {
                    label: 'warAllocation.inWarehouseShelves', prop: 'inWarehouseShelvesId', minWidth: 120, formType: 'slot',
                    nameCode: 'warehouseShelvesName', valueCode: 'id',
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'inWarehouseShelvesName'
                  },
                  // 备注
                  { label: 'warAllocation.subTableRemarks', prop: 'remarks', formType: 'input', minWidth: 120, maxlength: 255,
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  }
              ],
              // 校验
              rules: {
                inWarehouseId: [
                  { required: true, message: 'warAllocation.inWarehouseTips', trigger: 'change'}
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
