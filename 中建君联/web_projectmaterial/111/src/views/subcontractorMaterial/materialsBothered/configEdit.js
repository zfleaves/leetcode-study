/*
 * @Author: your name
 * @Date: 2021-04-19 11:59:54
 * @LastEditTime: 2022-07-11 15:51:20
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\subcontractorMaterial\materialsBothered\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'materialsBothered/getWorkflowNextNode',
      parmasList: [
        {receive: 'sid', value: 'taskSid'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'materialsBothered/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'materialsBothered/setDelete',
      params: 'subcontractMaterialExitId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'materialsBothered/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'materialsBothered/getInfo',
      params: 'subcontractMaterialExitId'
    },
    // save
    saveUrl: {
      url: 'materialsBothered/setEdit'
    },
    dowanloadDetail: {
      url: 'materialsBothered/getDownloadTemplate',
      tableName: 'detail'
    },
    exportDetail: {
      url: 'materialsBothered/exportDetail',
      params: 'subcontractMaterialExitId'
    }
  },
    // 数据字典
    dictionary: [
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
              check: true, isRule: true, isRelation: true,
              relationList: [{receive: 'projectCode', value: 'projectCode'},
              {receive: 'projectUnitName', value: 'projectUnitName'},
              {receive: 'projectUnitId', value: 'projectUnitId'}],
              relationTable: ['subcontractMaterialExitDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目编号
            { label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 分包商名称
            {
              label: 'materialsBothered.projectUnitName', prop: 'projectUnitId', span: 8, formType: 'select', isRule: true,
              isRelation: true, relationList: [{receive: 'projectUnitName', value: 'name'}],
              nameCode: 'name', valueCode: 'id',
              relationTable: ['subcontractMaterialExitDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'projectUnitName'
            },
            // 登记人
            { label: 'materialsBothered.registerName', prop: 'registerName', span: 8, formType: 'input', maxlength: 32, isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 退场日期
            { label: 'materialsBothered.exitTime', prop: 'exitTime', span: 8, formType: 'date', isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0,
              otherOperate: true, otherOperateFun: 'handleSetRequiredDateUsePlace'
            },
            // 价税合计
            {
              label: 'dialog.totalPriceTax', prop: 'totalIncludeTaxAmount', span: 8, formType: 'elNumber', precision: 2, maxlength: 12, inputStatus: 'disable',
              printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0, filterName: 'setMoney'
            },
            // 主要退场材料
            { label: 'materialsBothered.mainExitMaterial', prop: 'mainExitMaterial', span: 8, formType: 'input',
              inputStatus: 'disable', placeholder: 'materialsBothered.mainExitMaterialTips', // 自动获取明细前1-5行明细名称
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
      {value: 'details', assignment: 'subcontractMaterialExitDetail'}
    ],
    // 子表
    subTableConfig: {
      // 明细清单
      subcontractMaterialExitDetail: {
          subTableName: 'subcontractMaterialExitDetail',
          titleTips: 'subcontractMaterialExitDetailTips',
          isSelection: true,
          // 子表按钮
          subTableButton: [
            { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'subcontractMaterialExitDetail', disabled: false },
              // 导出明细
            { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'subcontractMaterialExitDetail', name: 'button.export', authCode: 'export' },
            {noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'subcontractMaterialExitDetail', disabled: false}
          ],
          tableList: {
              // 表头配置
              slaveColumns: [
                  // 材料名称
                  { label: 'fConfig.materialName', prop: 'varietiesName', formType: 'text', maxlength: 64,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 规格
                  { label: 'fConfig.standards', prop: 'standards', formType: 'text', minWidth: 120, maxlength: 64,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 型号
                  { label: 'fConfig.models', prop: 'models', formType: 'text', minWidth: 120, maxlength: 64,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 品牌
                  { label: 'fConfig.brand', prop: 'brand', formType: 'text', minWidth: 120, maxlength: 128,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 计量单位
                  { label: 'fConfig.unit', prop: 'unit', formType: 'text', minWidth: 60, maxlength: 32,
                    printWidth: 5, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  进场数量
                  { label: 'materialsBothered.enterQuantity', prop: 'enterQuantity', formType: 'text',
                    operateData: true, precision: 4, maxlength: 12,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  已退场数量
                  { label: 'materialsBothered.exitApplyQuantity', prop: 'exitApplyQuantity', formType: 'text',
                    operateData: true, precision: 4, maxlength: 12,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  本次退场数量
                  { label: 'materialsBothered.exitQuantity', prop: 'exitQuantity', formType: 'number',
                    operateData: true, precision: 4, maxlength: 12,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 税率(%)
                  {
                    label: 'fConfig.taxRate', prop: 'taxRate', formType: 'text',
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, minWidth: 100, filterName: 'taxRate', selectList: []
                  },
                  //  单价(含税)
                  {
                    label: 'fConfig.includeUnitPrice', prop: 'includeUnitPrice', formType: 'text', minWidth: 120,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  金额(含税)
                  {
                    label: 'fConfig.includeTaxAmount', prop: 'includeTaxAmount', formType: 'text', minWidth: 120, filterName: 'setMoney',
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  单价(不含税)
                  {
                    label: 'fConfig.unitPrice', prop: 'excludeUnitPrice', formType: 'text', minWidth: 120,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  金额(不含税)
                  {
                    label: 'fConfig.excludeTaxAmount', prop: 'excludeTaxAmount', formType: 'text', minWidth: 120, filterName: 'setMoney',
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  税额
                  {
                    label: 'fConfig.taxAmount', prop: 'taxAmount', formType: 'text', minWidth: 120, filterName: 'setMoney',
                    printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  //  退场日期
                  { label: 'materialsBothered.exitTime', prop: 'exitTime', formType: 'date',
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  // 备注
                  { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  }
              ],
              // 校验
              rules: {
                exitQuantity: [
                  { required: true, trigger: 'blur'}
                ],
                exitTime: [
                  { required: true, trigger: 'blur'}
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
