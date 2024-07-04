import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'warInventory/getWorkflowNextNode',
      parmasList: [
        {receive: 'sid', value: 'taskSid'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'warInventory/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'warInventory/setDelete',
      params: 'inventoryId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'warInventory/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'warInventory/getInfo',
      params: 'inventoryId'
    },
    // save
    saveUrl: {
      url: 'warInventory/setEdit'
    },
    // 导出明细
    exportDetail: {
      url: 'warInventory/exportDetail',
      params: 'inventoryId'
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
              relationTable: ['warehouseInventoryDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目编号
            { label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 仓库名称
            {
              label: 'warInventory.warehouseName', prop: 'warehouseId', span: 8, formType: 'select', isRule: true,
              isRelation: true, relationList: [{receive: 'warehouseName', value: 'warehouseName'}],
              nameCode: 'warehouseName', valueCode: 'id',
              isRelationTable: true, relationTable: ['warehouseInventoryDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'warehouseName'
            },
            // 盘点情况
            { label: 'warInventory.inventorySituation', prop: 'inventorySituation', span: 8, formType: 'input', maxlength: 64, isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 盘点人
            { label: 'warInventory.inventoryUserName', prop: 'inventoryUserName', span: 8, formType: 'input', maxlength: 32, isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 盘点日期
            { label: 'warInventory.inventoryDate', prop: 'inventoryDate', span: 8, formType: 'date', isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
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
      {value: 'inventoryDetails', assignment: 'warehouseInventoryDetail'}
    ],
    // 子表
    subTableConfig: {
      // 明细清单
      warehouseInventoryDetail: {
          subTableName: 'warehouseInventoryDetail',
          titleTips: 'warehouseInventoryDetailTips',
          isSelection: true,
          // 子表按钮
          subTableButton: [
            { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'warehouseInventoryDetail', disabled: false },
            // 导出明细
            { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'warehouseInventoryDetail', name: 'button.export', authCode: 'export' },
            {noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'warehouseInventoryDetail', disabled: false}
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
                  // 存放库位
                  {
                    label: 'warInventory.warehouseShelvesName', prop: 'warehouseShelvesName', formType: 'text',
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  账面应存
                  { label: 'warInventory.realStock', prop: 'realStock', formType: 'text', minWidth: 100,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  实际盘存
                  { label: 'warInventory.inventoryQuantity', prop: 'inventoryQuantity', formType: 'slot',
                    operateData: true, precision: 4, min: 0, maxlength: 12, minWidth: 100,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  盘盈
                  { label: 'warInventory.inventoryProfitQuantity', prop: 'inventoryProfitQuantity', formType: 'text', minWidth: 80,
                    precision: 4, maxlength: 12,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  盘亏
                  { label: 'warInventory.inventoryLossQuantity', prop: 'inventoryLossQuantity', formType: 'text',
                    precision: 4, maxlength: 12, minWidth: 80,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 备注
                  { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
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
