/*
 * @Author: your name
 * @Date: 2020-07-30 10:35:19
 * @LastEditTime: 2021-08-02 10:38:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\warReportloss\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'warReportloss/getWorkflowNextNode',
      parmasList: [
        {receive: 'sid', value: 'taskSid'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'warReportloss/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'warReportloss/setDelete',
      params: 'reportlossId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'warReportloss/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'warReportloss/getInfo',
      params: 'reportlossId'
    },
    // save
    saveUrl: {
      url: 'warReportloss/setEdit'
    },
    // 导出明细
    exportDetail: {
      url: 'warReportloss/exportDetail',
      params: 'reportlossId'
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
              relationTable: ['warehouseReportlossDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目编号
            { label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 仓库名称
            {
              label: 'warReportloss.warehouseName', prop: 'warehouseId', span: 8, formType: 'select', isRule: true,
              isRelation: true, relationList: [{receive: 'warehouseName', value: 'warehouseName'}],
              nameCode: 'warehouseName', valueCode: 'id',
              isRelationTable: true, relationTable: ['warehouseReportlossDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'warehouseName'
            },
            // 主要报损材料
            { label: 'warReportloss.mainReportlossMaterials', prop: 'mainReportlossMaterials', span: 8, formType: 'input',
              inputStatus: 'disable', placeholder: 'warReportloss.mainReportlossMaterialsTips', // 自动获取明细前1-5行明细名称
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 报损办理人
            { label: 'warReportloss.reportlossAgentUserName', prop: 'reportlossAgentUserName', span: 8, formType: 'input', maxlength: 32, isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 报损日期
            { label: 'warReportloss.reportlossDate', prop: 'reportlossDate', span: 8, formType: 'date', isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 金额合计
            {
              label: 'warReportloss.totalAmount', prop: 'totalAmount', span: 8, formType: 'elNumber', min: 0, precision: 2,
              maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 税额合计
            {
              label: 'warReportloss.totalTaxAmount', prop: 'totalTaxAmount', span: 8, formType: 'elNumber', min: 0, precision: 2,
              maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 价税合计
            {
              label: 'warReportloss.totalPriceTax', prop: 'totalPriceTax', span: 8, formType: 'elNumber', min: 0, precision: 2,
              maxlength: 12, inputStatus: 'disable', filterName: 'setMoney',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // (报损原因)备注
            { label: 'warReportloss.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256,
              printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload'}
        ],
        oldRelationList: []
    },
    subTableMatch: [
      {value: 'reportlossDetails', assignment: 'warehouseReportlossDetail'}
    ],
    // 子表
    subTableConfig: {
      // 明细清单
      warehouseReportlossDetail: {
          subTableName: 'warehouseReportlossDetail',
          titleTips: 'warehouseReportlossDetailTips',
          isSelection: true,
          // 子表按钮
          subTableButton: [
            { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'warehouseReportlossDetail', disabled: false },
             // 导出明细
            { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'warehouseReportlossDetail', name: 'button.export', authCode: 'export' },
            {noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'warehouseReportlossDetail', disabled: false}
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
                  //  报损单价(不含税)
                 {
                    label: 'warReportloss.reportlossUnitPrice', prop: 'reportlossUnitPrice', formType: 'text', precision: 8,
                    maxlength: 12, minWidth: 120, filterName: 'setMoney',
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 税率%
                  {
                    label: 'warReportloss.taxRate', prop: 'taxRate', minWidth: 60, formType: 'text', filterName: 'taxRate', operateData: true,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 币种
                  {
                    label: 'warReportloss.currencyCode', prop: 'currencyValue', minWidth: 80, formType: 'text',
                    printWidth: 6, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  // 存放库位
                  {
                    label: 'warReportloss.warehouseShelvesName', prop: 'warehouseShelvesName', minWidth: 100, formType: 'text',
                    printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  //  可用库存数量
                  { label: 'warReportloss.stock', prop: 'realStock', formType: 'text', filterName: 'number', minWidth: 100,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  报损数量
                  { label: 'warReportloss.currentReportlossQuantity', prop: 'currentReportlossQuantity', formType: 'slot', minWidth: 120,
                    operateData: true, precision: 4, min: 0, maxlength: 12,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 金额(不含税)
                  { label: 'warReportloss.excludeTaxAmount', prop: 'excludeTaxAmount', formType: 'text', filterName: 'setMoney',
                    operateData: true, precision: 2, maxlength: 12, minWidth: 100,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 税额
                  { label: 'warReportloss.taxAmount', prop: 'taxAmount', formType: 'text', filterName: 'setMoney',
                    operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 60,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 价税合计
                  { label: 'warReportloss.includeTaxAmount', prop: 'includeTaxAmount', formType: 'text', filterName: 'setMoney',
                    operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 80,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 报损原因(备注)
                  { label: 'warReportloss.subTableRemarks', prop: 'remarks', formType: 'input', minWidth: 120, maxlength: 255,
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
