/*
 * @Author: your name
 * @Date: 2020-07-30 10:35:19
 * @LastEditTime: 2023-02-20 15:44:51
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\warOutbound\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'warehouseOutbound',
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'warOutbound/getWorkflowNextNode',
      parmasList: [
        {receive: 'sid', value: 'taskSid'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'warOutbound/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'warOutbound/setDelete',
      params: 'outboundId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'warOutbound/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'warOutbound/getInfo',
      params: 'outboundId'
    },
    // save
    saveUrl: {
      url: 'warOutbound/setEdit'
    },
    // 导出明细
    exportDetail: {
      url: 'warOutbound/exportDetail',
      params: 'outboundId'
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
                {receive: 'warehouseId', value: 'warehouseId'},
                {receive: 'pickingUnitId', value: 'pickingUnitId'},
                {receive: 'pickingUnitName', value: 'pickingUnitName'},
                {receive: 'unitContactMobile', value: 'unitContactInfo'},
                {receive: 'unitContactName', value: 'unitContactName'},
                {receive: 'usePlaceId', value: 'usePlaceId'},
                {receive: 'usePlaceName', value: 'usePlaceName'}
              ],
              isRule: true,
              relationTable: ['warehouseOutboundDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目编号
            { label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 出库类型
            {
              label: 'warOutbound.outboundTypeCode', prop: 'outboundTypeCode', span: 8,
              formType: 'dicSelect', selectList: [], isRule: true,
              isRelation: true, relationList: [{receive: 'outboundTypeValue', value: 'dataName'}],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'outboundTypeValue'
            },
            // 仓库名称
            {
              label: 'warOutbound.warehouse', prop: 'warehouseId', span: 8, formType: 'select', isRule: true,
              isRelation: true, relationList: [{receive: 'warehouseName', value: 'warehouseName'}],
              nameCode: 'warehouseName', valueCode: 'id',
              isRelationTable: true, relationTable: ['warehouseOutboundDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'warehouseName'
            },
            // 出库办理人
            { label: 'warOutbound.outboundAgentUserName', prop: 'outboundAgentUserName', span: 8, formType: 'input', maxlength: 32, isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 出库日期
            { label: 'warOutbound.outboundDate', prop: 'outboundDate', span: 8, formType: 'date', isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 主要出库材料
            { label: 'warOutbound.mainOutboundMaterials', prop: 'mainOutboundMaterials', span: 8, formType: 'input',
              inputStatus: 'disable', placeholder: 'warOutbound.mainOutboundMaterialsTips', // 自动获取明细前1-5行明细名称
              printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 领料单位
            {
              label: 'fConfig.applicant', prop: 'pickingUnitId', span: 8, formType: 'select', isRule: true,
              isRelation: true, relationList: [{receive: 'pickingUnitName', value: 'unitName'},
              {receive: 'unitContactMobile', value: 'unitContactInfo'},
              {receive: 'unitContactName', value: 'unitContactName'},
              {receive: 'expendContractName', value: 'expendContractName'},
              {receive: 'expendContractId', value: 'expendContractId'},
              {receive: 'expendContractCode', value: 'expendContractCode'}],
              nameCode: 'name', valueCode: 'id',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'pickingUnitName'
            },
            // 对应分包合同
            {
              label: 'fConfig.correspondingSubcontract', prop: 'expendContractName', span: 8, key: 'expendContractId',
              formType: 'slot', selectList: [],
              isRelation: true, relationList: [
                {receive: 'expendContractCode', value: 'contractCode'}
              ],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 使用部位
            { label: 'warOutbound.usePlaceName', prop: 'usePlaceName', span: 8, formType: 'usePlace', key: 'usePlaceId',
              relationKey: {receive: 'projectId', value: 'projectName'},
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0,
              otherOperate: true, otherOperateFun: 'handleSetRequiredDateUsePlace'
            },
            // 金额合计
            {
              label: 'warOutbound.totalAmount', prop: 'totalAmount', span: 8, formType: 'elNumber', precision: 2,
              maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 税额合计
            {
              label: 'warOutbound.totalTaxAmount', prop: 'totalTaxAmount', span: 8, formType: 'elNumber', precision: 2,
              maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 价税合计
            {
              label: 'warOutbound.totalPriceTax', prop: 'totalPriceTax', span: 8, formType: 'elNumber', precision: 2,
              maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 备注
            { label: 'warOutbound.remarks', prop: 'remarks', span: 24, formType: 'slot', maxlength: 256,
              printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload'}
        ],
        oldRelationList: []
    },
    subTableMatch: [
      {value: 'outboundDetails', assignment: 'warehouseOutboundDetail'}
    ],
    // 子表
    subTableConfig: {
      // 明细清单
      warehouseOutboundDetail: {
          subTableName: 'warehouseOutboundDetail',
          titleTips: 'warehouseOutboundDetailTips',
          isSelection: true,
          // 子表按钮
          subTableButton: [
            { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'warehouseOutboundDetail', disabled: false },
             // 导出明细
            { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'warehouseOutboundDetail', name: 'button.export', authCode: 'export' },
            {noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'warehouseOutboundDetail', disabled: false}
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
                  { label: 'fConfig.unit', prop: 'unit', formType: 'text', minWidth: 50,
                    printWidth: 5, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 可用库存
                  { label: 'warOutbound.stock', prop: 'realStock', formType: 'text', filterName: 'number', minWidth: 80,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 存放库位
                  { label: 'warOutbound.warehouseShelvesName', prop: 'warehouseShelvesName', formType: 'text', minWidth: 100,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  出库数量
                  { label: 'warOutbound.currentOutboundQuantity', prop: 'currentOutboundQuantity', formType: 'slot',
                    operateData: true, precision: 4, maxlength: 12, minWidth: 100,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  入库单价(不含税)
                  { label: 'warOutbound.unitPrice', prop: 'unitPrice', formType: 'text', filterName: 'setMoney',
                    operateData: true, precision: 8, min: 0, maxlength: 12, minWidth: 120,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 出库单价(不含税)
                  { label: 'warOutbound.outboundUnitPrice', prop: 'outboundUnitPrice', formType: 'text', filterName: 'setMoney',
                    operateData: true, precision: 8, min: 0, maxlength: 12, minWidth: 120,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 金额(不含税)
                  { label: 'warOutbound.excludeTaxAmount', prop: 'excludeTaxAmount', formType: 'text', filterName: 'setMoney',
                    operateData: true, precision: 2, maxlength: 12, minWidth: 100,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 税率
                  {
                    label: 'warOutbound.taxRate', prop: 'taxRate', minWidth: 60, formType: 'text', filterName: 'taxRate', operateData: true,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 税额
                  { label: 'warOutbound.taxAmount', prop: 'taxAmount', formType: 'text', filterName: 'setMoney',
                    operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 60,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 金额(含税)
                  { label: 'warOutbound.includeTaxAmount', prop: 'includeTaxAmount', formType: 'text', filterName: 'setMoney',
                    operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 100,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 币种
                  {
                    label: 'warOutbound.currencyCode', prop: 'currencyValue', minWidth: 80, formType: 'text',
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  使用部位
                  { label: 'warOutbound.usePlaceName', prop: 'usePlaceName', formType: 'slot', key: 'usePlaceId', minWidth: 140,
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  // 用途(备注)
                  { label: 'warOutbound.remarks', prop: 'remarks', formType: 'input', minWidth: 120, maxlength: 255,
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
